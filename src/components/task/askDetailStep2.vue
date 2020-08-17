<template>
  <div>
    <div>{{$t("expectionPrep")}}</div>
    <prepare-detail
        :task="task"
        @refresh="init" v-for="row in rows" :key="row.prepare.id" :row="row" @confirm="handleConfirm"></prepare-detail>
    <comfirm-prepare @comfirmPrep="confirmPrep" :preid="prepareId"></comfirm-prepare>
    <refuse-alert :modalTitle="$t('refuse')"></refuse-alert>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>
<script>
import PrepareDetail from "@/components/task/PrepareDetail";
import ComfirmPrepare from "@/components/task/comfirmPrepare";
import RefuseAlert from "@/components/publib/refuseAlert";
import Submitting from "@/components/publib/submitting";
export default {
  name: "askDetailStep2",
  components: {Submitting, RefuseAlert, ComfirmPrepare, PrepareDetail},
  props : {
    taskId : String,
    ask : Object,
    task : Object
  },
  data : function (){
    return{
      rows : [],
      prepareId : ""
    }
  },
  beforeMount:function() {
    this.init();
  },
  methods : {
    init : function (){
      var postData = {
        askId : this.ask.id
      }
      var _this = this;
      this.$axios.post("/task/ask/getPrepare",postData).then(function (res){
        // console.log(res);
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.rows = res.data.retMap.rows;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    handleConfirm : function (preid){
      this.prepareId = preid;
      this.$("#confirmPrepare").modal("show");
    },
    confirmPrep : function (data){
      this.$("#confirmPrepare").modal("hide");
      this.$("#submitting").modal("show");
      var _this = this;
      console.log(data);
      this.$axios.post("/task/ask/confirmPrepare",data).then(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          _this.init();
          _this.$emit("initAskDetail");
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  computed : {
    canEdit : function (){
      if (this.ask.currentstatu == "02"){
        return false;
      }
      return true;
    }
  }
}
</script>

<style scoped>

</style>