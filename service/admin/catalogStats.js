module.exports= {  
    onRequest() {  
        var data=this.request.data;

        if(data.catalog && data.catalog.length>0){
            data.catalog.forEach((catalogId)=>{
                if(catalogId!=null){
                    var sql="update wb_catalog set count=(select count(*) from wb_article where catalogId=?) where id=? "
                    this.database.query(sql,[catalogId,catalogId]).then(  (e)=>{
                        this.render(JSON.stringify(e));
                    })
                }else{
                    this.response.body="{msg:'catalogId is null'}"
                }
            })
        }
        
    }
  }