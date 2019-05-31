const dataQuery=require("./common/dataQuery.js");
const marked = require('marked');


module.exports= {  
  onLoad() {  
    if(this.request.query["id"]){
        var aid=this.request.query["id"];
        dataQuery.getRenderData(this,{articleId:aid}).then( async (renderObj)=>{
            let article=renderObj.articleList[0];

            const renderer = new marked.Renderer();
            let content=article.content?article.content:"";
            article.content=marked(content,{
              breaks: true,
              headerIds: false,
              renderer: renderer
            });
            renderObj.articleId=aid;
            renderObj.commentList=await this.getCommentList()

            this.render(renderObj);
        })
    } 

      
  },
  async getCommentList(){
    var result=[];
    if(this.request.query["id"]){
      var artId=this.request.query["id"];
      result=await this.database.select("wb_comment",{articleId:artId});
    
    }
    return result;
  }

}