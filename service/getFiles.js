var path=require("path")
module.exports= {  
    onRequest() {  
        var fileName= this.request.query.name;
        fileName=path.resolve(this.workDirectory,this.config["uploadDir"]+"/"+fileName)
        this.response.writeFile(fileName);
    }
  }