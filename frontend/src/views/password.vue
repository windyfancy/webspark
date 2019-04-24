<style>
.passwordForm{
    padding:20px;
    width:460px;
    border-radius: 8px;

}
.passwordForm p{
    line-height: 50px;
}
.passwordForm label{
    display: inline-block;
    width:112px;
}
</style>

<template>
<div>
    
<div class="passwordForm">
<p><label>原密码：</label><Input type="password" v-model="passwordOld" placeholder="原密码"  style="width: 300px" /></p>
<p><label>新密码：</label><Input type="password" v-model="passwordNew" placeholder="新密码"  style="width: 300px" /></p>
<p><label>再次输入新密码：</label><Input type="password" v-model="passwordNew2" placeholder="再次输入新密码"  style="width: 300px" /></p>
<p style="text-align:center"><Button type="primary" @click="doModify" style="width: 120px" >修改密码</Button></p>
 

</div>


</div>
</template>
<script>

    export default {
       
        data () {
            return {
                password:null,
                passwordNew:null,
                passwordNew2:null
            } 
 
        },
        created:function (){
        },  
        mounted:function (){
        },
        methods:{
            doModify(){
                let params={
                    passwordOld:this.passwordOld,
                    passwordNew:this.passwordNew
                }
                if(this.passwordNew==this.passwordNew2){
                    this.httpRequest("/admin/password",params).then(  (e)=>{
                        if(e.code=="OK"){
                            this.$Message.info({content:"密码修改成功"})
                            
                        }else{
                            this.$Message.error({content:"密码修改失败"}) 
                        }
                    })
                }else{
                    alert("两次输入的新密码不一致");
                }
            }
        }
    };
</script>
