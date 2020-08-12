<template>
  <div>
    <top-nav></top-nav>
    <div class="process-container">
      <div class="detail-all">
        <a-steps v-model="current" type="navigation" size="small" :style="stepStyle">
          <a-step
              :title="$t('samplePreparation')"
              :status="setpStatu(0)"
              :disabled="isDisabled(0)"
          >
            <a-icon slot="icon" type="loading"/>
          </a-step>
          <a-step
              :title="$t('libraryPreparation')"
              :status="setpStatu(1)"
              :disabled="isDisabled(1)"
          >
            <a-icon slot="icon" type="loading"/>
          </a-step>
          <a-step
              :title="$t('dismountData')"
              :status="setpStatu(2)"
              :disabled="isDisabled(2)"
          >
            <a-icon slot="icon" type="loading"/>
          </a-step>
          <a-step
              :title="$t('bioinformaticsAnalysis')"
              :status="setpStatu(3)"
              :disabled="isDisabled(3)"
          >
            <a-icon slot="icon" type="loading"/>
          </a-step>
        </a-steps>
        <div class="steps-content">
          <process-step1 :process="process" :task-id="taskId" v-if="current == 0"></process-step1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import ProcessStep1 from "@/components/task/processHandle/processStep1";
export default {
  name: "processDetail",
  components: {ProcessStep1, TopNav},
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
        processId : this.process.id
      }
      this.$axios.post("/task/process/init",postData).then(function (res){
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.process = res.data.retMap.process;
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
      this.taskId = newVal;
      this.initPage();
    },
  },
  computed : {
    getTaskId : function (){
      return this.$route.query.taskId;
    },
  }
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