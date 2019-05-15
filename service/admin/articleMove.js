module.exports= {  
    onLoad() {  
        var data=this.request.data;
        if(data.articleList){
            var str=data.articleList.map(function (){return "?"}).join(",")
            var sql="update wb_article set catalogId=? where id in ("+str+")";
            var params=[data.catalogId];
            params=params.concat(data.articleList);
            this.database.query(sql,params).then(()=>{
                this.render(JSON.stringify({code:"OK"}));

            })
            
        }
        
    }
  }