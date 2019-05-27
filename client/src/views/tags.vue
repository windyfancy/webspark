<template>
<div>
    <p style="line-height:50px;"><a-button type="primary" icon="ios-add" @click="tagEdit={};editVisible=true">添加标签</a-button></p>
    <a-modal title="栏目编辑" v-model="editVisible" @ok="doSave">
        <a-form :label-width="80">
         <a-form-item label="标签名称："> <a-input v-model="tagEdit.title"/></a-form-item>

        <a-form-item label="标签编号：">   <a-input v-model="tagEdit.code"/> </a-form-item>
           </a-form>
    </a-modal>
    <p>
     <a-table :columns="columns1" :dataSource="tagList" :pagination="false">
        <template slot-scope="text,row, index" slot="action">
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
                        dataIndex:'id',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        dataIndex:'title',
                        key: 'title'
                    },
                    {
                        title: '编号',
                        dataIndex:'code',
                        key: 'code'
                    },
                    {
                        title: '文章数量',
                        dataIndex:'count',
                        key: 'count'
                    },
                     {
                        title: '操作',
                        scopedSlots: { customRender: 'action' }
     
                    }
                    
                ],
                tagList:[],
                editVisible:false,
                tagEdit:{
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
                this.httpRequest("/admin/tag.list",params).then(  (result)=>{
                    this.tagList=result;
                  });
            },
            handleEdit(row, index){
                this.tagEdit={
                    id:row.id,
                    title:row.title,
                    parentId:row.parentId,
                    code:row.code
                }; 
                this.editVisible=true;

            },
            handleDelete(row, index){
                this.$confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/tag.delete",{id:row.id}).then(  (e)=>{
 
                        this.$message.info("删除成功")
                        this.loadList();
                    });
                }})
                

            },
            doSave(resolve){
                 let params=this.tagEdit;

                if(params.id==null){
                    delete params.id;
                }
                 
                this.httpRequest("/admin/tag.edit",params).then(  (e)=>{
                    if(e.affectedRows>0){
                        this.$message.info("编辑成功")
                        this.loadList();
                        this.editVisible=false;
                    }else{
                        
                    }
                })
                 

            }
        }
    };
</script>
