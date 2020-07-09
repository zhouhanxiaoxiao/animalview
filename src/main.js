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

axios.defaults.baseURL = 'http://localhost:8081/'

Vue.prototype.GLOBAL = globalVariable;
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;


Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App)

}).$mount('#app')
