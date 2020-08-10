<template>
  <div>
    <div class="form-row" style="text-align: left">

    </div>
    <div style="text-align: left">
      {{$t("expectionObject")}}：
    </div>
    <ask-task-detail-item v-for="item in rows" :key="item.id" :row="item" @handler="handlerStat" ></ask-task-detail-item>
    <div class="form-row">
      <!--  备注  -->
      <div class="form-group-sm col-md-12">
        <label for="remarks">{{$t("remarks")}}</label>
        <textarea class="form-control" id="remarks" rows="2" disabled="disabled" :value="ask.remarks"></textarea>
      </div>
    </div>
    <refuse-alert :detail-id="detailId" :modal-title="$t('refuseTask')" @confirmFun="refuseTask"></refuse-alert>
    <confirm-ask-task :detail-id="detailId" @confirmData="confrimAskData"></confirm-ask-task>
    <submitting  :title="$t('submitting')"></submitting>
  </div>
</template>
<script>

import AskTaskDetailItem from "@/components/task/AskTaskDetailItem";
import {formatDate} from "@/components/publib/date";
import RefuseAlert from "@/components/publib/refuseAlert";
import Submitting from "@/components/publib/submitting";
import ConfirmAskTask from "@/components/task/confirmAskTask";

export default {
  name: "askDetailSetp1",
  components: { AskTaskDetailItem,RefuseAlert, Submitting, ConfirmAskTask},
  props : {
    taskId : String,
    rows : Array,
    ask : Object
  },
  data: function(){
    return{
      detailId : ""
    }
  },
  beforeMount : function(){

  },
  methods : {
    longToStr : function (date) {
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd");
    },
    handlerStat : function (stat,detailId){
      console.log(stat,detailId);
      this.detailId = detailId;
      if (stat == "refuse") {
        this.$("#refuseAlert").modal("show");
      } else {
        this.$("#confirmAskTask").modal("show");
      }
    },
    /*拒绝申请任务*/
    refuseTask: function (reason,remarks) {
      console.log(reason,remarks);
      this.$("#refuseAlert").modal("hide");
      this.$("#submitting").modal("show");
      var _this = this;
      var postData = {
        taskId : this.taskId,
        detailId : this.detailId,
        remarks : remarks,
        reason : reason
      }
      this.$axios.post("/task/ask/refuse",postData).then(function (res){
        console.log(res);
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$emit("initAskDetail");
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    /*确认申请任务*/
    confrimAskData: function (data) {
      console.log(data);
      this.$("#confirmAskTask").modal("hide");
      this.$("#submitting").modal("show");
      var _this = this;
      data.taskid = this.taskId;
      data.detailId = this.detailId;
      this.$axios.post("/task/ask/confirm",data).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$emit("initAskDetail");
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
  },
  watch : {

  }
}
</script>

<style scoped>

</style>