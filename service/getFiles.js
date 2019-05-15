var path=require("path")
module.exports= {  
    onLoad() {  
        var fileName= this.request.query.name;
        fileName=path.resolve(this.workDirectory,this.config["uploadDir"]+"/"+fileName)
        this.response.writeFile(fileName);
    }
  }