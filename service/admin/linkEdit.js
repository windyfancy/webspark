module.exports= {  
    onRequest() {  
        var data=this.request.data;
        this.database.replace("wb_link",data).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
    }
  }