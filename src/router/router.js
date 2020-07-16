import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import login from "@/components/login";
import register from "@/components/register";
import home from "@/components/home/home";
import EnterAnimalStock from "@/components/personal/EnterAnimalStock";
import AnimalStock from "@/components/personal/AnimalStock";
import TaskMain from "@/components/task/TaskMain";
import CurrentStrain from "@/components/stockcenter/CurrentStrain";

/*配置路由*/
const routes=[
    {path:'',component : login,meta:{index:0}},
    {path:'/login',component: login,meta:{index:0}},
    {path: '/register',component: register,meta:{index:0}},
    {path: '/home',component: home,meta:{index:0}},
    {path: '/personal',component: EnterAnimalStock,meta: {index: 0}},
    {path: '/personal/enterAnimalStock',component: EnterAnimalStock,meta: {index: 0}},
    {path: '/personal/animalStock',component: AnimalStock,meta: {index: 0}},
    {path: '/task',component: TaskMain,meta: {index: 0}},
    {path: '/stock/currentStrain',component: CurrentStrain,meta: {index: 0}},
    {path: '/*',login,meta:{index:0}}
]
/*实例化路由*/
const router = new VueRouter({
    routes:routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router