module.exports= {  
    onRequest() {  
        var data=this.request.data;
        this.database.delete("wb_catalog",{id:data.id}).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
        
    }
  }