module.exports= {  
    async onRequest() {  
        var data=this.request.data;

        if(data.catalog && data.catalog.length>0){
  
                var catalogIdList=data.catalog.join(",")
                var sql=`update wb_catalog t join 
                (SELECT  catalogId,count(a.id) as count FROM wb_article a  where catalogId in(${catalogIdList}) group by a.catalogId) as c
                on (t.id=c.catalogId) set t.count=c.count  where catalogId in (${catalogIdList})`
                await this.database.query(sql,[])

                if(data.tag){
       
                    var tagIdList=data.tag.join(",")

                    var sql=`update wb_tag t join 
                    (SELECT a.tagId,b.title,count(a.id) as count FROM wb_article_tag a inner join wb_article b  on (a.articleId=b.id) where tagId in (${tagIdList}) group by a.tagId) as c
                    on (t.id=c.tagId) set t.count=c.count where tagId in (${tagIdList})`;

                    await this.database.query(sql,[]);
                }
    
                this.render(JSON.stringify({code:"OK"}));
                    
 
            
        }
        
    }
  }