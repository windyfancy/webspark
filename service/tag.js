const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onLoad() {  
    if(this.request.query["id"]){
        dataQuery.getRenderData(this,{tagId:this.request.query["id"]}).then( (renderObj)=>{
            this.render(renderObj);
          })
    }else{
        this.render("no data")
    }

      
  }
}