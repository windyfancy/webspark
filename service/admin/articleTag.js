module.exports= {  
    async onLoad() { 
        var allow=await this.checkPermission(2);
        return allow;
    },
    list() {  
        var data=this.request.data;
        if(data.articleId){
            this.database.query("select a.*,b.title from wb_article_tag a inner join wb_tag b on(a.tagId=b.id) where articleId=?",[data.articleId]).then((result)=>{
                this.render(JSON.stringify(result));
            })
             
            
        }
        
    },
    async mark() {  
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
        
    },
    edit() {  
        var data=this.request.data;
        if(data.tagList){
            this.database.delete("wb_article_tag",{articleId:data.articleId}).then(()=>{
                var promiseList=[];
                data.tagList.forEach((tagId)=>{
                    let p=this.database.insert("wb_article_tag",{
                        articleId:data.articleId,
                        tagId,tagId
                    })
                    promiseList.push(p)
                })
                Promise.all(promiseList).then( ()=>{
                    this.render(JSON.stringify({code:"OK"}));
                })

            })
            
        }
        
    }
  }