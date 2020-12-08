import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "zico/css/zico.min.css";
import "viewerjs/dist/viewer.css";
import axios from "axios";
import router from "@/router/router";
import i18n from "@/i18n";
import Viewer from "v-viewer";
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { "inline": true, "button": true, "navbar": true, "title": true, "toolbar": true, "tooltip": true, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": true, "url": "data-source" }
});

import globalVariable from "@/api/global_variable";
import $ from "jquery";
import VueCookies from 'vue-cookies'
import md5 from 'js-md5';
import store from "@/store/store";

import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';
Vue.use(Antd);

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

import Multiselect from 'vue-multiselect'
Vue.component('multiselect', Multiselect)
Vue.use(DatePicker)

Vue.prototype.GLOBAL = globalVariable;
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;

Vue.prototype.$md5 = md5;

// VueCookies.config('1h');
Vue.prototype.$cookies = VueCookies;

Vue.prototype.$systemFlag = "local";
// Vue.prototype.$systemFlag = "animal";
// Vue.prototype.$systemFlag = "seqpro";

/*
* axios 全局设置
* */
axios.defaults.baseURL = 'http://192.168.10.11:8081/'; //本机测试
// axios.defaults.baseURL = 'http://119.90.33.35:3566/'; //果蝇管理系统
// axios.defaults.baseURL = 'http://119.90.33.35:3568/'; // 流程管理系统
axios.interceptors.request.use(config => {
  var token = VueCookies.get("token");
  if (token){
    config.headers['token'] = token;
    // config.headers['Access-Control-Allow-Origin'] = "*";
  }
  return config;
},error => {
  console.log(error);
  return Promise.reject(error);
});

import {message as $message} from "ant-design-vue";
axios.interceptors.response.use(response =>{
  return response;
},error => {
  console.log(error);
  if (error.response){
    switch (error.response.status) {
      case 401:
        VueCookies.remove("token");
        router.replace({
          path : "/login",
          query : {redirect : router.currentRoute.fullPath}
        });
        $message.error(i18n.t("logintimeover"));
        return Promise.reject("转到登录啦！");
      default:
        break;
    }
  }
  router.replace({
    path : "/error",
    query : {redirect : router.currentRoute.fullPath}
  });
});

/*路由监听*/
router.beforeEach((to, from, next) => {
  if (to.path === "/register") {
    next();
  }else if(to.path === '/login' || to.path === '/'){
    let token = VueCookies.get("token");
    if (token != 'null' && token != '' && token != null){
      next('/home');
    }else {
      next();
    }
  }
  else {
    let token = VueCookies.get("token");
    if (token === 'null' || token === '' || token === null) {
      next('/login');
    } else {
      next();
    }
  }
});

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
