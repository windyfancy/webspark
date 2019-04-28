<template>
<div>
    
        <p style="line-height:50px;"><a-button type="primary" icon="ios-add" @click="addNew">添加文章</a-button></p>

    <p>
     <a-table :columns="columns1" :dataSource="listData" :pagination="false">
        <template slot-scope="text, row, index " slot="action">
             <a-button @click="handleEdit(row, index)">编辑</a-button>
             <a-button @click="handleDelete(row, index)">删除</a-button>
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
                        dataIndex: 'id',
                        key: 'id'
                    },
                    {
                        title: '标题',
                        dataIndex: 'title',
                        key: 'title'
                    },
                    {
                        title: '编号',
                        dataIndex: 'code',
                        key: 'code'
                        
                    },
                     {
                        title: '操作',
                        scopedSlots: { customRender: 'action' }
                         
                    }
                    
                ],
                catalogId:null,
                pageIndex:1,
                pageSize:5,
                totalCount:0,
                listData:[]
            } 
 
        },
        created:function (){
          

        },  
        beforeRouteUpdate(to,from,next){
            this.pageIndex=1
            this.loadList();
            next();
        },
        mounted:function (){
            this.loadList();
        },
        methods:{
            pageChange(idx){
                this.pageIndex=idx;
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
                this.$confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                     this.httpRequest("/admin/articleDelete",{id:row.id}).then(  (e)=>{
                        let catalogId=row.catalogId;
                        this.$message.info("删除成功")
                        this.loadList();

                        var params={catalog:[catalogId]};
                        this.$parent.$emit("articleCountChange",params);

                    });
                }})
                

            },

        }
    };
</script>
