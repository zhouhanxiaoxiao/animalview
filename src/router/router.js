import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import login from "@/components/login";
import register from "@/components/register";


/*配置路由*/
const routes=[
    {path:'',component : login,meta:{index:0}},
    {path:'/login',component: login,meta:{index:0}},
    {path: '/register',component: register,meta:{index:1}},
    {path: '/*',login,meta:{index:0}}
]
/*实例化路由*/
const router = new VueRouter({
    routes:routes, // （简写）相当于 routes: routes
})
/*导出路由模块*/
export default router