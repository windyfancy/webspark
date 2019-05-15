module.exports= {  
    onLoad() {  
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