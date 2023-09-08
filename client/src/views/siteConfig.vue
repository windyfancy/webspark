<style>
.themeItem{
    display:inline-block;
    width:170px;
    margin:10px; padding:10px;
    text-align: center;
    cursor: pointer;
}
.themeText{
    text-align: center;
}
.current{
    background-color: #e0ecf9;
    border: 1px solid #a7c5e2;
}
</style>
<template>
<div>
    <h2>选择站点主题风格：</h2>
    <ul>
        <li v-for="(item,key) in listData" v-bind:key="key" :class="getItemStyle(item)" @click="setTheme(key)">
            <div><img :src="'/themes/'+item.style+'/images/thumbnail.png'" style="width:150px;"></div>
            <span class="themeText">{{item.name}}</span>
        </li>
    </ul>
</div>
</template>
<script>

    export default {
       
        data () {
            return {
                currentTheme:"default",
                listData:[]
            } 
 
        },
        created:function (){
             this.loadData();
        },  
        mounted:function (){
 
        },
        methods:{
            loadData(){
                this.httpRequest("/admin/config:getThemes",{}).then(  (res)=>{
                    if(res){
                        this.listData=res.themesList;
                        this.currentTheme=res.theme;
                    } 
              })
            },
            getItemStyle(item){
              
                if(item.style==this.currentTheme){
                    return "themeItem current"
                }else{
                    return "themeItem"
                }
            },
            setTheme(key){
                 
                this.httpRequest("/admin/config:setTheme",{theme:key}).then(  (res)=>{
                        if(res){
                            this.$parent.$emit("themeChange",{value:key})
                            this.loadData();
                        } 
                })
            }
        }
    };
</script>
