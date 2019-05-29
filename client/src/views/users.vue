<template>
<div>
    <p style="line-height:50px;"><a-button type="primary" icon="ios-add" @click="addNew">添加用户</a-button></p>
    <a-modal title="用户编辑" v-model="editVisible" @ok="doSave">
        <a-form :label-width="80">
            <a-form-item label="用户名：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"> <a-input v-model="userEdit.userName" /></a-form-item>
            <a-form-item label="昵称：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"> <a-input v-model="userEdit.nickName"  /></a-form-item>
            <a-form-item label="密码：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"> <a-input type="password" v-model="userEdit.password"  />(为空时不修改原密码)</a-form-item>
            <a-form-item label="类型:" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">  
                <a-select v-model="userEdit.type" >
                    <a-select-option value="1">超级管理员</a-select-option>
                    <a-select-option value="2">网站编辑</a-select-option>
                    <a-select-option value="10">普通用户</a-select-option>
                </a-select> 
            </a-form-item>
        </a-form>
    </a-modal>
    <p>
     <a-table :columns="columns1" :dataSource="userList" :pagination="false">
        <template slot-scope="text,row, index" slot="action">
             <a-button @click="handleEdit(row, index)">编辑</a-button>
             <a-button @click="handleDisable(row, index)">{{row.status==1?'停用':'启用'}}</a-button>
        </template>
     </a-table>
    </p>
<p>
      <a-pagination :hideOnSinglePage=true  v-model="pageIndex" :pageSize="pageSize" :total="totalCount"  @change="pageChange"/>
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
                        title: '用户名',
                        dataIndex:'userName',
                        key: 'userName'
                    },
                     {
                        title: '状态',
                        dataIndex:'status',
                        key: 'status',
                        customRender:function (text, item){
                            var obj={1:"启用",0:"停用"}
                            return obj[item.status];
                        },
                    },
                    {
                        title: '昵称',
                        dataIndex:'nickName',
                        key: 'nickName'
                    },
                    {
                        title: '类型',
                        dataIndex:'type',
                        key: 'type',
                        customRender:function (text, item){
                            var obj={1:"超级管理员",2:"网站编辑",10:"普通用户"}
                            return obj[item.type];
                        },
                    },
                     {
                        title: '注册时间',
                        dataIndex:'createTime',
                        key: 'createTime'
                    },
                     {
                        title: '操作',
                        scopedSlots: { customRender: 'action' }
     
                    }
                    
                ],
                userList:[],
                editVisible:false,
                userEdit:{
                    id:null,
                    userName:"",
                    nickName:null,
                    password:null,
                    type:null
                },
                pageIndex:1,
                pageSize:2,
                totalCount:0
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
                debugger;
                let params={
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize
                };
                this.httpRequest("/admin/user.list",params).then(  (result)=>{
                    debugger;
                    this.totalCount=result.totalCount;
                    this.userList=result.rows;
                  });
            },
            addNew(){
                this.userEdit={type:"10"};
                this.editVisible=true
            },
            handleEdit(row, index){
                this.userEdit={
                    id:row.id,
                    userName:row.userName,
                    nickName:row.nickName,
                    type:row.type
                }; 
                this.editVisible=true;

            },
            handleDisable(row, index){
                if(row.status==1){
                    this.$confirm({title:"停用",content:"确实要停用此用户吗？",onOk:()=>{
                        this.httpRequest("/admin/user.disable",{id:row.id,status:0}).then(  (e)=>{
    
                            this.$message.info("停用成功")
                            this.loadList();
                        });
                    }})
                }else{
                     this.httpRequest("/admin/user.disable",{id:row.id,status:1}).then(  (e)=>{
                            this.$message.info("启用成功")
                            this.loadList();
                      });
                }
                

            },
            pageChange(idx){
                this.pageIndex=idx;
                this.loadList();
            },
            doSave(resolve){
                if(!this.userEdit.userName){
                    this.$message.info("请填写用户名")
                    return ;
                }
                let params=this.userEdit;
                let url="/admin/user.edit";
                if(params.id==undefined){
                    url="/admin/user.add";

                    if(!this.userEdit.password){
                        this.$message.info("请填写密码")
                        return ;
                    }
                }


                 
                this.httpRequest(url,params).then(  (e)=>{

                    if(e.code=="Error_UserExists"){
                        this.$message.error("用户已存在！")
                        return ;
                    }
                    if(e.affectedRows>0){
                        this.$message.info("用户添加/修改成功")
                        this.loadList();
                        this.editVisible=false;
                    }else{
                        
                    }
                })
                 

            }
        }
    };
</script>
