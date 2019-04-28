<style>
.editor textarea{
    height:500px;
}
.line{
    line-height:50px;
}
</style>
<template>
<div>
<p>
    <a-breadcrumb :routes="crumbList" separator=">" >
  
 </a-breadcrumb>
</p>
<p class="line" >标题：<a-input type="text" v-model="title" style="width:320px"/></p>
<p class="line">
    栏目：    
<a-select v-model="catalogId" style="width:200px">
        <a-select-option v-for="item in catalogList" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
</a-select>



</p>
<p>
标签：    
<a-select style="width:300px"  mode="tags" v-model="tagSelected"> 
        <a-select-option v-for="item in tagList" :value="item.id.toString()" :key="item.id.toString()">
            {{ item.title }}
        </a-select-option>
</a-select>
 
</p>

<div class="editor">
  <!--   <i-editor v-model="content" :config="uploadConfig" :img-url="uploadComplete"></i-editor> -->
  <MarkEditor v-model="content" :uploadUrl="uploadUrl" @uploadComplete="uploadComplete"></MarkEditor>
    
</div>

<p><a-button type="primary" @click="doSave">发布</a-button></p>

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
                id:null,
                title:"",
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
            this.httpRequest("/admin/catalogList",{}).then(  (result)=>{
                this.catalogList=result;
                this.loadContent();
            });

            this.httpRequest("/admin/tagList",{}).then(  (result)=>{
                    this.tagList=result;
            });

        },  
        mounted:function (){
 
        },
        methods:{
            loadContent(){
                if(this.$route.query["id"]){
                    this.id=this.$route.query["id"];
                    this.httpRequest("/admin/articleList",{id:this.id}).then(  (rows)=>{
                        if(rows.length>0){
                            let row=rows[0];
                            this.title=row.title;
                            this.catalogId=row.catalogId;
                            this.catalogIdOrigin=row.catalogId;
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
                if(this.$route.query["catalogId"]){
                    this.catalogId=Number(this.$route.query["catalogId"]);
                }
            },
            doSave(){
                console.log(this.tagSelected);
                debugger;
                let summary=this.content.substr(0,512);
                let params={
                    title:this.title,
                    catalogId:this.catalogId,
                    content:this.content,
                    summary:summary,
                    modifyTime:new Date()
                }
                if(this.id){
                    params.id=this.id;
                }else{
                    params.createTime=new Date();
                }
                
                this.httpRequest("/admin/articleEdit",params).then(  (e)=>{
                    this.$message.info("发布成功");

                   
                    var params={catalog:[this.catalogId]};
                    if(this.catalogId!=this.catalogIdOrigin){
                         params.catalog.push(this.catalogIdOrigin);
                     }
                    this.$parent.$emit("articleCountChange",params)
                    
                })
            },
            uploadComplete(e){
                var obj=JSON.parse(e.response)
                 e.returnValue="/getFiles?name="+obj.fileName;
            }
        }
    };
</script>
