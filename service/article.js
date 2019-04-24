const dataQuery=require("./common/dataQuery.js");
const markdown = require( "markdown" ).markdown;


module.exports= {  
  onRequest() {  
    if(this.request.query["id"]){
        dataQuery.getRenderData(this,{articleId:this.request.query["id"]}).then( (renderObj)=>{
            let article=renderObj.articleList[0];
            article.content=markdown.toHTML(article.content);

            this.render(renderObj);
          })
    }else{
        this.render("no data")
    }

      
  }
}