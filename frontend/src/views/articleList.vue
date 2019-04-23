<template>
<div>
    
        <p style="line-height:50px;"><Button type="primary" icon="ios-add" @click="addNew">添加文章</Button></p>

    <p>
     <Table :columns="columns1" :data="listData">
        <template slot-scope="{ row, index }" slot="action">
             <Button @click="handleEdit(row, index)">编辑</Button>
             <Button @click="handleDelete(row, index)">删除</Button>
        </template>
     </Table>

      <Page :current.sync="pageIndex" :pageSize="pageSize" :total="totalCount"  @on-change="pageChange"/>
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
                        title: '编号',
                        key: 'code'
                    },
                     {
                        title: '操作',
                        slot: 'action'
                    }
                    
                ],
                catalogId:null,
                pageIndex:1,
                pageSize:5,
                listData:[]
            } 
 
        },
        created:function (){
           this.$router.afterEach(  (to,from)=>{
               if(to.name=="articleList"){
                   this.loadList();
               }
           })

        },  
        mounted:function (){
            this.loadList();
        },
        methods:{
            pageChange(e){
                this.loadList();
            },
            loadList(){
 
                 let params={
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize
                 };
                 if(this.$route.query["id"]){
                     this.catalogId=this.$route.query["id"];
                     params["catalogId"]=this.catalogId;
                 }
                this.httpRequest("/admin/articleList",params).then(  (result)=>{
                     this.listData=result.rows;
                     this.totalCount=result.totalCount;
                })
            },
            addNew(){
                this.$router.push("/articleEdit?catalogId="+this.catalogId)
            },
            handleEdit(e){

                this.$router.push("/articleEdit?id="+e.id)
               
               
            },
            handleDelete(row, index){
                this.$Modal.confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/articleDelete",{id:row.id}).then(  (e)=>{
                        let catalogId=row.catalogId;
                        this.$Message.info({content:"删除成功"})
                        this.loadList();

                        var params={catalog:[catalogId]};
                        this.$parent.$emit("articleCountChange",params);

                    });
                }})
                

            },

        }
    };
</script>
