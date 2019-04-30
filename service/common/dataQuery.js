module.exports= {  
    getRenderData(ctx,options) {  
        if(!options){options={};}

        return new Promise( (resolve)=>{
            var p1=ctx.database.select("wb_catalog");
            var p2=ctx.database.select("wb_tag");
            var p3=ctx.database.select("wb_link");

            var params={};
            var columns=["id","title","summary"];
            if(options.catalogId){ //查询栏目
                params.catalogId=options.catalogId;
            }


            let pageIndex=1;
            if(ctx.request.query["page"]){
                pageIndex=ctx.request.query["page"];
            }

            var sql=`select a.id,title,summary,$content (select group_concat(tagId) from wb_article_tag b where b.articleId=a.id) as tagList 
            FROM wb_article a`

            if(options.articleId){ //查询单篇文章
                params.id=options.articleId;
                sql=sql.replace("$content","content,")
            }else{
                sql=sql.replace("$content","") //列表模式，不需要content字段
            }

            if(options.tagId){
                params["c.tagId"]=options.tagId;
                sql+=" inner join wb_article_tag c on (a.id=c.articleId)"
            } 

            var p4=ctx.database.select(sql,params,{
                orderBy:"a.createTime desc",
                pageIndex:pageIndex,
                pageSize:20
            })
        
            Promise.all([p1,p2,p3,p4]).then( (results)=>{
                var renderObj={
                    context:ctx,
                    themeName:"default",
                    themeDir:"themes/default",
                    catalogList:results[0],
                    tagList:results[1],
                    articleList:results[3].rows,
                    articleCount:results[3].totalCount
                }
        
                var tagMap={};
                renderObj.tagList.forEach((item)=>{
                    tagMap[item.id]=item.title;
                })
                renderObj.tagMap=tagMap;
               

                //deal with link
                var links={
                    home:[],
                    sidebar:[],
                    friend:[],
                    footer:[]
                };
                results[2].forEach(function (item){
                let type=item.type;
                if(!links[type]){
                    links[type]=[];
                }
                links[type].push(item);
                })
                renderObj.linkList=links;
        
  
                resolve(renderObj);
            })
  
        });
    }
  }