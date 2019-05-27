module.exports= {  
    onLoad() { },
    list(){
        var data=this.request.data;
        var params={};
        var sql=`select a.id,title,catalogId,summary,$content (select group_concat(tagId) from wb_article_tag b where b.articleId=a.id) as tagList 
            FROM wb_article a`
        if(data.id){
            params={id:data.id};
            sql=sql.replace("$content","content,")
        }else{
            sql=sql.replace("$content","") //列表模式，不需要content字段
        }
        
        if(data.catalogId){
            params={catalogId:data.catalogId};
        }

        if(data.tagId){
            params["c.tagId"]=data.tagId;
            sql+=" inner join wb_article_tag c on (a.id=c.articleId)"
        } 


        this.database.select(sql,params,{
            orderBy:"a.createTime desc",
            pageIndex:data.pageIndex,
            pageSize:data.pageSize
        }).then( (result)=>{
            this.render(JSON.stringify(result));
        })
    },
    delete() {  
        var data=this.request.data;
        var ids=data.id;
        var str=ids.map(()=>{
            return "?"
        }).join(",")
        this.database.query("delete from wb_article where id in ("+str+")",ids).then( (e)=>{
            this.render({msg:'{code:"OK"}'});
        })
    },
    edit() {  
        var data=this.request.data;
        if(data.createTime){
            data.createTime=new Date(data.createTime);
        }
        if(data.modifyTime){
            data.modifyTime=new Date(data.modifyTime);
        }
        this.database.replace("wb_article",data).then((e)=>{
            
            this.render(JSON.stringify(e));
        })
        
    },
    move() {  
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