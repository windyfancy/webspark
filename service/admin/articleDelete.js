module.exports= {  
    onRequest() {  
        var data=this.request.data;
        this.database.delete("wb_article",{id:data.id}).then( (e)=>{
            this.render({msg:'{code:"OK"}'});
        })
        
    }
  }