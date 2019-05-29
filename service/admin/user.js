module.exports= {  

    list() {  
        var data=this.request.data;
        var options={orderBy:"createTime desc"};
        if(data.pageIndex){
            options.pageIndex=data.pageIndex,
            options.pageSize=data.pageSize
        }
        this.database.select("wb_user",{},options).then(  (result)=>{
            this.render(JSON.stringify(result));
        })
    },
    async add(){
        var data=this.request.data;
        var params={
            userName:data.userName,
            nickName:data.nickName,
            password:this.server.md5(data.password),
            type:data.type,
            status:1,
            createTime:new Date()
        };

        let exists=await this.database.exists("wb_user",{userName:data.userName});
        if(!exists){
            this.database.insert("wb_user",params).then(  (result)=>{
                this.render(JSON.stringify(result));
            })
        }else{
            this.render(JSON.stringify({code:"Error_UserExists"}));
        }
    },
    edit(){
        var data=this.request.data;
        var params={
            id:data.id,
            userName:data.userName,
            nickName:data.nickName,
            type:data.type,
        };
        if(data.password){
            params.password=this.server.md5(data.password);
        }
        this.database.update("wb_user",params).then(  (result)=>{
            this.render(JSON.stringify(result));
        })

    },
    disable(){
        debugger;
        var data=this.request.data;
        var params={
            id:data.id,
            status:data.status
        }
        this.database.update("wb_user",params).then(  (result)=>{
            this.render(JSON.stringify(result));
        })
    }
  }