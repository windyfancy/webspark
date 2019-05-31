module.exports= {  
    async onLoad() { 
        var allow=await this.checkPermission(2);
        return allow;
    },
    list(){
        var data=this.request.data;
        var params={};
      
        this.database.select("wb_catalog",params).then((result)=>{
            this.render(JSON.stringify(result));
        })
    },
    delete() {  
        var data=this.request.data;
        this.database.delete("wb_catalog",{id:data.id}).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
        
    },
    edit() {  
        var data=this.request.data;
        this.database.replace("wb_catalog",data).then(  (e)=>{
            this.render(JSON.stringify(e));
        })
    },
    async stats() {  
        var data=this.request.data;

        if(data.catalog && data.catalog.length>0){

                var catalogIdList=data.catalog.join(",")
                var sql=`SELECT  catalogId,count(a.id) as count FROM wb_article a  where catalogId in(${catalogIdList}) group by a.catalogId`
                var result=await this.database.query(sql,[]);
                var plist=[];
                result.forEach((row)=>{
                    let p=this.database.update("wb_catalog",{count:row.count},{id:row.catalogId});
                    plist.push(p);
                })

                if(data.tag){
       
                    var tagIdList=data.tag.join(",")

                    var sql=`SELECT a.tagId as tagId,count(a.id) as count FROM wb_article_tag a inner join wb_article b  on (a.articleId=b.id) where tagId in (${tagIdList}) group by a.tagId`;

                    var result=await this.database.query(sql,[]);
                    result.forEach((row)=>{
                        let p=this.database.update("wb_tag",{count:row.count},{id:row.tagId});
                        plist.push(p);
                    })
                }
                Promise.all(plist).then( ()=>{
                    this.render(JSON.stringify({code:"OK"}));
                })
                
            
        }
        
    }
  }