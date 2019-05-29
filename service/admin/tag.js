module.exports= {  
    async onLoad() { 
        var allow=await this.checkPermission(1);
        return allow;
    },
    list() {  
        var data=this.request.data;
        var options={};
        if(data.pageIndex){
            options.pageIndex=data.pageIndex,
            options.pageSize=data.pageSize
        }
        this.database.select("wb_tag",{},options).then(  (result)=>{
            this.render(JSON.stringify(result));
        })
    },
    delete() {  
        var data=this.request.data;
        this.database.delete("wb_tag",{id:data.id}).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
        
    },
    edit() {  
        var data=this.request.data;
        if(data.tagList){
            var promiseList=[];
            data.tagList.forEach((item)=>{
                let p=this.database.insert("wb_tag",{title:item})
                promiseList.push(p)
            })
            Promise.all(promiseList).then( (args)=>{
                var list=[];
                for(var i=0;i<args.length;i++){
                    list.push(args[i].insertId);
                }
                this.render(JSON.stringify({code:"OK",list:list}));
            })
            
        }else{
            this.database.replace("wb_tag",data).then(  (e)=>{
                this.render(JSON.stringify(e));
            })
        }
      
    }
  }