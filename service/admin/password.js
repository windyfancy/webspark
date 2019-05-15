var crypto = require('crypto');
 
module.exports= {  
    async onLoad() {  
        let session=await this.session.load();

        if(!session["userName"]){
            this.render({
                code:"Error",
                msg:"session invalid"
            })
        }
        var data=this.request.data;
        if(data){
            var passwordOld=crypto.createHash('md5').update(data.passwordOld).digest("hex");
            var passwordNew=crypto.createHash('md5').update(data.passwordNew).digest("hex");

            this.database.update("wb_user",{
                password:passwordNew
            }, {
                userName: session["userName"],
                password:passwordOld}
            ).then((result)=>{
               if(result.affectedRows==1){
                   this.render(JSON.stringify({
                        code:"OK"
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