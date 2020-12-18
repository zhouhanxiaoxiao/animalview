<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container process-detailAll">
      <a-tabs type="card" @change="callback" v-model="tabVal">
        <a-tab-pane key="9" :tab="$t('processAllConfirm')">
          <process-all-confirm :process="process" :flag="initFlag" @changeTab="changeTab"></process-all-confirm>
        </a-tab-pane>
        <a-tab-pane key="7" :tab="$t('baseInfo')">
          <process-base-info :process="process"></process-base-info>
        </a-tab-pane>
        <template v-if="process.taskstatu != 10 && process.taskstatu != 21 && process.taskstatu != 22">
          <a-tab-pane key="1">
            <template slot="tab">
              <a-badge :count="inputNum">
                {{$t('sampleInput')}}
              </a-badge>
            </template>
            <process-step1-new :process="process" :statu="statu.p1" @changeStatu="changeStatu"></process-step1-new>
          </a-tab-pane>
          <a-tab-pane key="2">
            <template slot="tab">
              <a-badge :count="makeNum">
                {{$t('samplePreparation')}}
              </a-badge>
            </template>
            <process-step2 :process="process" :statu="statu.p2" :task-id="taskId" @changeStatu="changeStatu"></process-step2>
          </a-tab-pane>
          <a-tab-pane key="3">
            <template slot="tab">
              <a-badge :count="libNum">
                {{$t('libraryPreparation')}}
              </a-badge>
            </template>
            <process-step3 :process="process" :statu="statu.p3" @changeStatu="changeStatu"></process-step3>
          </a-tab-pane>
          <a-tab-pane key="4">
            <template slot="tab">
              <a-badge :count="confirmNum">
                {{$t('uploadConfirm')}}
              </a-badge>
            </template>
            <process-step6 :process="process" :statu="statu.p4" @changeStatu="changeStatu"></process-step6>
          </a-tab-pane>
          <a-tab-pane key="5">
            <template slot="tab">
              <a-badge :count="disNum">
                {{$t('dismountData')}}
              </a-badge>
            </template>
            <process-step4 :process="process" :statu="statu.p5" @changeStatu="changeStatu"></process-step4>
          </a-tab-pane>
          <a-tab-pane key="6">
            <template slot="tab">
              <a-badge :count="bioNum">
                {{$t('bioinformaticsAnalysis')}}
              </a-badge>
            </template>
            <process-step5 :process="process" :statu="statu.p6" @changeStatu="changeStatu"></process-step5>
          </a-tab-pane>
        </template>
        <a-tab-pane key="8" :tab="$t('process.processTip')">
          <process-tip></process-tip>
        </a-tab-pane>
<!--        <a-tab-pane key="10" :tab="$t('summary')">-->
<!--          <process-all-data :process="process"></process-all-data>-->
<!--        </a-tab-pane>-->
        <div slot="tabBarExtraContent">
          <a-tag class="pointer" color="#f50" v-if="this.process.taskstatu == '71'">
            {{ "基因组学中心已拒绝：" + this.fail.reason }}
          </a-tag>
          <a-tag class="pointer" color="#f50" v-else-if="this.process.taskstatu == '72'">
            {{ "部门负责人已拒绝：" + this.fail.reason }}
          </a-tag>
          <a-popconfirm placement="topLeft"
                        :ok-text="$t('yes')"
                        v-else-if="!isStop"
                        :cancel-text="$t('no')"
                        @confirm="completeTask">
            <template slot="title">
              <p>{{ $t("areyousureCompleteProject") }}</p>
            </template>
            <a-button type="danger">
              {{ $t("projectComplete") }}
            </a-button>
          </a-popconfirm>
          <a-tag v-else-if="this.process.taskstatu == '70'" color="#87d068">
            {{ $t("allcomplete") }}
          </a-tag>
        </div>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/publib/TopNav";
import ProcessStep1New from "@/components/task/processHandle/processStep1New";
import ProcessStep2 from "@/components/task/processHandle/processStep2";
import ProcessStep3 from "@/components/task/processHandle/processStep3";
import ProcessStep4 from "@/components/task/processHandle/processStep4";
import ProcessStep5 from "@/components/task/processHandle/processStep5";
import ProcessBaseInfo from "@/components/task/processHandle/processBaseInfo";
import ProcessStep6 from "@/components/task/processHandle/processStep6";
import ProcessTip from "@/components/task/processHandle/processTip";
import ProcessAllConfirm from "@/components/task/processHandle/processAllConfirm";
// import ProcessAllData from "@/components/task/processHandle/processAllData";

