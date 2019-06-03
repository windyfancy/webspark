 

module.exports= {  
  onLoad() { },

  add(){
    var data=this.request.data;
    this.session.load().then((session)=>{
      if(session["userName"]){
        this.database.insert("wb_comment",{
          articleId:data.articleId,
          content:data.content,
          ip:this.request.clientIP,
          userId:session["userId"],
          author:session["userName"],
          createTime:new Date()
        
        }).then(()=>{
          this.render(JSON.stringify({code:"OK"}))
        })
      }else{
          this.render(JSON.stringify({code:"NotLogin"}))
      }
    })

  },
  async delete(){
    var data=this.request.data;
    let session=await this.session.load();
    if(session.userType==1){
      this.database.delete("wb_comment",{id:data.id}).then(()=>{
        this.render(JSON.stringify({code:"OK"}))
      })
    }else{
      this.database.delete("wb_comment",{id:data.id,userId:session.userId}).then(()=>{
        this.render(JSON.stringify({code:"OK"}))
      })
    }
  }
  // async checkAllow(){
  //   let session=await this.session.load();
  //   if(session.userType==1){
  //     return true;
  //   }
  // }

}