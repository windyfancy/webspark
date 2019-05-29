var WebContext=require("webcontext");
var app=new WebContext();

app.mixin({
  checkPermission(userType){
    return new Promise((resolve)=>{
      this.session.load().then((session)=>{
        if(session["userName"] && session["userType"]<=userType){
            resolve(true);
            return ;
        }else{
            this.response.end('{"code":"Permission_Deny"}');
            resolve(false);
        }
      })
    });
  }
})
 