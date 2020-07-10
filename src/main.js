import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "zico/css/zico.min.css";
import axios from "axios";
import router from "@/router/router";
import i18n from "@/i18n";
import Toast from "@/components/Toast/Toast";
import globalVariable from "@/api/global_variable";
import $ from "jquery";

import VueCookies from 'vue-cookies'

Vue.prototype.GLOBAL = globalVariable;
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;
Vue.prototype.$toast = Toast;

VueCookies.config('1h');
Vue.prototype.$cookies = VueCookies;

/*
* axios 全局设置
* */
axios.defaults.baseURL = 'http://localhost:8081/';

axios.interceptors.request.use(config => {
  var token = VueCookies.get("token");
  if (token){
    config.headers.common['token'] = token;
  }
  return config;
},error => {
  console.log(error);
  return Promise.reject(error);
});

axios.interceptors.response.use(response =>{
  return response;
},error => {
  if (error.response){
    switch (error.response.status) {
      case 401:
        VueCookies.remove("token");
        router.replace({
          path : "/login",
          query : {redirect : router.currentRoute.fullPath}
        });
    }
  }
  return Promise.reject("转到登录啦！");
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === "/register") {
    next();
  } else {
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
  render: h => h(App)
}).$mount('#app')
