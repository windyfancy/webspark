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
            if(options.articleId){ //查询单篇文章
                params.id=options.articleId;
                columns=["*"];
            }

            let pageIndex=1;
            if(ctx.request.query["page"]){
                pageIndex=ctx.request.query["page"];
            }

            var sql=`SELECT a.id,title,summary,(select group_concat(tagId) from wb_article_tag c where c.articleId=a.id) as tagList 
            FROM wb_article a inner join wb_article_tag b 
            on (a.id=b.articleId)`

            if(options.tagId){
                params["b.tagId"]=options.tagId;
                
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