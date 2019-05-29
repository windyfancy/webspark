module.exports= {  
    async onLoad() { 
        var allow=await this.checkPermission(1);
        return allow;
    },
    list() {  
        var data=this.request.data;
        this.database.select("wb_link",{type:data.type}).then(  (result)=>{
            this.render(JSON.stringify(result));
        })
    },
    delete() {  
        var data=this.request.data;
        this.database.delete("wb_link",{id:data.id}).then((e)=>{
            this.render({msg:'{code:"OK"}'});
        })
        
    },
    edit() {  
        var data=this.request.data;
        this.database.replace("wb_link",data).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
    }
  }