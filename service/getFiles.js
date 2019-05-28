var path=require("path");
var fs=require("fs");
module.exports= {  
    onLoad() {  
        var fileName= this.request.query.name;
        fileName=path.resolve(this.workDirectory,this.config["uploadDir"]+"/"+fileName);
        this.response.writeFile(fileName);
        
    }
  }