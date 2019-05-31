 

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
  delete(){
    var data=this.request.data;
    this.database.delete("wb_comment",{articleId:data.articleId}).then(()=>{
      this.render(JSON.stringify({code:"OK"}))
    })
  }

}