module.exports= {  
    onRequest() {  
        var data=this.request.data;
        if(data.articleId){
            this.database.query("select a.*,b.title from wb_article_tag a inner join wb_tag b on(a.tagId=b.id) where articleId=?",[data.articleId]).then((result)=>{
                this.render(JSON.stringify(result));
            })
             
            
        }
        
    }
  }