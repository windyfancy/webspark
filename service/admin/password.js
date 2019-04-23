var crypto = require('crypto');
 
module.exports= {  
    async onRequest() {  
        let session=await this.session.load();

        if(!session["userName"]){
            this.render({
                code:"Error",
                msg:"session invalid"
            })
        }
        var data=this.request.data;
        if(data){
            var password=crypto.createHash('md5').update(data.password).digest("hex");
            var passwordNew=crypto.createHash('md5').update(data.passwordNew).digest("hex");

            this.database.update("wb_user",{
                password:passwordNew
            }, {
                userName: session["userName"],
                password:password}
            ).then((result)=>{
               if(result.length>0){
                   var userName=result[0].userName;
                   this.render(JSON.stringify({
                        code:"OK",
                        userName:userName
                    }));
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