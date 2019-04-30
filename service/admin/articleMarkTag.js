module.exports= {  
    async onRequest() {  
        var data=this.request.data;

        if(data.removeOrigin){
            await this.database.delete("wb_article_tag",{articleId:data.articleList})
        }

        if(data.articleList){
            var sql="replace into wb_article_tag (articleId,tagId) values ";
            data.articleList.forEach((articleId)=>{
                sql+="("+articleId+","+data.tagId+"),";
            });
            sql=sql.replace(/,$/,";");

            this.database.query(sql,[]).then(()=>{
                this.render(JSON.stringify({code:"OK"}));

            })
            
        }
        
    }
  }