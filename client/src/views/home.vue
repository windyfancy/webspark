<template>
<div>
hello,{{userName}}
</div>
</template>
<script>

    export default {
       
        data () {
            return {
                userName:null
            } 
 
        },
        created:function (){
            var self=this;
            this.userName=sessionStorage["userName"]

        },  
        mounted:function (){
 
        },
        methods:{
 
        }
    };
</script>
