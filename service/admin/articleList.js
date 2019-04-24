module.exports= {  
    onRequest() {  
        var data=this.request.data;
        var params={};
        if(data.id){
            params={id:data.id};
        }else if(data.catalogId){
            params={catalogId:data.catalogId};
        }
        this.database.select("wb_article",params,{
            orderBy:"createTime desc",
            pageIndex:data.pageIndex,
            pageSize:data.pageSize
        }).then( (result)=>{
            this.render(JSON.stringify(result));
        })
    }
  }