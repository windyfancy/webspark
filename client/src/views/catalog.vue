<template>
<div>
    <p style="line-height:50px;">
        <a-button type="primary" icon="ios-add" @click="catalogEdit={};editVisible=true">添加栏目</a-button></p>
    <a-modal title="栏目编辑" v-model="editVisible" @ok="doSave">
        <a-form :label-width="80">
         <a-form-item label="栏目名称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"> <a-input v-model="catalogEdit.title"/></a-form-item>
         <a-form-item label="上级栏目 ：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">  
     <a-select v-model="catalogEdit.parentId" style="width:200px" :clearable="true">
        <a-select-option v-for="item in catalogList" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
    </a-select>
    </a-form-item>
   
        <a-form-item label="栏目编号：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">   <a-input v-model="catalogEdit.code"/> </a-form-item>
           </a-form>
    </a-modal>
    <p>
     <a-table :columns="columns1" :dataSource="catalogList" :pagination="false">
        <template slot-scope="text, row, index" slot="action">
             <a-button @click="handleEdit(row, index)">编辑</a-button>
             <a-button @click="handleDelete(row, index)">删除</a-button>
        </template>
     </a-table>
    </p>

</div>

</template>
<script>

    export default {
       
        data () {
            return {
                columns1:[
                    {
                        title: 'id',
                        dataIndex:"id",
                        key: 'id'
                    },
                    {
                        title: '名称',
                        dataIndex:"title",
                        key: 'title'
                    },
                    {
                        title: '编号',
                        dataIndex:"code",
                        key: 'code'
                    },
                     {
                        title: '操作',
                         scopedSlots: { customRender: 'action' },
                        //slot: 'action'
                    }
                    
                ],
                catalogList:[],
                editVisible:false,
                catalogEdit:{
                    id:null,
                    title:"",
                    parentId:null,
                    code:""
                }
            } 
 
        },
        created:function (){
            var self=this;
            this.loadList();

        },  
        mounted:function (){
 
        },
        methods:{
            loadList(){
                let params={};
                this.httpRequest("/admin/catalog:list",params).then(  (result)=>{
                    this.catalogList=result;
                });
            },
            handleEdit(row, index){
                this.catalogEdit={
                    id:row.id,
                    title:row.title,
                    parentId:row.parentId,
                    code:row.code
                }; 
                this.editVisible=true;

            },
            handleDelete(row, index){
                this.$confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/catalog:delete",{id:row.id}).then(  (e)=>{
 
                        this.$message.info("删除成功")
                        this.loadList();
                    });
                }})
                

            },
            doSave(resolve){
                 let params=this.catalogEdit;

                if(params.id==null){
                    delete params.id;
                }
                
                this.httpRequest("/admin/catalog:edit",params).then(  (e)=>{

                    if(e.affectedRows>0){
                        this.$message.info("编辑成功")
                        this.loadList();
                        this.editVisible=false;
                        this.$parent.$emit("catalogChange");
                    }else{
                        
                    }
                })
                
            }
        }
    };
</script>
