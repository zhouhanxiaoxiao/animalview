<template>
  <div>
    已准备完成：
    <prepared-detail @confirmTask="confirmTask" v-for="row in rows" :key="row.prepare.id"
                     :task="task"
                     :row="row"></prepared-detail>
    <comfirm-prepared :prepare-id="prepareId" @submitData="submitData"></comfirm-prepared>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>
<script>
import PreparedDetail from "@/components/task/PreparedDetail";
import ComfirmPrepared from "@/components/task/comfirmPrepared";
import Submitting from "@/components/publib/submitting";
export default {
  name: "askDetailStep3",
  components: {Submitting, ComfirmPrepared, PreparedDetail},
  props:{
    taskId : String,
    ask : Object,
    task : Object
  },
  data : function (){
    return {
      rows:[],
      prepareId : ""
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods :{
    confirmTask : function (preId){
      this.prepareId = preId;
      this.$("#confirmPrepared").modal("show");
    },
    submitData : function (data){
      this.$("#confirmPrepared").modal("hide");
      this.$("#submitting").modal("show");
      var _this = this;
      this.$axios.post("/task/ask/confirmTask",data).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initPage : function (){
      var postData = {
        askId : this.ask.id
      }
      var _this = this;
      this.$axios.post("/task/ask/getPrepare",postData).then(function (res){
        // console.log(res);
        _this.$("#submitting").modal('hide');
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          // console.log(res);
          _this.rows = res.data.retMap.rows;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch:{
    taskId(){
      this.initPage();
    }
  }
}
</script>

<style scoped>

</style>