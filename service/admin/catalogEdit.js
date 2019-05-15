module.exports= {  
    onLoad() {  
        var data=this.request.data;
        this.database.replace("wb_catalog",data).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
    }
  }