<style>
.editor textarea{
    height:500px;
}
.line{
    line-height:50px;
}
.upload_thumbnail{
    position: absolute;
    right:18px;
}
</style>
<template>
<div>
<p>
    <a-breadcrumb :routes="crumbList" separator=">" >
  
 </a-breadcrumb>
</p>
<div class="upload_thumbnail">
<a-upload
    name="file"
    listType="picture-card"
    class="avatar-uploader"
    :showUploadList="false"
    :action="uploadUrl"
    :beforeUpload="beforeUpload"
    @change="thumbnailChange"
  >
    <img v-if="thumbnail" :src="thumbnail" style="width:100px;" alt="封面" />
    <div v-else>
        <a-icon :type="loading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">上传封面</div>
    </div>
  </a-upload>
</div>
<p class="line" >
    标题：
    <a-input type="text" v-model="title" style="width:320px"/></p>

<p class="line">
    栏目：    
<a-select v-model="catalogId" style="width:200px">
        <a-select-option v-for="item in catalogList" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
</a-select>

 <a-checkbox v-model="status" style="margin-left:10px;">是否发布</a-checkbox> 

</p>
<p>
标签：    
<a-select style="width:300px"  mode="tags" v-model="tagSelected" :labelInValue="true"> 
    <a-select-option v-for="item in tagList" :value="item.key" :key="item.key">
        {{ item.label }}
    </a-select-option>
</a-select>
 
</p>

<div class="editor">
  <!--   <i-editor v-model="content" :config="uploadConfig" :img-url="uploadComplete"></i-editor> -->
  <MarkEditor v-model="content" :uploadUrl="uploadUrl" @uploadComplete="uploadComplete"></MarkEditor>
    
</div>

<p>
    <a-button type="primary" @click="doSave">发布</a-button>
     
    </p>

</div>
</template>
<script>
import MarkEditor from '../components/mark.editor.vue';
    export default {
        components: { MarkEditor },
        data () {
            return {
                crumbList: [
                {
                    breadcrumbName: "文章管理",
                    path: "/articleList"
                }
                ],
                articleId:null,
                title:"",
                thumbnail:null,
                status:true,
                uploadUrl:"/admin/uploadFiles",
                catalogIdOrigin:null,
                catalogId:null,
                catalogTitle:"",
                content:null,
                catalogList:[],
                tagSelected:[],
                tagList:[]

            } 
 
        },
        created:function (){
            if(this.$route.query["id"]){
                this.articleId=Number(this.$route.query["id"]);
            }

        },  
        mounted:function (){
             this.httpRequest("/admin/catalog:list",{}).then(  (result)=>{
                this.catalogList=result;
                this.loadContent();
            });

            this.httpRequest("/admin/tag:list",{}).then(  (result)=>{
                this.tagList=result.map(function (item){
                    return {label:item.title,key:item.id.toString()}
                });
                    
                this.httpRequest("/admin/articleTag:list",{articleId:this.articleId}).then(  (e)=>{
                    var arr=[];
                    e.forEach((item)=>{
                         arr.push({label:item.title,key:item.tagId.toString()})
                    })
                    this.tagSelected=arr;
                });
                
            });

        },
        methods:{
            getTagById(tagId){
                this.tagList.filter((item)=>{
                    return item.id==tagId
                })
            },
            loadContent(){
                if(this.articleId){
                    this.httpRequest("/admin/article:list",{id:this.articleId}).then(  (rows)=>{
                        if(rows.length>0){
                            let row=rows[0];
                            this.title=row.title;
                            this.catalogId=row.catalogId;
                            this.catalogIdOrigin=row.catalogId;
                            this.thumbnail=row.thumbnail;
                            this.status=row.status==1?true:false;
                            this.content=row.content;
                           
                            var catalogInfo=this.catalogList.filter((item)=>{
                                return item.id==this.catalogId;
                            })
                            if(catalogInfo.length>0){
                                this.crumbList.push({breadcrumbName:catalogInfo[0].title,path:"/articleList?id="+catalogInfo[0].id})
                            }
                        }
                    });
                }
                 
                if(this.$route.query["catalogId"] && this.$route.query["catalogId"]!="null"){
                    this.catalogId=Number(this.$route.query["catalogId"]);
                }
            },
            checkAndCreateTag(){
               
                return new Promise((resolve)=>{
                    let tagNew=[]
                    for(var i=0;i<this.tagSelected.length;i++){
                     let item=this.tagSelected[i];
                        if(item.key==item.label){
                            tagNew.push(item.key);
                            this.tagSelected.splice(i,1)
                            i--;
                        }
                    }

                    if(tagNew.length>0){
                         this.httpRequest("/admin/tag:edit",{tagList:tagNew}).then(  (e)=>{
                             tagNew.forEach( (labelName,idx)=>{
                                 this.tagSelected.push({key:e.list[idx].toString(),label:labelName})
                             })
                             resolve(e.list);
                         });
                    }else{
                        resolve([]);
                    }

                })
                
            },
            async doSave(){
                console.log(this.tagSelected);
                await this.checkAndCreateTag();
                let summary=this.content.substr(0,512);
                let params={
                    title:this.title,
                    catalogId:this.catalogId,
                    content:this.content,
                    summary:summary,
                    status:this.status?1:0,
                    modifyTime:new Date()
                }
                if(this.articleId){
                    params.id=this.articleId;
                }else{
                    params.createTime=new Date();
                }
                if(this.thumbnail){
                    params.thumbnail=this.thumbnail;
                }
                
                this.httpRequest("/admin/article:edit",params).then( async (e)=>{
 
                    if(!this.articleId){
                        this.articleId=e.insertId;
                    }
                    this.$message.info("发布成功");

                   
                    var params={catalog:[this.catalogId]};
                    if(this.catalogId!=this.catalogIdOrigin){
                         params.catalog.push(this.catalogIdOrigin);
                     }

                   
                     if(this.tagSelected.length>0){
                        this.updateTag(this.articleId,this.tagSelected);

                        debugger;
                        var arr=[]
                        this.tagSelected.forEach(function (item){
                            arr.push(Number(item.key))
                        })
                        params.tag=arr;
                        
                     } 
                    this.$parent.$emit("articleCountChange",params)
                      
                    
                    
                })
            },
            updateTag(articleId,tagList){
                return new Promise((resolve)=>{
                    var arr=[];
                    tagList.forEach(function (item){
                        arr.push(item.key);
                    })
                  
                    var params={
                        articleId:articleId,
                        tagList: arr
                    }
                    this.httpRequest("/admin/articleTag:edit",params).then(  (e)=>{
                        resolve();
                    });

                });
            },
            uploadComplete(e){
                var obj=JSON.parse(e.response)
                 e.returnValue="/getFiles?name="+obj.fileName;
            },
            thumbnailChange(info){
                debugger;
 
                if (info.file.status === 'uploading') {
                    this.loading = true
                    return
                }
                if (info.file.status === 'done') {
                    var url=info.file.response.fileName
                    this.thumbnail = "/getFiles?name="+url
                    this.loading = false
                    
                }
                 
            }
        }
    };
</script>
