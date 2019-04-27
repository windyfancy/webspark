<style>
html,body{height:100%;margin:0px;padding:0px;}
ul,li{list-style: none;}
.wrap{
    height:100%;
    background: white;
    overflow: hidden;
}
.leftMenu{
    overflow:hidden;
    float:left;
    width:210px;
    height:100%;
    padding:10px 15px;
    line-height:25px;
    background: whitesmoke;
}
.main{
    margin:15px;
    overflow:hidden;
    float:left;

    width: calc(100% - 240px)
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
.leftMenu li{
    line-height: 35px;
}
.leftMenu a{
    vertical-align: middle;
    margin:5px;color:black;
    font-size:14px;
}
.leftMenu i{
    vertical-align: middle;
    color:gray;
    font-size:18px;
}
</style>
<template>
<div class="wrap">
<div class="header">WebSpark<span> webcontext,the most simplest node.js web framework</span></div>
<ul class="leftMenu" v-if="showNav">
<li><a-icon type="edit" /><a href="javascript:" @click="navigate('articleList')">文章管理</a>
<div style="padding-left:12px;">
 <a-tree :treeData="catalogTree" @select="catalogSelect"></a-tree>
</div>
</li>
<li><a-icon type="setting" /><a href="javascript:" @click="navigate('siteConfig')">站点配置</a></li>
<li><a-icon type="folder" /><a href="javascript:" @click="navigate('catalog')">栏目管理</a></li>
<li><a-icon type="tag" /><a href="javascript:" @click="navigate('tags')">标签管理</a></li>
<li><a-icon type="share-alt" /><a href="javascript:" @click="navigate('links')">链接管理</a></li>
<li><a-icon type="user" /><a href="javascript:" @click="navigate('users')">用户管理</a></li>
<li><a-icon type="lock" /><a href="javascript:" @click="navigate('password')">修改密码</a></li>
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
            catalogSelect(key,info){
                this.$router.replace({path:"/articleList",query:{id:key}})
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
                        var obj={id:item.id,key:item.id,title:item.title};
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
