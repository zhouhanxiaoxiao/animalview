<template>
  <div>
    <top-nav></top-nav>
    <div class="detail-all">
      <a-steps v-model="current" type="navigation" size="small" :style="stepStyle">
        <a-step
            :title="$t('orderDetail') + $t('confirm')"
            :status="setpStatu(0)"
            :disabled="isDisabled(0)"
        >
          <a-icon slot="icon" type="loading" v-if="ask.currentstatu == '01' || ask.currentstatu == '00'"/>
        </a-step>
        <a-step
            :title="$t('expectionObject') + $t('prepare')"
            :status="setpStatu(1)"
            :disabled="isDisabled(1)"
        ><a-icon slot="icon" type="loading" v-if="ask.currentstatu == '02' || ask.currentstatu == '03'"/></a-step>
        <a-step
            title="实验员确认"
            :status="setpStatu(2)"
            :disabled="isDisabled(2)"
        ><a-icon slot="icon" type="loading" v-if="ask.currentstatu == '04'"/></a-step>
      </a-steps>
      <div class="steps-content">
        <ask-detail-setp1 v-if="current == 0"
                          :ask="ask"
                          :rows="rows"
                          @initAskDetail = this.init
                          :task-id="taskId"></ask-detail-setp1>
        <ask-detail-step2 v-if="current == 1" :task-id="taskId" :ask="ask"></ask-detail-step2>
        <ask-detail-step3 v-if="current == 2" :task-id="taskId" :ask="ask"></ask-detail-step3>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import AskDetailSetp1 from "@/components/task/askDetailStep1";
import AskDetailStep2 from "@/components/task/askDetailStep2";
import AskDetailStep3 from "@/components/task/askDetailStep3";

export default {
  name: "askDetail",
  components: {AskDetailStep3, AskDetailStep2, AskDetailSetp1, TopNav},
  data: function(){
    return{
      current: 0,
      canClick : 0,
      taskId : "",
      rows : [],
      ask : {},
      stepStyle: {
        marginBottom: '60px',
        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      },
    }
  },
  mounted : function(){
    this.taskId = this.$route.query.taskId;
    this.init();
  },
  methods : {
    init : function () {
      var _this = this;
      console.log(this.taskId);
      if (this.taskId == "" || this.taskId == undefined || this.taskId == null){
        return;
      }
      this.current = 0;
      this.canClick = 0;
      var postData = {
        taskId : this.taskId
      };
      if (this.taskId == "" || this.taskId == null){
        return;
      }
      this.$axios.post("/task/askTaskDetail",postData).then(function (res) {
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.rows = res.data.retMap.rows;
          _this.ask = res.data.retMap.ask;
          if (res.data.retMap.ask.currentstatu == "01" || res.data.retMap.ask.currentstatu == "00"){
            _this.current = 0;
            _this.canClick = 0;
          }else if (res.data.retMap.ask.currentstatu == "02"
              ||res.data.retMap.ask.currentstatu == "03"){
            _this.current = 1;
            _this.canClick = 1;
          }else if (res.data.retMap.ask.currentstatu == "04"){
            _this.current = 2;
            _this.canClick = 2;
          }else {
            _this.current = 2;
            _this.canClick = 3;
          }
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    next() {
      this.current++;
    },
    isDisabled : function (step){
      return step > this.canClick;
    },
    setpStatu : function (step){
      if (this.ask.currentstatu == "09" && step == this.canClick){
        return "error";
      }
      if (this.ask.currentstatu == "08" && step == 2){
        return "error";
      }
      if (step < this.canClick){
        return "finish";
      }else if (step > this.canClick){
        return "wait";
      }else {
        return "process";
      }
    }
  },
  watch : {
    getTaskId(newVal){
      this.taskId = newVal;
      this.init();
    },
    current(newVal){
      console.log(newVal);
    }
  },
  computed : {
    getTaskId : function (){
      return this.$route.query.taskId;
    },
  }
}
</script>

<style scoped>
  .detail-all{
    background-color: white;
    margin-top: 100px;
    width: 90%;
    margin-left: 5%;
    min-height: 500px;
    border-radius: 5px;
    padding: 10px 10px;
    text-align: left;
  }
  .steps-content {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 6px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: left;
    padding: 10px 10px;
  }

  .steps-action {
    margin-top: 24px;
  }
</style>