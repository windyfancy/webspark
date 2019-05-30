var path=require("path")
module.exports= {  
    async onLoad() {  
        //var fileName=path.basename(this.request.files.file.path);
        var allow=await this.checkPermission(2);
        if(allow){
            var root=path.resolve(this.config.uploadDir);
            var fileName=path.relative(root,this.request.files.file.path).replace("\\","/");
            this.render({fileName:fileName});
        }
    }
  }