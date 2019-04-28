module.exports= {  
    onRequest() {  
        var data=this.request.data;
        if(data.tagList){
            var promiseList=[];
            data.tagList.forEach((tagId)=>{
                let p=this.database.replace("wb_article_tag",{
                    articleId:data.articleId,
                    tagId,tagId
                })
                promiseList.push(p)
            })
            Promise.all(promiseList).then( ()=>{
                this.render(JSON.stringify({code:"OK"}));
            })
            
        }
        
    }
  }