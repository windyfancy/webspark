<template>
<div>
    <p style="line-height:50px;"><Button type="primary" icon="ios-add" @click="catalogEdit={};editVisible=true">添加栏目</Button></p>
    <Modal title="栏目编辑" v-model="editVisible" @on-ok="doSave">
        <Form :label-width="80">
         <FormItem label="栏目名称："> <Input v-model="catalogEdit.title"/></FormItem>
         <FormItem label="上级栏目 ：">  
     <Select v-model="catalogEdit.parentId" style="width:200px" :clearable="true">
        <Option v-for="item in catalogList" :value="item.id" :key="item.id">{{ item.title }}</Option>
    </Select>
    </FormItem>
   
        <FormItem label="栏目编号：">   <Input v-model="catalogEdit.code"/> </FormItem>
           </Form>
    </Modal>
    <p>
     <Table :columns="columns1" :data="catalogList">
        <template slot-scope="{ row, index }" slot="action">
             <Button @click="handleEdit(row, index)">编辑</Button>
             <Button @click="handleDelete(row, index)">删除</Button>
        </template>
     </Table>
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
                        key: 'id'
                    },
                    {
                        title: '名称',
                        key: 'title'
                    },
                    {
                        title: '编号',
                        key: 'code'
                    },
                     {
                        title: '操作',
                        slot: 'action'
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
                this.httpRequest("/admin/catalogList",params).then(  (result)=>{
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
                this.$Modal.confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/catalogDelete",{id:row.id}).then(  (e)=>{
 
                        this.$Message.info({content:"删除成功"})
                        this.loadList();
                    });
                }})
                

            },
            doSave(){
                 let params=this.catalogEdit;

                if(params.id==null){
                    delete params.id;
                }
                this.httpRequest("/admin/catalogEdit",params).then(  (e)=>{
 
                    if(e.affectedRows>0){
                         this.$Message.info({content:"编辑成功"})
                         this.loadList();
                         this.$parent.$emit("catalogChange");
                    }else{
                        
                    }
                })
            }
        }
    };
</script>
