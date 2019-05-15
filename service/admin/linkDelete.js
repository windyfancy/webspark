module.exports= {  
    onLoad() {  
        var data=this.request.data;
        this.database.delete("wb_link",{id:data.id}).then((e)=>{
            this.render({msg:'{code:"OK"}'});
        })
        
    }
  }