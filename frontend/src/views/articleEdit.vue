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
    <Breadcrumb separator=">">
 <BreadcrumbItem v-for="(item) in crumbList" :to="item.url">{{item.title}}</BreadcrumbItem>
 </Breadcrumb>
</p>
<p class="line" >标题：<Input type="text" v-model="title" style="width:320px"/></p>
<p class="line">栏目：
    
<Select v-model="catalogId" style="width:200px">
        <Option v-for="item in catalogList" :value="item.id" :key="item.id">{{ item.title }}</Option>
</Select>

</p>

<div class="editor">
     <i-editor v-model="content" :config="uploadConfig" :img-url="uploadComplete"></i-editor>
    
</div>
<p><Button @click="doSave">发布</Button></p>

</div>
</template>
<script>

    export default {
       
        data () {
            return {
                crumbList: [
                {
                    title: "文章管理",
                    url: "/articleList"
                }
                ],
                id:null,
                title:"",
                catalogIdOrigin:null,
                catalogId:null,
                catalogTitle:"",
                content:null,
                catalogList:[],
                uploadConfig:{action: "/admin/uploadFiles",maxSize: 5120,uploadForm: {}}
            } 
 
        },
        created:function (){
            


            this.httpRequest("/admin/catalogList",{}).then(  (result)=>{
                this.catalogList=result;
                this.loadContent();
            });

        },  
        mounted:function (){
 
        },
        methods:{
            loadContent(){
                if(this.$route.query["id"]){
                    this.id=this.$route.query["id"];
                    this.httpRequest("/admin/articleList",{id:this.id}).then(  (e)=>{
                        if(e.rows.length>0){
                            let row=e.rows[0];
                            this.title=row.title;
                            this.catalogId=row.catalogId;
                            this.catalogIdOrigin=row.catalogId;
                            this.content=row.content;
                           
                            var catalogInfo=this.catalogList.filter((item)=>{
                                return item.id==this.catalogId;
                            })
                            if(catalogInfo.length>0){
                                this.crumbList.push({title:catalogInfo[0].title,url:"/articleList?id="+catalogInfo[0].id})
                            }
                        }
                    });
                }
                if(this.$route.query["catalogId"]){
                    this.catalogId=Number(this.$route.query["catalogId"]);
                }
            },
            doSave(){
                let params={
                    title:this.title,
                    catalogId:this.catalogId,
                    content:this.content
                }
                if(this.id){
                    params.id=this.id;
                }
                this.httpRequest("/admin/articleEdit",params).then(  (e)=>{
                    this.$Message.info({content:"发布成功"});

                   
                    var params={catalog:[this.catalogId]};
                    if(this.catalogId!=this.catalogIdOrigin){
                         params.catalog.push(this.catalogIdOrigin);
                     }
                    this.$parent.$emit("articleCountChange",params)
                    
                })
            },
            uploadComplete(res){
                return "/getFiles?name="+res.fileName;
            }
        }
    };
</script>
