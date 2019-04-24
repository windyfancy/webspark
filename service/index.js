const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onRequest() {  
   
    dataQuery.getRenderData(this).then( (renderObj)=>{
      this.render(renderObj);
    })
      
  }
}