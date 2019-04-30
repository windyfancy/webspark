module.exports= {  
    onRequest() {  
        var data=this.request.data;
        // this.database.delete("wb_article",{id:data.id}).then( (e)=>{
        //     this.render({msg:'{code:"OK"}'});
        // })
        var ids=data.id;
        var str=ids.map(()=>{
            return "?"
        }).join(",")
        this.database.query("delete from wb_article where id in ("+str+")",ids).then( (e)=>{
            this.render({msg:'{code:"OK"}'});
        })
    }
  }