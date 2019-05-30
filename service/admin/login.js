var crypto = require('crypto');
 
module.exports= {  
    onLoad() {  
        var data=this.request.data;
        if(data){
            var password=crypto.createHash('md5').update(data.password).digest("hex");

            this.database.select("wb_user",{
                type:1,
                userName:data.userName,
                password:password
            }).then(async (result)=>{
               if(result.length>0){
                   var userName=result[0].userName;
                   var type=result[0].type;
                   var theme="default";
                   var configList=await this.database.select("wb_config");
                   configList.forEach((item)=>{
                        if(item.configKey=="theme"){
                            theme=item.configValue;
                        }
                   })
                   var obj={"userName":userName,"userType":type,"theme":theme};
                   this.session.set(obj).then(()=>{
                        this.render(JSON.stringify({
                            code:"OK",
                            ...obj
                        }));
                   })
        
               }else{
                    this.render(JSON.stringify({
                        code:"Error",
                        msg:"username or password is not correct"
                    }));
               }
                
            })
        }
        
    }
  }