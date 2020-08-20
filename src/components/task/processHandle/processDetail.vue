<template>
  <div>
    <top-nav></top-nav>
    <div class="process-container">
      <div class="detail-all">
        <a-steps v-model="current" type="navigation" size="small" :style="stepStyle">
          <a-step
              :title="$t('sampleInput')"
              :status="setpStatu(0)"
              :disabled="isDisabled(0)"
          >
            <a-icon slot="icon" type="loading" v-if="process.taskstatu == '01'"/>
          </a-step>
          <a-step
              :title="$t('samplePreparation')"
              :status="setpStatu(1)"
              :disabled="isDisabled(1)"
          >
            <a-icon slot="icon" type="loading" v-if="process.taskstatu == '02'"/>
          </a-step>
          <a-step
              :title="$t('libraryPreparation')"
              :status="setpStatu(2)"
              :disabled="isDisabled(2)"
          >
            <a-icon slot="icon" type="loading" v-if="process.taskstatu == '03'"/>
          </a-step>
          <a-step
              :title="$t('dismountData')"
              :status="setpStatu(3)"
              :disabled="isDisabled(3)"
          >
            <a-icon slot="icon" type="loading" v-if="process.taskstatu == '04'"/>
          </a-step>
          <a-step
              :title="$t('bioinformaticsAnalysis')"
              :status="setpStatu(4)"
              :disabled="isDisabled(4)"
          >
            <a-icon slot="icon" type="loading" v-if="process.taskstatu == '05'"/>
          </a-step>
        </a-steps>
        <div class="steps-content">
<!--          <process-step1 :process="process" :task-id="taskId" v-if="current == 1"></process-step1>-->
          <process-step1-new :process="process" v-if="current == 0" ></process-step1-new>
          <process-step2 :process="process" :task-id="taskId" v-if="current == 1"></process-step2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import ProcessStep1New from "@/components/task/processHandle/processStep1New";
import ProcessStep2 from "@/components/task/processHandle/processStep2";
export default {
  name: "processDetail",
  components: {ProcessStep2, ProcessStep1New, TopNav},
  data : function (){
    return{
      current:0,
      canClick : 0,
      process : {},
      taskId:"",
      stepStyle: {
        marginBottom: '60px',
        boxShadow: '0px -1px 0 0 #e8e8e8 inset',
      },
    }
  },
  beforeMount() {
    this.taskId = this.$route.query.taskId;
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      var postData={
        taskId : this.taskId
      }
      if (this.taskId == "" || this.taskId == undefined || this.taskId == null){
        return;
      }
      this.$axios.post("/task/process/init",postData).then(function (res){
        // console.log(res);
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.process = res.data.retMap.process;
          console.log(_this.process);
          if (_this.process.taskstatu == "10"){
            _this.current = 0;
            _this.canClick = 0;
          }else if (_this.process.taskstatu == "20"){
            _this.current = 1;
            _this.canClick = 1;
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
    getTaskId(newVal){
      console.log(newVal);
      this.taskId = newVal;
      this.initPage();
    }
  },
  computed : {
    getTaskId : function (){
      return this.$route.query.taskId;
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