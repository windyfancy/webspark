var crypto = require('crypto');
 
module.exports= {  
    async onLoad() {  
        var data=this.request.data;
        var params={
            userName:data.userName,
            nickName:data.nickName,
            password:this.server.md5(data.password),
            type:10,
            status:1,
            createTime:new Date()
        };
        if(params.userName.length<4){
            this.render(JSON.stringify({code:"UserName_TooShort",msg:"用户名不能少于4位字符"}));
            return 
        }else if(params.password.length<6){
            this.render(JSON.stringify({code:"Password_TooShort",msg:"密码不能少于6位字符"}));
            return 
        }else if(params.password.match(/\d+^$/)){
            this.render(JSON.stringify({code:"Password_PureNumber",msg:"密码不能使用纯数字"}));
            return 
        }

        let exists=await this.database.exists("wb_user",{userName:data.userName});
        if(!exists){
            this.database.insert("wb_user",params).then(  (result)=>{
                this.render(JSON.stringify({code:"OK",result:result}));
            })
        }else{
            this.render(JSON.stringify({code:"UserExists",msg:"用户已存在"}));
        }
        
    } 
  }