import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
import login from "@/components/login";
import register from "@/components/register";
import home from "@/components/home/home";
import AnimalStock from "@/components/personal/AnimalStock";
import TaskMain from "@/components/task/TaskMain";
// import CurrentStrain from "@/components/stockcenter/CurrentStrain";
import askDetail from "@/components/task/askDetail";
import userallow from "@/components/task/userallow";
import createProcess from "@/components/task/processHandle/createProcess";
import processDetail from "@/components/task/processHandle/processDetail";
import about from "@/components/about/about";
import resource from "@/components/task/resourceOrder/resource"
import processInit from "@/components/task/processHandle/processInit";
import partnerDetail from "@/components/task/partnerHandle/partnerDetail";
import editStock from "@/components/stockcenter/editStock";
import personalMain from "@/components/personal/personalMain";
import processDetailNew from "@/components/task/processHandle/processDetailNew";
import errorPage from "@/components/publib/errorPage";
import currentStock from "@/components/stockcenter/currentStock";
import currentStrainNew from "@/components/stockcenter/currentStrainNew";
import history from "@/components/history/history";
import askTaskMain from "@/components/task/askTask/askTaskMain";

/*配置路由*/
const routes=[
    {path:'',component : login,meta:{index:0}},
    {path:'/login',component: login,meta:{index:0}},
    {path: '/register',component: register,meta:{index:0}},
    {path: '/home',component: home,meta:{index:0}},
    {path: '/personal/animalStock',component: AnimalStock,meta: {index: 0}},
    {path: '/task',component: TaskMain,meta: {index: 0}},
    {path: '/about',component: about,meta: {index: 0}},
    {path: '/task/process',component: createProcess,meta: {index: 0}},
    {path: '/stock/edit',name:"stockEdit",component: editStock,meta: {index: 0}},
    {path: '/stock/currentStock',name:"currentStock",component: currentStock,meta: {index: 0}},
    {path: '/personal/main',name:"personalMain",component: personalMain,meta: {index: 0}},
    {path: '/task/askDetail',name:"askDetail",component: askDetail,meta: {index: 0}},
    {path: '/task/askTaskMain',name:"askTaskMain",component: askTaskMain,meta: {index: 0}},
    {path: '/error',name:"error",component: errorPage,meta: {index: 0}},
    {path: '/task/partnerDetail',name:"partnerDetail",component: partnerDetail,meta: {index: 0}},
    {path: '/task/processDetail',name:"processDetail",component: processDetail,meta: {index: 0}},
    {path: '/task/processInit',name:"processInit",component: processInit,meta: {index: 0}},
    {path: '/task/processDetailNew',name:"processDetailNew",component: processDetailNew,meta: {index: 0}},
    {path: '/task/userAllow',name:"userAllow",component: userallow,meta: {index: 0}},
    {path: '/task/history',name: "history",component: history,meta: {index : 0}},
    // {path: '/stock/currentStrain',component: CurrentStrain,meta: {index: 0}},
    {path: '/stock/currentStrain',component: currentStrainNew,meta: {index: 0}},
    {path: '/task/resourceOrder',name:"resource",component: resource,meta: {index: 0}},
    {path: '/*',login,meta:{index:0}}
]
/*实例化路由*/
const router = new VueRouter({
    routes:routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router