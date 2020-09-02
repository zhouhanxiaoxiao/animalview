<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-result :title="showTitle"
                :sub-title="subTitle">
        <template #icon>
          <icon-font type="icon-xiezhu" v-if="partner.taskstatu == '00'"/>
          <icon-font type="icon-chenggong" v-if="partner.taskstatu == '01'"/>
          <icon-font type="icon-jujue" v-if="partner.taskstatu == '02'"/>
        </template>
        <template #extra v-if="partner.taskstatu == '00'">
          <a-button type="primary" @click="acceptPartner">
            {{$t("accept")}}
          </a-button>
          <a-button type="danger" @click="showRefuse">
            {{$t("refuse")}}
          </a-button>
        </template>
      </a-result>
    </div>
    <refuse-alert :modalTitle="$t('refuse')" @confirmFun="refuse"></refuse-alert>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
import RefuseAlert from "@/components/publib/refuseAlert";
import Submitting from "@/components/publib/submitting";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
name: "partnerDetail",
  components: {Submitting, RefuseAlert, IconFont,TopNav},
  data : function (){
    return{
      taskId : "",
      creater : {},
      records :[],
      partner :{},
      fail : {}
    }
  },
  beforeMount() {
    this.taskId = this.$route.query.taskId;
    this.initPage();
  },
  methods : {
    initPage : function(){
      if (util.isNull(this.taskId)){
        return ;
      }
      var postData = {
        taskId : this.taskId
      };
      var _this = this;
      this.$axios.post("/task/partner/init",postData).then(function (res){
        console.log(res);
        _this.submitting = false;
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          if (util.isNull(res.data.retMap)){
            return ;
          }
          _this.creater = res.data.retMap.creater;
          _this.records = res.data.retMap.records;
          _this.partner = res.data.retMap.partner;
          _this.fail = res.data.retMap.fail;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showRefuse : function (){
      this.$("#refuseAlert").modal("show");
    },
    refuse : function (reason,remarks){
      console.log(reason,remarks);
      var postData = {
        partnerId : this.partner.id,
        reason : reason,
        remarks : remarks
      }
      var _this = this;
      this.$("#refuseAlert").modal("hide");
      this.$("#submitting").modal("show");
      this.$axios.post("/task/partner/refuse",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    acceptPartner : function (){
      var postData = {
        partnerId : this.partner.id
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/task/partner/accept",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
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
  computed:{
    getTaskId : function (){
      return this.$route.query.taskId;
    },
    showTitle : function (){
      return this.creater.name + "提出的协作请求！";
    },
    subTitle : function (){
      var sub = "时间："
      if (this.partner.taskstatu == "00"){
        for (var i = 0; i < this.records.length;i++){
          var record = this.records[i];
          sub += "自 " + formatDate(new Date(record.starttime),"yyyy-MM-dd hh:00")
              + " 到 " + formatDate(new Date(record.endtime),"yyyy-MM-dd hh:00") + "" +
              "       ";
        }
      }else {
        sub += this.partner.remark;
        if (this.partner.taskstatu == "02"){
          sub += " " + this.$t("reason") + ":" + this.fail.reason;
        }
      }
      return sub;
    }
  },

}
</script>

<style scoped>

</style>