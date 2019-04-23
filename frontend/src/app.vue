<style>
.leftMenu{
    overflow:hidden;
    float:left;
    width:180px;
    height:100%;
    margin:15px;
    line-height:25px;
    font-size:15px;
    
}
.main{
    margin:15px;
    overflow:hidden;
    float:left;

    width: calc(100% - 320px)
}
.header{
    padding-left:10px;
    line-height: 50px;
    height:50px;
    font-size: 24px;
    color:white;
    background: linear-gradient(to right,#01aab4,#007cdb);
}
.header span{
    padding-left:10px;
    font-size:12px;
    color:whitesmoke;
    vertical-align: middle;
}
</style>
<template>
<div>
<div class="header">WebSpark<span> webcontext,the most simplest node.js web framework</span></div>
<ul class="leftMenu" v-if="showNav">
<li><a href="javascript:" @click="navigate('articleList')">文章管理</a>
<div style="padding-left:12px;">
 <Tree :data="catalogTree" @on-select-change="catalogSelect"></Tree>
</div>
</li>
<li><a href="javascript:" @click="navigate('catalog')">栏目管理</a></li>
<li><a href="javascript:" @click="navigate('link')">链接管理</a></li>
<li><a href="javascript:" @click="navigate('password')">修改密码</a></li>
</ul>
<div class="main">
<transition name="slide">
 <router-view id="wrap" class="wrap" ></router-view>
 </transition>
</div>

</div>
</template>
<script>
 

    export default {
       
        data () {
            return {
                catalogTree:[]
            }
            
        },
        created:function (){
             
            this.loadCatalog();
            //栏目修改
            this.$on("catalogChange",()=>{
                this.loadCatalog();
            })
            //文章数量变化
            this.$on("articleCountChange",(params)=>{
                //params:{catalog:[1,2],tag:[4,5]}
                this.updateCount(params);
            })
        },
        computed:{
            showNav:function (){
                
                if(this.$route.name!="login"){
                    return true;
                }
            }
            
        },
        watch:{
        },
        methods:{
            navigate:function (name){
                this.$router.push(name);
            },
            goBack:function (){
                this.$router.back(-1);
                //this.$router.go(-1);
            },
            getMainHeight:function (){
                
                return window.innerHeight-96+"px"
              
            },
            catalogSelect(e){
                let id=e[0].id;
                this.$router.replace({path:"/articleList",query:{id:id}})
            },
            loadCatalog(){
                this.httpRequest("/admin/catalogList",{}).then(  (result)=>{
                    this.catalogList=result;
                    this.buildTree(result)
                });

                this.httpRequest("/admin/tagList",{}).then(  (result)=>{
                    this.tagList=result;
                });
            },
            updateCount(obj){
               this.httpRequest("/admin/catalogStats",obj).then(  (result)=>{
                    debugger;
                });
            },
            buildTree(data){
                function findChild(parentId){
                    var result=[];
                    data.forEach((item)=>{
                        var obj={id:item.id,title:item.title};
                        if(item.parentId==parentId){
                            result.push(obj)
                        }
                        
                    })
                    result.forEach((item)=>{
                        let child=findChild(item.id);
                        if(child && child.length>0){
                            item.children=child;
                        }
                    })
                    
                    return result;

                }
                var tree=findChild(null);
                this.catalogTree=tree;
            }
         
           
        }
    };
</script>
