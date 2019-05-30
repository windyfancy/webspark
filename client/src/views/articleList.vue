<template>
<div>
    
        <p style="line-height:50px;">
            <a-button type="primary" icon="plus" @click="addNew">添加文章</a-button>
            <a-button icon="scissor" @click="showMove">移动</a-button>
            <a-button icon="tags" @click="showTag">打标签</a-button>
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
    
<a-modal title="移动到栏目" v-model="moveVisible" @ok="moveItems">
  选择栏目
     <a-select v-model="moveTarget" style="width:200px" showSearch>
        <a-select-option v-for="item in catalogList" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
    </a-select>
</a-modal>

<a-modal title="设置标签" v-model="tagVisible" @ok="tagItems">
  选择标签
     <a-select v-model="tagTarget" style="width:200px" showSearch>
        <a-select-option v-for="item in tagList" :value="item.id" :key="item.id">{{ item.title }}</a-select-option>
    </a-select>
    <a-checkbox v-model="tagRemoveOrigin">移除原有标签</a-checkbox>
</a-modal>
 
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
                selectedList:[],
                moveVisible:false,
                tagVisible:false,
                moveTarget:[],
                tagTarget:[],
                tagRemoveOrigin:true
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
                this.httpRequest("/admin/article.list",params).then(  (result)=>{
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
        
                    this.httpRequest("/admin/article.delete",params).then(  (e)=>{
                        this.$message.info("删除成功")
                        this.loadList();
                        this.updateCount();

                    });
                }})
            },
            showMove(){
                 this.httpRequest("/admin/catalog.list",{}).then(  (result)=>{
                    this.catalogList=result;
                    this.moveVisible=true;
                });
 
            },
            moveItems(){
                var params={articleList:this.selectedIds,catalogId:this.moveTarget};
                console.log(params);

                this.httpRequest("/admin/article.move",params).then(  (result)=>{
                    this.moveVisible=false;
                    this.$message.info("移动成功")
                    this.loadList();
                    this.updateCount();
                });
            },
            showTag(){
                this.httpRequest("/admin/tag.list",{}).then(  (result)=>{
                   this.tagList=result;
                   this.tagVisible=true;
                });
                
            },
            tagItems(){
                var params={
                    articleList:this.selectedIds,
                    tagId:this.tagTarget,
                    removeOrigin:this.tagRemoveOrigin
                };
                console.log(params);
                this.httpRequest("/admin/articleTag.mark",params).then(  (result)=>{
                    this.tagVisible=false;
                    this.$message.info("标签标记成功")
                    this.loadList();
                    this.updateCount();
                });
            },
            updateCount(){
                debugger;
                var catalogSet=new Set(),tagSet=new Set();
                var rows=this.selectedList;
                rows.forEach((item)=>{
                    if(item.catalogId){
                        catalogSet.add(item.catalogId);
                    }
                    if(item.tagList){
                        let arr=item.tagList.split(",");
                        arr.forEach((tagId)=>{
                            tagSet.add(Number(tagId));
                        })
                        
                    }
                })


                var params={catalog:Array.from(catalogSet),tag:Array.from(tagSet)};
                this.$parent.$emit("articleCountChange",params);
                
            }

        }
    };
</script>
