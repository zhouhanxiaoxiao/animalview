<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-tabs type="card" @change="callback">
        <a-tab-pane key="1" :tab="$t('sampleInput')">
          <process-step1-new :process="process"></process-step1-new>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('samplePreparation')">
          <process-step2 :process="process" :task-id="taskId"></process-step2>
        </a-tab-pane>
        <a-tab-pane key="3" :tab="$t('libraryPreparation')">
          <process-step3 :process="process"></process-step3>
        </a-tab-pane>
        <a-tab-pane key="4" :tab="$t('dismountData')">
          <process-step4 :process="process"></process-step4>
        </a-tab-pane>
        <a-tab-pane key="5" :tab="$t('bioinformaticsAnalysis')">
          <process-step5 :process="process"></process-step5>
        </a-tab-pane>
        <div slot="tabBarExtraContent">
          <a-popconfirm placement="topLeft"
                        :ok-text="$t('yes')"
                        v-if="this.process.taskstatu != '70'"
                        :cancel-text="$t('no')"
                        @confirm="completeTask">
            <template slot="title">
              <p>{{ $t("areyousureCompleteProject") }}</p>
            </template>
            <a-button type="danger">
              {{ $t("projectComplete") }}
            </a-button>
          </a-popconfirm>
          <a-tag v-else color="#87d068">
            {{ $t("allcomplete") }}
          </a-tag>
        </div>
<!--        <a-tag color="purple" slot="tabBarExtraContent">-->
<!--          {{process.projectname}}-->
<!--        </a-tag>-->
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
export default {
  name: "processDetailNew",
  components: {ProcessStep5, ProcessStep4, ProcessStep3, ProcessStep2, ProcessStep1New, TopNav},
  data : function (){
    return{
      taskId:"",
      process :{}
    }
  },
  beforeMount() {
    this.taskId = this.$route.query.taskId;
    console.log(this.taskId)
    this.initPage();
  },
  methods : {
    completeTask :function (){
      var post = {
        processId : this.process.id
      }
      var _this = this;
      this.$axios.post("/task/process/completeProject",post).catch(function (res){
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("save_success"));
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    callback : function (key){
      console.log(key);
    },
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
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
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

</style>