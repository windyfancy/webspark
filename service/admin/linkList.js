module.exports= {  
    onRequest() {  
        var data=this.request.data;
        this.database.select("wb_link",{type:data.type}).then(  (result)=>{
            this.render(JSON.stringify(result));
        })
    }
  }