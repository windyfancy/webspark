<template>
<div>
     <Tabs @on-click="tabChange">
        <TabPane label="首页导航" name="home"></TabPane>
        <TabPane label="侧边栏" name="sidebar"></TabPane>
        <TabPane label="友情链接" name="friend"></TabPane>
    </Tabs>
    <p style="line-height:50px;"><Button type="primary" icon="ios-add" @click="linkEdit={};editVisible=true">添加链接</Button></p>
    <Modal title="链接" v-model="editVisible" @on-ok="doSave">
        <Form :label-width="80">
         <FormItem label="标题"> <Input v-model="linkEdit.title"/></FormItem>
         <FormItem label="地址：">   
 
          <AutoComplete
        v-model="linkEdit.linkUrl"
        icon="ios-search"
        placeholder="input here"
        @on-select="listSelect"
        style="width:300px">
        <div class="demo-auto-complete-item">
            <div class="demo-auto-complete-group">
                <span>请选择分类</span>
                 
            </div>
            <Option v-for="item in catalogList" :value="'/catalog?id='+item.id" :key="item.id">
                <b class="demo-auto-complete-title">{{ item.title }}</b>
                <span class="demo-auto-complete-count">({{ '/catalog?id='+item.id }} ) </span>
            </Option>
        </div>
        
    </AutoComplete>

         
          </FormItem>
         </Form>
    </Modal>
    <p>
     <Table :columns="columns1" :data="linkList">
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
                        title: '标题',
                        key: 'title'
                    },
                    {
                        title: '地址',
                        key: 'linkUrl'
                    },
                     {
                        title: '分类',
                        key: 'type'
                    },
                     {
                        title: '操作',
                        slot: 'action'
                    }
                    
                ],
                type:"home",
                linkList:[],
                editVisible:false,
                linkEdit:{
                    id:null,
                    title:"",
                    linkUrl:null
                },
                catalogList:[]
            } 
 
        },
        created:function (){
            var self=this;
                  this.httpRequest("/admin/catalogList",{}).then(  (result)=>{
                    this.catalogList=result;
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
                debugger;
            },
            loadList(){
                let params={type:this.type};
                this.httpRequest("/admin/linkList",params).then(  (result)=>{
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
                this.$Modal.confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/linkDelete",{id:row.id}).then(  (e)=>{
 
                        this.$Message.info({content:"删除成功"})
                        this.loadList();
                    });
                }})
                

            },
            doSave(){
                let params=this.linkEdit;
                params.type=this.type;
                if(params.id==null){
                    delete params.id;
                }
                this.httpRequest("/admin/linkEdit",params).then(  (e)=>{
 
                    if(e.affectedRows>0){
                         this.$Message.info({content:"编辑成功"})
                         this.loadList();
                    }else{
                        
                    }
                })
            }
        }
    };
</script>
