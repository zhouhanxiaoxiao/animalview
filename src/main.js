import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "zico/css/zico.min.css";
import axios from "axios";
import router from "@/router/router";
import i18n from "@/i18n";

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

VueCookies.config('1h');
Vue.prototype.$cookies = VueCookies;

/*
* axios 全局设置
* */
axios.defaults.baseURL = 'http://localhost:8081/';
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

axios.interceptors.response.use(response =>{
  return response;
},error => {
  console.log(error);
  if (error.response){
    switch (error.response.status) {
      case 401:
        VueCookies.remove("token");
        $("body").css("background-image","./assets/login-back.jpg");
        router.replace({
          path : "/login",
          query : {redirect : router.currentRoute.fullPath}
        });
    }
  }
  return Promise.reject("转到登录啦！");
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