export default {
  name: "processDetailNew",
  components: {
    // ProcessAllData,
    ProcessAllConfirm,
    ProcessTip,
    ProcessStep6,
    ProcessBaseInfo,
    ProcessStep5,
    ProcessStep4,
    ProcessStep3,
    ProcessStep2,
    ProcessStep1New,
    TopNav
  },
  data: function () {
    return {
      taskId: "",
      process: {taskstatu: ""},
      fail: {},
      group: {},
      tabVal: "7",
      initFlag : "01",
      todoNum : {},
      checkNum : {},
      statu : {
        "p1" : "00",
        "p2" : "00",
        "p3" : "00",
        "p4" : "00",
        "p5" : "00",
        "p6" : "00",
      }
    }
  },
  beforeMount() {
    this.taskId = this.$route.query.taskId;
    console.log(this.taskId)
    this.initPage();
  },
  methods: {
    changeStatu : function (flag){
      this.initFlag = flag;
      this.changeTipNum();
    },
    changeTab: function (tabVal,val,statu) {
      this.tabVal = tabVal;
      this.statu[val] = statu;
    },
    completeTask: function () {
      var post = {
        processId: this.process.id
      }
      var _this = this;
      this.$axios.post("/task/process/completeProject", post).catch(function (res) {
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("save_success"));
          window.location.reload();
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    callback: function (key) {
      console.log(key);
    },
    changeTipNum : function (){
      var _this = this;
      var postData = {
        processId : this.process.id
      }
      this.$axios.post("/task/process/changeTipNum", postData).then(function (res) {
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.todoNum = res.data.retMap.todoNum;
          _this.checkNum = res.data.retMap.checkNum;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initPage: function () {
      var _this = this;
      var postData = {
        taskId: this.taskId
      }
      if (this.taskId == "" || this.taskId == undefined || this.taskId == null) {
        return;
      }
      this.$axios.post("/task/process/init", postData).then(function (res) {
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.process = res.data.retMap.process;
          _this.fail = res.data.retMap.fail;
          _this.group = res.data.retMap.group;
          _this.todoNum = res.data.retMap.todoNum;
          _this.checkNum = res.data.retMap.checkNum;
          if (_this.process.taskstatu == 20) {
            _this.tabVal = "9";
          }
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
  },
  watch: {
    getTaskId(newVal) {
      console.log(newVal);
      this.taskId = newVal;
      this.initPage();
    },
  },
  computed: {
    getTaskId: function () {
      return this.$route.query.taskId;
    },
    isStop: function () {
      if (this.process.taskstatu.startsWith("7")
          || !this.$store.getters.isCurrentUser(this.group.groupadmin)
      ) {
        return true;
      }
      return false;
    },
    inputNum : function (){
      if (this.$store.getters.isCurrentUser(this.process.creater)
          && this.$store.getters.isCurrentUser(this.process.samplepreparation)
      ){
        return parseInt(this.checkNum['inputNum']) + parseInt(this.todoNum['inputNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.creater)){
        return parseInt(this.todoNum['inputNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.samplepreparation)){
        return parseInt(this.checkNum['inputNum']);
      }
      return 0;
    },
    makeNum : function (){
      if (this.$store.getters.isCurrentUser(this.process.creater)
          && this.$store.getters.isCurrentUser(this.process.samplepreparation)
      ){
        return parseInt(this.checkNum['makeNum']) + parseInt(this.todoNum['makeNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.creater)){
        return parseInt(this.checkNum['makeNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.samplepreparation)){
        return parseInt(this.todoNum['makeNum']);
      }
      return 0;
    },
    libNum : function (){
      if (this.$store.getters.isCurrentUser(this.process.creater)
          && this.$store.getters.isCurrentUser(this.process.librarypreparation)
      ){
        return parseInt(this.checkNum['libNum']) + parseInt(this.todoNum['libNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.creater)){
        return parseInt(this.checkNum['libNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.librarypreparation)){
        return parseInt(this.todoNum['libNum']);
      }
      return 0;
    },
    confirmNum : function (){
      if (this.$store.getters.isCurrentUser(this.process.creater)
          && this.$store.getters.isCurrentUser(this.process.librarypreparation)
      ){
        return parseInt(this.checkNum['confirmNum']) + parseInt(this.todoNum['confirmNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.creater)){
        return parseInt(this.checkNum['confirmNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.librarypreparation)){
        return parseInt(this.todoNum['confirmNum']);
      }
      return 0;
    },
    disNum : function (){
      if (this.$store.getters.isCurrentUser(this.process.creater)
          && this.$store.getters.isCurrentUser(this.process.dismountdata)
      ){
        return parseInt(this.checkNum['disNum']) + parseInt(this.todoNum['disNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.creater)){
        return parseInt(this.checkNum['disNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.dismountdata)){
        return parseInt(this.todoNum['disNum']);
      }
      return 0;
    },
    bioNum : function (){
      if (this.$store.getters.isCurrentUser(this.process.creater)
          && this.$store.getters.isCurrentUser(this.process.bioinformaticsanalysis)
      ){
        return parseInt(this.checkNum['bioNum']) + parseInt(this.todoNum['bioNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.creater)){
        return parseInt(this.checkNum['bioNum']);
      }else if (this.$store.getters.isCurrentUser(this.process.bioinformaticsanalysis)){
        return parseInt(this.todoNum['bioNum']);
      }
      return 0;
    }
  },
}
</script>

<style scoped>

</style>