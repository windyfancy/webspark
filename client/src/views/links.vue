<template>
<div>
     <a-tabs defaultActiveKey="1" @change="tabChange">
    <a-tab-pane tab="首页导航" key="home"></a-tab-pane>
    <a-tab-pane tab="侧边栏" key="sidebar"></a-tab-pane>
    <a-tab-pane tab="友情链接" key="friend"></a-tab-pane>
  </a-tabs>
 
    <p style="line-height:50px;"><a-button type="primary" icon="ios-add" @click="linkEdit={};editVisible=true">添加链接</a-button></p>
    <a-modal title="链接" v-model="editVisible" @ok="doSave">
        <a-form :label-width="80">
         <a-form-item label="标题" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }"> <a-input v-model="linkEdit.title"/></a-form-item>
         <a-form-item label="地址：" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">   

    <a-select v-model="linkEdit.linkUrl" v-if="!inputable"   style="width:200px"  @on-query-change="queryChange" @on-open-change="openChange">
        <a-select-opt-group label="选择栏目">
        <a-select-option v-for="item in catalogList" :value="'/catalog?id='+item.id" :key="item.id">{{ item.title+' (/catalog?id='+item.id+ ')'}}</a-select-option>
        </a-select-opt-group>
        <a-select-opt-group label="选择标签">
        <a-select-option v-for="item in tagList" :value="'/tag?id='+item.id" :key="item.id">{{item.title+' (/tag?id='+item.id+')' }}</a-select-option>
        </a-select-opt-group>
    </a-select>

        <a-input type="text" v-model="linkEdit.linkUrl" v-if="inputable" style="width:200px"/>
         <a-button @click="inputable=!inputable">{{inputable?'下拉选择':'手工输入'}}</a-button>
          </a-form-item>
         </a-form>
    </a-modal>
    <p>
     <a-table :columns="columns1" :dataSource="linkList" :pagination="false">
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
                        dataIndex:'id',
                        key: 'id'
                    },
                    {
                        title: '标题',
                        dataIndex:'title',
                        key: 'title'
                    },
                    {
                        title: '地址',
                        dataIndex:'linkUrl',
                        key: 'linkUrl'
                    },
                     {
                        title: '分类',
                        dataIndex:'type',
                        key: 'type'
                    },
                     {
                        title: '操作',
                        //slot: 'action'
                        scopedSlots: { customRender: 'action' }
                    }
                    
                ],
                type:"home",
                inputable:false,
                linkList:[],
                editVisible:false,
                linkEdit:{
                    id:null,
                    title:"",
                    linkUrl:null
                },
                catalogList:[],
                tagList:[]
            } 
 
        },
        created:function (){
            var self=this;
            this.httpRequest("/admin/catalog:list",{}).then(  (result)=>{
                this.catalogList=result;
            });
            this.httpRequest("/admin/tag:list",{}).then(  (result)=>{
                this.tagList=result;
            });
            this.loadList();

        },  
        mounted:function (){
 
        },
        methods:{
            tabChange(name){
           
                this.type=name;
                this.loadList();
            },
            listSelect(e){
                //debugger;
            },
            queryChange(e){
                 //debugger;
            },
            openChange(e){
                 //debugger;
            },
            loadList(){
                let params={type:this.type};
                this.httpRequest("/admin/link:list",params).then(  (result)=>{
                    this.linkList=result;
                });
            },
            handleEdit(row, index){
                this.linkEdit={
                    id:row.id,
                    title:row.title,
                    linkUrl:row.linkUrl
                }; 
                this.editVisible=true;

                
                this.catalogList=this.getCatalogList();

            },
            handleDelete(row, index){
                this.$confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/link:delete",{id:row.id}).then(  (e)=>{
 
                        this.$message.info("删除成功")
                        this.loadList();
                    });
                }})
                

            },
            doSave(resolve){
                let params=this.linkEdit;
                params.type=this.type;
                if(params.id==null){
                    delete params.id;
                }
                
                this.httpRequest("/admin/link:edit",params).then(  (e)=>{

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
