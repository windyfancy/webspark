<template>
<div>
    
        <p style="line-height:50px;">
            <a-button type="primary" icon="plus" @click="addNew">添加文章</a-button>
            <a-button icon="scissor" @click="moveItems">移动</a-button>
            <a-button icon="tags" @click="tagItems">打标签</a-button>
            <a-button icon="delete" @click="deleteItems()">删除</a-button>
        </p>

    <p>
     <a-table :columns="columns1" :dataSource="listData" :pagination="false" rowKey="id" :rowSelection="{selectedRowKeys: selectedIds, onChange: onSelectChange}">
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
                pageSize:20,
                totalCount:0,
                listData:[],
                selectedIds:[],
                selectedList:[]
            } 
 
        },
        created:function (){
          

        },  
        beforeRouteUpdate(to,from,next){
            next();
            this.pageIndex=1
            this.loadList();
        },
        mounted:function (){
            this.loadList();
        },
        methods:{
            pageChange(idx){
                this.pageIndex=idx;
                this.loadList();
            },
            onSelectChange(ids,list){
                this.selectedIds=ids;
                this.selectedList=list;
            },
            loadList(){
 
                 let params={
                    pageIndex:this.pageIndex,
                    pageSize:this.pageSize
                 };
                 if(this.$route.query["id"]){
                     this.catalogId=Number(this.$route.query["id"].toString());
                    
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
                this.deleteItems(row);
            },
            deleteItems(row){
                debugger;
                var rows=[];
                if(row){
                    rows=[row]
                }else{
                    rows=this.selectedIds;
                }
                this.$confirm({title:"确认删除",content:"确实要删除此记录吗，删除不可恢复？",onOk:()=>{
                    debugger;
                    var params={id:rows};
        
                    this.httpRequest("/admin/articleDelete",params).then(  (e)=>{
                        this.$message.info("删除成功")
                        this.loadList();
                        this.updateCount();

                    });
                }})
            },
            moveItems(){
                var rows=this.selectedList;
                 params={id:[]};
                 rows.forEach((item)=>{
                        params.id.push(item.id);
                    })
            },
            tagItems(){

            },
            updateCount(rows){
                // var catalogSet=new Set(),tagSet=new Set();
                // rows.forEach((item)=>{
                //     catalogSet.add(item.catalogId);
                // })


                // if(catalogId){
                //     var params={catalog:[catalogId]};
                //     this.$parent.$emit("articleCountChange",params);
                // }
            }

        }
    };
</script>
