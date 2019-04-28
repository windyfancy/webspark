module.exports= {  
    onRequest() {  
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