module.exports= {  
    onRequest() {  
        var data=this.request.data;

        if(data.catalog && data.catalog.length>0){
            data.catalog.forEach(async (catalogId)=>{
                if(catalogId!=null){
                    var sql="update wb_catalog set count=(select count(*) from wb_article where catalogId=?) where id=? "
                    await this.database.query(sql,[catalogId,catalogId])

                    if(data.tag){
                        var arr=[]
                        data.tag.forEach(function (item){
                            arr.push(item.key)
                        })
                        var tagIdList=arr.join(",")

                        var sql=`update wb_tag t join 
                        (SELECT a.tagId,b.title,count(a.id) as count FROM todo_db.wb_article_tag a inner join wb_article b  on (a.articleId=b.id) where tagId in (${tagIdList}) group by a.tagId) as c
                        on (t.id=c.tagId) set t.count=c.count`;

                        await this.database.query(sql,[]);
                    }

                    
                    this.render(JSON.stringify({code:"OK"}));
                    

                     
                     
                }else{
                    this.response.body="{msg:'catalogId is null'}"
                }
            })
        }
        
    }
  }