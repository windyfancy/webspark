const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onLoad() {  
   
    dataQuery.getRenderData(this).then( (renderObj)=>{
      this.render(renderObj);
    })
      
  }
}