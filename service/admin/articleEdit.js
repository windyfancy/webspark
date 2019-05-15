module.exports= {  
    onLoad() {  
        var data=this.request.data;
        if(data.createTime){
            data.createTime=new Date(data.createTime);
        }
        if(data.modifyTime){
            data.modifyTime=new Date(data.modifyTime);
        }
        this.database.replace("wb_article",data).then((e)=>{
            
            this.render(JSON.stringify(e));
        })
        
    }
  }