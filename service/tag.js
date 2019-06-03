const dataQuery=require("./common/dataQuery.js");

module.exports= {  
  onLoad() {  
    if(this.request.query["id"]){
      let tagId=this.request.query["id"]
        dataQuery.getRenderData(this,{tagId:tagId}).then( (renderObj)=>{
          var result=renderObj.tagList.filter((item)=>{
            return item.id==tagId;
          })
          renderObj.title=result[0].title;
            this.render(renderObj);
          })
    }else{
        this.render("no data")
    }

      
  }
}