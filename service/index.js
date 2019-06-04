const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onLoad() {  
   
    dataQuery.getRenderData(this).then( (renderObj)=>{
      renderObj.title="WebSpark"
      this.render(renderObj);
    })
      
  }
}