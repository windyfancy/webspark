import Vue from "vue"
import VueRouter from 'vue-router';


/* app view*/
import login from './views/login.vue'
import home from './views/home.vue'
import articleList from './views/articleList.vue'
import articleEdit from './views/articleEdit.vue'
import links from './views/links.vue'
import catalog from './views/catalog.vue'
import password from './views/password.vue'
import tags from './views/tags.vue'
import siteConfig from './views/siteConfig.vue'
import users from './views/users.vue'




Vue.use(VueRouter);

// 配置路由
const routes = [
      { path: '/', redirect: '/login' }, // 默认就跳转此页面
      { name:"login",path: '/login', component: login  },
      { name:"home",path: '/home', component: home  },
    { name:"articleList",path: '/articleList', component: articleList  },
    { name:"articleEdit",path: '/articleEdit', component: articleEdit  },
    { name:"links",path: '/links', component: links },
    { name:"catalog",path: '/catalog', component: catalog  },
    { name:"password",path: '/password', component: password  },

    { name:"tags",path: '/tags', component: tags },
    { name:"siteConfig",path: '/siteConfig', component: siteConfig },
    { name:"users",path: '/users', component: users }



];

// 创建Router实例
const router = new VueRouter({
    routes
});

 

export default router;