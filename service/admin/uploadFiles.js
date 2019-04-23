var path=require("path")
module.exports= {  
    onRequest() {  
        var fileName=path.basename(this.request.files.file.path);
      
        this.render({fileName:fileName});
    }
  }