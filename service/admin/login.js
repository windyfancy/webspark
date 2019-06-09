var crypto = require('crypto');
 
var banIpList=[];
function checkUserIp(userIp,setFlag){
    for(var i=banIpList.length-1;i>=0;i--){
        let item=banIpList[i];
        let ip=item[0];
        let count=item[1];
        let time=item[2];
        if(new Date().getTime()-time>1000*180){ //超过3分钟，解禁
            banIpList.splice(i,1)
        }else{
            if(ip==userIp){
                if(count>=3){       // 错误次数超过3次
                    return false; 
                }else if(setFlag){  // 错误次数 +1
                    item[1]=count+1;
                }
            }
        }
    }

    if(setFlag){ //3分钟内首次输错，记录ip的时间
        banIpList.push([userIp,1,new Date().getTime()])
    }

    return true;
}
module.exports= {  
    onLoad() {  
        var data=this.request.data;
        if(data &&  Object.keys(data).length>0){
            if(!checkUserIp(this.request.clientIP)){
                this.render(JSON.stringify({
                    code:"IP_Limit",
                    msg:"密码错误次数超过限制，请3分钟后再试"
                }));
                return
            }
            var password=crypto.createHash('md5').update(data.password).digest("hex");

            this.database.select("wb_user",{
                type:[1,2,10],
                userName:data.userName,
                password:password
            }).then(async (result)=>{
               if(result.length>0){
                   var userId=result[0].id;
                   var userName=result[0].userName;
                   var type=result[0].type;
                   var theme="default";
                   var configList=await this.database.select("wb_config");
                   configList.forEach((item)=>{
                        if(item.configKey=="theme"){
                            theme=item.configValue;
                        }
                   })
                   var obj={"userId":userId,"userName":userName,"userType":type,"theme":theme};
                   this.session.set(obj).then(()=>{
                        this.render(JSON.stringify({
                            code:"OK",
                            ...obj
                        }));
                   })
        
               }else{
                    checkUserIp(this.request.clientIP,true);
                    this.render(JSON.stringify({
                        code:"Password_Error",
                        msg:"用户名或密码不正确"
                    }));
               }
                
            })
        }
        
    },
    restore(){
        this.session.load().then((session)=>{
            if(session.userId){
                var obj={"userId":session.userId,"userName":session.userName,"userType":session.userType,"theme":session.theme};
                
                this.render(JSON.stringify({
                    code:"OK",
                    ...obj
                }));
            }else{
                this.render(JSON.stringify({
                    code:"Error" 
                }));
            }
            
        });
    },
    async logout(){
        await this.session.clear();
        this.response.body=JSON.stringify({code:"OK"})
    }
  }