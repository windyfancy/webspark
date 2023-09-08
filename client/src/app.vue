<style>
html,body{height:100%;margin:0px;padding:0px;}
ul,li{list-style: none;}
.wrap{
    height:100%;
    overflow: auto;
}
.leftMenu{
    overflow:hidden;
    float:left;
    width:210px;
    height:100%;
    padding:10px 15px;
    line-height:25px;
    /*background: whitesmoke;*/
    border-right: 1px solid #dcf0f9;

}
.main{
    padding:15px;
    overflow:hidden;
    float:left;
    background: #ffffffe5;
    width: calc(100% - 210px);
    height:100%;
}
.header{
    padding-left:10px;
    line-height: 50px;
    height:50px;
    font-size: 24px;
    color:black;
    /*background-image: linear-gradient(180deg,hsla(0,0%,100%,0) 60%,#fff),linear-gradient(70deg,#dbedff 32%,#ebfff0);*/
    /*background: linear-gradient(to right,#01aab4,#007cdb);*/

    /*background-image: linear-gradient(to right,#1278f6,#00b4aa);*/
}
.header span{
    margin-left:10px;
    padding:2px 10px;
    font-size:14px;
    border:1px solid white; /* #2d8cf0*/
    border-radius: 2em;
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
.logout{
    position:absolute;right:30px;
    font-size: 12px;
}
</style>
<template>

<div class="wrap">
<link rel="stylesheet" type="text/css" :href="'/themes/'+theme+'/css/skin.css'"/>
<div class="header">后台管理<span>   
    <a-icon type="github" />
    <a href="https://github.com/windyfancy/webcontext" target="_blank">webcontext</a>
    </span>
<a href="javascript:" @click="logout" class="logout" v-if="isLogined">退出</a>
</div>
<ul class="leftMenu" v-if="showNav">
<li><a-icon type="edit" /><a href="javascript:" @click="navigate('articleList')">文章管理</a>
<div style="padding-left:12px;">
 <a-directory-tree :treeData="catalogTree" :selectedKeys.sync="selectedIds" @select="catalogSelect"></a-directory-tree>
</div>
</li>
<li v-if="userType<=1"><a-icon type="setting" /><a href="javascript:" @click="navigate('siteConfig')">站点配置</a></li>
<li><a-icon type="folder" /><a href="javascript:" @click="navigate('catalog')">栏目管理</a></li>
<li><a-icon type="tag" /><a href="javascript:" @click="navigate('tags')">标签管理</a></li>
<li v-if="userType<=1"><a-icon type="share-alt" /><a href="javascript:" @click="navigate('links')">链接管理</a></li>
<li v-if="userType<=1"><a-icon type="user" /><a href="javascript:" @click="navigate('users')">用户管理</a></li>
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
                theme:"default",
                isLogined:false,
                userType:2,
                catalogTree:[],
                selectedIds:[]
            }
            
        },
        created:function (){
             
            if(sessionStorage["userName"]){
                this.isLogined=true;
            }
            if(sessionStorage["theme"]){
                this.theme=sessionStorage["theme"];
            }
            if(sessionStorage["userType"]){
                this.userType=sessionStorage["userType"];
            }
            //栏目修改
            this.$on("catalogChange",()=>{
                this.loadCatalog();
            })
            //文章数量变化
            this.$on("articleCountChange",(params)=>{
                //params:{catalog:[1,2],tag:[4,5]}
                this.updateCount(params);
            })

            this.$on("themeChange",(e)=>{
                sessionStorage["theme"]=e.value;
                this.theme=e.value;
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
            isLogined:function (v){
                if(v){
                    this.loadCatalog();
                }
            }
        },
        methods:{
            navigate:function (name){
                this.selectedIds=[];
                this.$router.push(name);
            },
            logout(){
               this.httpRequest("/admin/login:logout",{}).then( ()=>{
                    sessionStorage.clear();
                    location.href="/admin/index.html"
                })
            },
            goBack:function (){
                this.$router.back(-1);
                //this.$router.go(-1);
            },
            getMainHeight:function (){
                
                return window.innerHeight-96+"px"
              
            },
            catalogSelect(key,info){
                
                this.$router.replace({path:"/articleList",query:{id:key[0]}})
            },
            loadCatalog(){
                this.httpRequest("/admin/catalog:list",{}).then(  (result)=>{
                    this.catalogList=result;
                    this.buildTree(result)
                });

                this.httpRequest("/admin/tag:list",{}).then(  (result)=>{
                    this.tagList=result;
                });
            },
            updateCount(obj){
               this.httpRequest("/admin/catalog:stats",obj).then(  (result)=>{
                     
                });
            },
            buildTree(data){
                function findChild(parentId){
                    var result=[];
                    if(data && Array.isArray(data)){
                        data.forEach((item)=>{
                            var obj={id:item.id,key:item.id,title:item.title };
                            if(item.parentId==parentId){
                                result.push(obj)
                            }
                            
                        })
                        result.forEach((item)=>{
                            let child=findChild(item.id);
                            if(child && child.length>0){
                                item.children=child;
                            }else{
                                item.isLeaf=true;
                            }
                        })
                    }
                    
                    return result;

                }
                var tree=findChild(null);
                this.catalogTree=tree;
            }
         
           
        }
    };
</script>
