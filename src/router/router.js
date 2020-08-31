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
import askDetail from "@/components/task/askDetail";
import userallow from "@/components/task/userallow";
import createProcess from "@/components/task/processHandle/createProcess";
import processDetail from "@/components/task/processHandle/processDetail";
import about from "@/components/about/about";
import resource from "@/components/task/resourceOrder/resource"

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
    {path: '/about',component: about,meta: {index: 0}},
    {path: '/task/process',component: createProcess,meta: {index: 0}},
    {path: '/task/askDetail',name:"askDetail",component: askDetail,meta: {index: 0}},
    {path: '/task/processDetail',name:"processDetail",component: processDetail,meta: {index: 0}},
    {path: '/task/userAllow',name:"userAllow",component: userallow,meta: {index: 0}},
    {path: '/stock/currentStrain',component: CurrentStrain,meta: {index: 0}},
    {path: '/task/resourceOrder',name:"resource",component: resource,meta: {index: 0}},
    {path: '/*',login,meta:{index:0}}
]
/*实例化路由*/
const router = new VueRouter({
    routes:routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router