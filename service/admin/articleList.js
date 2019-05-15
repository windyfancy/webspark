module.exports= {  
    onLoad() {  
        var data=this.request.data;
        var params={};
        var sql=`select a.id,title,catalogId,summary,$content (select group_concat(tagId) from wb_article_tag b where b.articleId=a.id) as tagList 
            FROM wb_article a`
        if(data.id){
            params={id:data.id};
            sql=sql.replace("$content","content,")
        }else{
            sql=sql.replace("$content","") //列表模式，不需要content字段
        }
        
        if(data.catalogId){
            params={catalogId:data.catalogId};
        }

        if(data.tagId){
            params["c.tagId"]=data.tagId;
            sql+=" inner join wb_article_tag c on (a.id=c.articleId)"
        } 


        this.database.select(sql,params,{
            orderBy:"a.createTime desc",
            pageIndex:data.pageIndex,
            pageSize:data.pageSize
        }).then( (result)=>{
            this.render(JSON.stringify(result));
        })
    }
  }