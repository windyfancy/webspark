module.exports= {  
    getRenderData(ctx,options) {  
        if(!options){options={};}

        return new Promise( (resolve)=>{
            var p1=ctx.database.select("wb_catalog");
            var p2=ctx.database.select("wb_link");

            var params={};
            var columns=["id","title","summary"];
            if(options.catalogId){ //查询栏目
                params.catalogId=options.catalogId;
            }
            if(options.articleId){ //查询单篇文章
                params.id=options.articleId;
                columns=["*"];
            }
            var p3=ctx.database.select("wb_article",params,{
                orderBy:"createTime desc",
                columns:columns,
                pageIndex:options.pageIndex || 1,
                pageSize:20
            })
        
            Promise.all([p1,p2,p3]).then( (results)=>{
                var renderObj={
                    catalogList:results[0],
                    articleList:results[2].rows,
                    articleCount:results[2].totalCount
                }
        
                var links={};
                results[1].forEach(function (item){
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