<template>
  <div>
    <top-nav></top-nav>
    <div class="process-container">
      <div class="detail-all">
        <a-steps v-model="current" type="navigation" size="small" :style="stepStyle">
<!--          <a-step-->
<!--              :title="$t('sampleInput')"-->
<!--              :status="setpStatu(0)"-->
<!--              :disabled="isDisabled(0)"-->
<!--          >-->
<!--            <a-icon slot="icon" type="loading" v-if="process.taskstatu == '10'"/>-->
<!--          </a-step>-->
          <a-step
              :title="$t('samplePreparation')"
              :status="setpStatu(0)"
              :disabled="isDisabled(0)"
          >
            <a-icon slot="icon" type="loading" v-if="subTask.currentstatu == '20'"/>
          </a-step>
          <a-step
              :title="$t('libraryPreparation')"
              :status="setpStatu(1)"
              :disabled="isDisabled(1)"
          >
            <a-icon slot="icon" type="loading" v-if="subTask.currentstatu == '30'"/>
          </a-step>
          <a-step
              :title="$t('dismountData')"
              :status="setpStatu(2)"
              :disabled="isDisabled(2)"
          >
            <a-icon slot="icon" type="loading" v-if="subTask.currentstatu == '40'"/>
          </a-step>
          <a-step
              :title="$t('bioinformaticsAnalysis')"
              :status="setpStatu(3)"
              :disabled="isDisabled(3)"
          >
            <a-icon slot="icon" type="loading" v-if="subTask.currentstatu == '50'"/>
          </a-step>
          <a-step
              :title="$t('complete')"
              :status="setpStatu(4)"
              :disabled="isDisabled(4)"
          >
            <a-icon slot="icon" type="loading" v-if="subTask.currentstatu == '60'"/>
          </a-step>
        </a-steps>
        <div class="steps-content">
<!--          <process-step1 :process="process" :task-id="taskId" v-if="current == 1"></process-step1>-->
<!--          <process-step1-new :process="process" v-if="current == 0" ></process-step1-new>-->
          <process-step2 :process="process" :sub-id="subId" :task-id="subId" v-if="current == 0"></process-step2>
          <process-step3 :process="process" :sub-id="subId" v-if="current == 1"></process-step3>
          <process-step4 :process="process" :sub-id="subId" v-if="current == 2"></process-step4>
          <process-step5 :process="process" :sub-id="subId" v-if="current == 3"></process-step5>
          <process-step6 :process="process" v-if="current == 4"></process-step6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
// import ProcessStep1New from "@/components/task/processHandle/processStep1New";
import ProcessStep2 from "@/components/task/processHandle/processStep2";
import ProcessStep3 from "@/components/task/processHandle/processStep3";
import ProcessStep4 from "@/components/task/processHandle/processStep4";
import ProcessStep5 from "@/components/task/processHandle/processStep5";
import ProcessStep6 from "@/components/task/processHandle/processStep6";
import util from "@/components/publib/util";
export default {
  name: "processDetail",
  components: {ProcessStep6, ProcessStep5, ProcessStep4, ProcessStep3, ProcessStep2,  TopNav},
  data : function (){
    return{
      current:0,
      canClick : 0,
      process : {},
      subTask : {},
      subId:"",
      stepStyle: {
        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      },
    }
  },
  beforeMount() {
    console.log(this.$route.query.subId)
    this.subId = this.$route.query.subId;
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      var postData={
        subId : this.subId
      }
      if (util.isNull(this.subId)){
        return;
      }
      this.$axios.post("/task/process/subinit",postData).then(function (res){
        // console.log(res);
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.process = res.data.retMap.process;
          _this.subTask = res.data.retMap.subTask;
          if (_this.subTask.currentstatu == "10"){
            _this.current = 0;
            _this.canClick = 0;
          }else if (_this.subTask.currentstatu == "20"){
            _this.current = 0;
            _this.canClick = 0;
          }else if (_this.subTask.currentstatu == "30"){
            _this.current = 1;
            _this.canClick = 1;
          }else if (_this.subTask.currentstatu == "40"){
            _this.current = 2;
            _this.canClick = 2;
          }else if (_this.subTask.currentstatu == "50"){
            _this.current = 3;
            _this.canClick = 3;
          }else if (_this.subTask.currentstatu == "60"){
            _this.current = 4;
            _this.canClick = 4;
          }else {
            _this.current = 0;
            _this.canClick = 0;
          }
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    setpStatu : function (step){
      if (step < this.canClick){
        return "finish";
      }else if (step > this.canClick){
        return "wait";
      }else {
        return "process";
      }
    },
    isDisabled : function (step){
      return step > this.canClick;
    },
  },
  watch : {
    getsubId(newVal){
      console.log(newVal);
      this.subId = newVal;
      this.initPage();
    }
  },
  computed : {
    getsubId : function (){
      console.log(this.$route.query.subId)
      return this.$route.query.subId;
    },
  },
}
</script>

<style scoped>
  .process-container{
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
</style>