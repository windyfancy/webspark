import Vue from "vue"
import Router from './routers.js'
 

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
 

import App from './app.vue'
 
 
import Utils from "./common/utils.js"
 
Vue.use({
     install(vue,options){
     }
  
     
})
 
Vue.use(Antd);
 

Vue.mixin({methods: {
    httpRequest:Utils.httpRequest,
    getCatalogList:function (){
        var app = this.$root.$children[0];
        return app["catalogList"];
    },
    getTagList:function (){
        var app = this.$root.$children[0];
        return app["tagList"];
    }
}})
 
 
window.mainView=new Vue({ 
    el: '#app',
    router: Router,
    render:h=>h(App)   
})
 



