<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <process-step1-new :process="process"></process-step1-new>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import ProcessStep1New from "@/components/task/processHandle/processStep1New";
export default {
  name: "processInit",
  components: {ProcessStep1New, TopNav},
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