<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
    <a-back-top/>
    <a-modal :visible="visible" :footer="null" @cancel="onClose">
      <img alt="example" style="width: 100%" :src="talkUrl"/>
    </a-modal>
    <div class="wx-two">
      <a-popover placement="right" :title="'快速访问'" trigger="click">
        <template slot="content">
          <div style="width: 300px">
            <a-tooltip :title="'北京脑科学与类脑研究中心'" placement="top">
              <div @click="gotoCibrHome" style="width: 65px;height: 40px;cursor: pointer;display: inline-block;">
                <img src="./assets/CIBR-icon.png" style="width: 100%;height: 100%"/>
              </div>
            </a-tooltip>
            <a-tooltip :title="'果蝇家园'" placement="top"
                       v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local'">
              <icon-font @click="gotoFlyWeb"
                         style="font-size: 40px;display: inline-block;width: 40px;height: 40px;margin-left: -5px"
                         type="icon-guoying"/>
            </a-tooltip>

            <a-tooltip :title="'测序之家'" placement="top"
                       v-if="this.$systemFlag == 'animal' || this.$systemFlag == 'local'">
              <icon-font @click="gotoSeqpro"
                         style="font-size: 40px;display: inline-block;width: 40px;height: 40px;margin-left: 10px"
                         type="icon-jiyinjiancebaogao"/>
            </a-tooltip>

            <a-tooltip :title="'基因组学中心'" placement="top">
              <icon-font @click="gotoGeneWeb"
                         style="font-size: 40px;display: inline-block;width: 40px;height: 40px;margin-left: 10px"
                         type="icon-jiyinshuju"/>
            </a-tooltip>

            <a-tooltip :title="'计算中心'" placement="top">
              <icon-font @click="gotoHpc"
                         style="font-size: 40px;display: inline-block;width: 40px;height: 40px;margin-left: 12px"
                         type="icon-shuliang"/>
            </a-tooltip>

            <a-tooltip :title="'微信群二维码'" placement="top">
              <a-icon type="wechat" @click="showDrawer"
                      v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local'"
                      theme="filled"
                      style="font-size: 40px;display: inline-block;width: 40px;height: 40px;margin-left: 12px"/>
<!--              <icon-font @click="showDrawer" v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local'"-->
<!--                         style="font-size: 40px;display: inline-block;width: 40px;height: 40px;margin-left: 10px"-->
<!--                         type="icon-lianxiwomen"/>-->
            </a-tooltip>


          </div>
        </template>
        <a-icon type="environment" style="font-size: 40px;position: absolute;bottom: 40px;left: 20px;cursor: pointer"
                theme="twoTone" two-tone-color="#eb2f96"
        />
      </a-popover>
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
      visible: false
    }
  },

  created() {
    this.$store.commit("saveUser", this.$cookies.get("user"));
  },
  methods: {
    showDrawer: function () {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    gotoGeneWeb: function () {
      window.open("http://genomics.cibr.ac.cn/");
    },
    gotoFlyWeb: function () {
      window.open("http://119.90.33.35:3566/");
    },
    gotoCibrHome: function () {
      window.open("http://www.cibr.ac.cn/");
    },
    gotoSeqpro: function () {
      window.open("http://seq.cibr.ac.cn/");
    },
    gotoHpc : function (){
      window.open("http://hpc.cibr.ac.cn/");
    }

  },
  watch: {},
  computed: {
    talkUrl: function () {
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
  margin-top: 120px;
  width: 90%;
  margin-left: 5%;
  min-height: 60vh;
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

.draw-div {
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
