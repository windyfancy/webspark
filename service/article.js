const dataQuery=require("./common/dataQuery.js");
const marked = require('marked');


module.exports= {  
  onLoad() {  
    if(this.request.query["id"]){
        dataQuery.getRenderData(this,{articleId:this.request.query["id"]}).then( (renderObj)=>{
            let article=renderObj.articleList[0];

            const renderer = new marked.Renderer();
            let content=article.content?article.content:"";
            article.content=marked(content,{
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