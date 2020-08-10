<template>
  <div>
    <top-nav></top-nav>
    <div class="confirm-container">
      <div class="form-row">
        <div class="form-group col-md-4">
          <label for="creater">{{$t("creater")}}</label>
          <input type="text" class="form-control" id="creater" disabled :value="creater.name">
        </div>
        <div class="form-group col-md-4">
          <label for="email">{{$t("userEmail")}}</label>
          <input type="text" class="form-control" id="email" disabled :value="creater.email">
        </div>
        <div class="form-group col-md-4">
          <label for="submitTime">{{$t("submitTime")}}</label>
          <input type="text" class="form-control" id="submitTime" disabled :value="longToStr(creater.createtime)">
        </div>
      </div>
      <hr  class="my-4" v-if="task.taskstatu == '03'">
      <div class="form-row" v-if="task.taskstatu == '03'">
        <div class="form-group col-md-12">
          <label for="reason">{{$t("reason")}}</label>
          <textarea class="form-control" id="reason" rows="2" disabled :value="fail.reason"></textarea>
        </div>
        <div class="form-group col-md-12">
          <label for="reason">{{$t("remarks")}}</label>
          <textarea class="form-control" id="remarks" rows="2" disabled :value="fail.remarks"></textarea>
        </div>
      </div>
      <div class="modal-footer" style="margin-top: 10px" v-if="task.taskstatu == '01'">
        <button type="button" class="btn btn-danger" @click="refuseAllow">{{$t("refuse")}}</button>
        <button type="button" class="btn btn-primary" @click="selectRoles">{{$t("confirm")}}</button>
      </div>
    </div>
    <refuse-alert :modal-title="$t('refuseTask')" @confirmFun="refuseTask"></refuse-alert>
    <submitting :title="$t('submitting')"></submitting>
    <confirm-allow :roles="roles" @confrimRoles="confrimRoles"></confirm-allow>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import {formatDate} from "@/components/publib/date";
import RefuseAlert from "@/components/publib/refuseAlert";
import Submitting from "@/components/publib/submitting";
import ConfirmAllow from "@/components/task/confirmAllow";
export default {
  name: "userallow",
  components: {ConfirmAllow, Submitting, RefuseAlert, TopNav},
  data : function (){
    return {
      taskId : "",
      task : {},
      creater : {},
      roles : [],
      fail :{}
    }
  },
  mounted: function() {
    this.taskId = this.$route.query.taskId;
    this.initPage();
  },
  methods : {
    initPage : function (){
      var postData = {
        taskId : this.taskId
      }
      if (this.taskId == null || this.taskId == "" || this.taskId == undefined){
        return;
      }
      var _this = this;
      this.$axios.post("/task/user/allowTask",postData).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          _this.task = res.data.retMap.task;
          _this.creater = res.data.retMap.creater;
          _this.roles = res.data.retMap.roles;
          _this.fail = res.data.retMap.fail;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    longToStr : function (date) {
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd");
    },
    refuseAllow : function (){
      this.$("#refuseAlert").modal("show");
    },
    selectRoles : function (){
      this.$("#confirmAllow").modal("show");
    },
    refuseTask : function (reason,remarks){
      console.log(reason,remarks);
      this.$("#refuseAlert").modal("hide");
      this.$("#submitting").modal("show");
      var postData = {
        reason : reason,
        remarks : remarks,
        taskId : this.taskId
      }
      var _this = this;
      this.$axios.post("/task/user/refuseAllow",postData).then(function (res){
        console.log(res);
        _this.$("#submitting").modal('hide');
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
        _this.$("#submitting").modal('hide');
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    confrimRoles : function (data){
      this.$("#confirmAllow").modal("hide");
      this.$("#submitting").modal("show");
      var postData = {
        roles : data,
        taskId : this.taskId
      }
      var _this = this;
      this.$axios.post("/task/user/allowCreate",postData).then(function (res){
        _this.$("#submitting").modal('hide');
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
        _this.$("#submitting").modal('hide');
        _this.$message.error(_this.$t("systemErr"));
      })
    }
  },
  watch : {
    getTaskId(newVal){
      this.taskId = newVal;
      this.initPage();
    }
  },
  computed : {
    getTaskId : function (){
      return this.$route.query.taskId;
    }
  }
}
</script>

<style scoped>
  .confirm-container{
    background-color: white;
    margin-top: 100px;
    padding: 20px 20px;
    width: 90%;
    margin-left: 5%;
    min-height: 500px;
    border-radius: 5px;
    overflow-x: auto;
    text-align: left;
    font-size: 14px;
  }
</style>