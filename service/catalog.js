const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onRequest() {  
    if(this.request.query["id"]){
        dataQuery.getRenderData(this,{catalogId:this.request.query["id"]}).then( (renderObj)=>{
            this.render(renderObj);
          })
    }else{
        this.render("no data")
    }

      
  }
}