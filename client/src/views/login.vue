<style>
.loginForm{
    padding:20px;
   position: absolute;;
    top: 50%;
    left: 50%;
    width:420px;
    height:210px;
    margin-top: -150px;
    margin-left: -210px;
    overflow:hidden;
    border-radius: 8px;
    background-image: linear-gradient(-180deg,#fff,#f4f4f4);
    box-shadow: 2px 2px 5px rgba(0,0,0,.1), -2px -2px 5px rgba(0,0,0,.1);
}
.loginForm p{
    line-height: 50px;
}
.loginForm label{
    display: inline-block;
    width:60px;
}
</style>
<template>
<div class="loginForm">
<p><label>用户名：</label>
<a-input type="text" v-model="userName" placeholder="Username" style="width: 300px" /></p>

<p><label>密码：</label>
<a-input  type="password" v-model="password" placeholder="Password"  style="width: 300px" /></p>
<p style="text-align:center"><a-button type="primary" @click="doLogin" style="width: 120px" >登录</a-button></p>
 

</div>
</template>
<script>

    export default {
       
        data () {
            return {

                userName:null,
                password:null,
            } 
 
        },
        created:function (){

            this.httpRequest("/admin/login.restore",{}).then(  (e)=>{
              if(e.code=="OK"){
                this.prepareRedirect(e)
              }
            })
        },  
        methods:{
          doLogin(){
            let params={
              userName:this.userName,
              password:this.password
            }
            this.httpRequest("/admin/login",params).then(  (e)=>{
              if(e.code=="OK"){
                this.prepareRedirect(e)
              }else{
                alert(e.msg)
              }
            })
          },
          prepareRedirect(e){
   
                sessionStorage["userName"]=e.userName;
                sessionStorage["userType"]=e.userType;
                sessionStorage["theme"]=e.theme;
                this.$parent.theme==e.theme;
                
                this.$parent.userType=e.userType;
                this.$parent.isLogined=true;
                setTimeout(() => {
                  this.$router.push("/home")
                }, 100);
                
          }
        }
    };
</script>
