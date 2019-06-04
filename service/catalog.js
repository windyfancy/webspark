const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onLoad() {  
    if(this.request.query["id"]){
       let catalogId=this.request.query["id"]
        dataQuery.getRenderData(this,{catalogId:catalogId}).then( (renderObj)=>{
          var result=renderObj.catalogList.filter((item)=>{
            return item.id==catalogId;
          })
          renderObj.title=result[0].title;
            this.render(renderObj);
          })
    }else{
        this.render("no data")
    }

      
  }
}