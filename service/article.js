const dataQuery=require("./common/dataQuery.js");
const marked = require('marked');


module.exports= {  
  onRequest() {  
    if(this.request.query["id"]){
        dataQuery.getRenderData(this,{articleId:this.request.query["id"]}).then( (renderObj)=>{
            let article=renderObj.articleList[0];

            const renderer = new marked.Renderer();
 
            article.content=marked(article.content,{
              breaks: true,
              headerIds: false,
              renderer: renderer
          });

            this.render(renderObj);
          })
    }else{
        this.render("no data")
    }

      
  }
}