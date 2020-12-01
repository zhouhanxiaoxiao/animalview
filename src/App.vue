<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <a-back-top/>
    <a-modal :visible="visible" :footer="null" @cancel="onClose">
      <img alt="example" style="width: 100%" :src="talkUrl" />
    </a-modal>
    <div class="wx-two" v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local' ">
<!--      <a-icon type="team" @click="showDrawer" />-->
      <icon-font @click="showDrawer"
                 style="font-size: 40px;position: absolute;bottom: 10px;left: 10px;"
                 type="icon-weixin" />
    </div>
  </div>
</template>

<script>
import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});

export default {
  name: 'App',
  components: {IconFont},
  data: function () {
    return {
      transitionName: "slide-right",
      visible : false
    }
  },

  created() {
    this.$store.commit("saveUser", this.$cookies.get("user"));
  },
  methods : {
    showDrawer : function (){
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
  watch: {},
  computed : {
    talkUrl : function (){
      return this.$axios.defaults.baseURL + "img/talk";
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 50px;
}

body {
  background-image: url("./assets/login-back.jpg");
  -moz-background-size: 100%;
  background-size: 100%;
}

input {
  height: 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  opacity: 0;
}

.but-div {
}

.form-contains {
  background-color: white;
  text-align: center;
  width: 350px;
  min-height: 500px;
  padding: 20px 20px;
  border-radius: 2px;
  display: inline-block;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.input-line {
  margin-top: 10px;
  text-align: left;
  width: 100%;
  height: 50px;
  font-size: 16px;
}

.modal {
  z-index: 999 !important;
}

.modal-backdrop {
  z-index: 998 !important;
}

.main-container {
  background-color: white;
  margin-top: 100px;
  width: 90%;
  margin-left: 5%;
  min-height: 500px;
  border-radius: 5px;
  padding: 10px 10px;
  text-align: left;
  margin-bottom: 50px;
}

.pointer {
  cursor: pointer !important;
}

.wx-two {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 200px;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
