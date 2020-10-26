<template>
  <div>
    <a-divider orientation="left">{{$t("processMsg")}}</a-divider>
    <div class="form-row">
      <div class="form-group col-md-4 col-sm-12 col-lg-3">
        <label for="projectName">{{ $t("projectName") }}</label>
        <a-tooltip id="projectName" :trigger="['hover']" placement="topLeft"
                   :title="process.projectname" :auto-adjust-overflow="true">
          <a-input v-model="process.projectname" :disabled="true"/>
        </a-tooltip>
      </div>
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="dataType">{{ $t("dataType") }}</label>
        <a-input id="dataType" v-model="process.datatype" :disabled="true"/>
      </div>
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="principal">{{ $t("principal") }}</label>
        <div id="principal">
          <a-select  style="width: 100%" v-model="process.principal" :disabled="true">
            <a-select-option v-for="user in users" :key="user.id">
              {{ user.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="form-group col-md-4 col-sm-12 col-lg-3">
        <label for="email">{{ $t("userEmail") }}</label>
        <a-tooltip placement="topRight" title="数据下载及报告分析完成后将发送相关信息至以上邮箱列表"
                   :mouseLeaveDelay="1"
                   :auto-adjust-overflow="true">
          <div id="email">
            <a-tag color="blue" v-for="email in processEmails" :key="email.email">
              {{ email.email }}
            </a-tag>
          </div>
        </a-tooltip>
      </div>
      <!--样本类型-->
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="sampleMsg">{{$t("sampleMsg")  }}</label>
        <div id="sampleMsg">
          <a-select style="width: 100%" v-model="sampleTypes" mode="multiple" :disabled="true">
            <a-select-option value="01">{{$t("nucleicAcid") + $t("sample")}}</a-select-option>
            <a-select-option value="02">{{$t("tissue") + $t("sample")}}</a-select-option>
            <a-select-option value="03">{{$t("cell") + $t("sample")}}</a-select-option>
          </a-select>
        </div>
      </div>
      <!--  项目描述  -->
      <div class="form-group-sm col-md-12">
        <label for="projectDesc">{{$t("projectDesc")}}</label>
        <textarea class="form-control" id="projectDesc" v-model="process.projectdesc" maxlength="1000"
                  placeholder="例：果蝇近缘物种雌雄脑睾丸子宫转录组" rows="3" :disabled="true"></textarea>
      </div>
      <a-divider orientation="left">{{$t("staffing")}}</a-divider>
      <!--样品录入负责人-->
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="sampleInput">{{$t("sampleInput") + $t("principal") }}</label>
        <div id="sampleInput">
          <a-select style="width: 100%" v-model="process.sampleinput" :disabled="isNotConfirm && isPInotConfirm">
            <a-select-option v-for="user in geneGroupUser" :key="user.id">
              {{ user.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!--样品制备负责人-->
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="samplePreparation">{{$t("samplePreparation") + $t("principal") }}</label>
        <div id="samplePreparation">
          <a-select style="width: 100%" v-model="process.samplepreparation" :disabled="isNotConfirm && isPInotConfirm">
            <a-select-option v-for="user in geneGroupUser" :key="user.id">
              {{ user.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!--文库制备负责人-->
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="libraryPreparation">{{$t("libraryPreparation") + $t("principal") }}</label>
        <div id="libraryPreparation">
          <a-select style="width: 100%" v-model="process.librarypreparation" :disabled="isNotConfirm && isPInotConfirm">
            <a-select-option v-for="user in geneGroupUser" :key="user.id">
              {{ user.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!--下机数据负责人-->
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="dismountData">{{$t("dismountData") + $t("principal") }}</label>
        <div id="dismountData">
          <a-select style="width: 100%" v-model="process.dismountdata" :disabled="isNotConfirm && isPInotConfirm">
            <a-select-option v-for="user in geneGroupUser" :key="user.id">
              {{ user.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!--生信分析负责人-->
      <div class="form-group col-md-4 col-sm-12 col-lg-2">
        <label for="bioinformaticsAnalysis">{{$t("bioinformaticsAnalysis") + $t("principal") }}</label>
        <div id="bioinformaticsAnalysis">
          <a-select style="width: 100%" v-model="process.bioinformaticsanalysis" :disabled="isNotConfirm && isPInotConfirm">
            <a-select-option v-for="user in geneGroupUser" :key="user.id">
              {{ user.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <!--  备注  -->
      <div class="form-group-sm col-md-12">
        <label for="remarks">{{$t("remarks")}}</label>
        <textarea class="form-control" id="remarks" v-model="process.remarks" rows="3" :disabled="true"></textarea>
      </div>
    </div>
    <div class="modal-footer" style="margin-top: 20px">
      <a-button type="primary" v-if="!isNotConfirm" @click="updateProcess('confirm')">
        {{$t("confirm")}}
      </a-button>
      <a-button type="danger" v-if="!isNotConfirm" @click="showRefuseAlert('admin')">
        {{$t("refuse")}}
      </a-button>
      <a-button type="primary" v-if="!isPInotConfirm" @click="updateProcessByPi('confirm')">
        {{$t("confirm")}}
      </a-button>
      <a-button type="danger" v-if="!isPInotConfirm" @click="showRefuseAlert('pi')">
        {{$t("refuse")}}
      </a-button>
      <a-tag class="pointer" color="#87d068" v-if="this.process.taskstatu == '20' || this.process.taskstatu == '21'">
        {{ "部门负责人已确认" }}
      </a-tag>
      <a-tag class="pointer" color="#87d068" v-if="this.process.taskstatu == '20' || this.process.taskstatu == '22'">
        {{ "基因组学中心已确认" }}
      </a-tag>
    </div>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <refuse-alert :modal-title="$t('refuse')" ref="refuse" @confirmFun="refuseFun"></refuse-alert>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";
import RefuseAlert from "@/components/publib/refuseAlert";

export default {
  name: "processBaseInfo",
  components: {RefuseAlert, Submitting},
  props : {
    process : Object
  },
  data : function (){
    return {
      users : [],
      processEmails : [],
      sampleTypes :[],
      jyzxGroup : {},
      task : {},
      groupAdmin : {},
      refuseFlag : "",
      reason : "",
      remark : "",
      fail : {}
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      if (util.isNull(this.process.id)){
        return ;
      }
      console.log(this.process);
      this.sampleTypes = this.process.sampletype.split("##");
      var _this = this;
      var postData = {
        processId : this.process.id
      };
      this.$axios.post("/task/process/baseInfo",postData).then(function (res){
        console.log(res)
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.users = res.data.retMap.users;
          _this.processEmails = res.data.retMap.processEmails;
          _this.jyzxGroup = res.data.retMap.jyzxzx;
          _this.task = res.data.retMap.task;
          _this.fail = res.data.retMap.fail;
          _this.groupAdmin = res.data.retMap.groupAdmin;
          _this.$notification.warning({
            key:"processBase",
            placement:"bottomRight",
            message: _this.$t("remind"),
            description: _this.$t('processSelectPre'),
            duration : 60,
            getContainer : function (){
              return _this.$(".process-detailAll")[0];
            }
          });
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    refuseFun : function (reason,remarks){
      this.$(this.$refs.refuse.$el).modal("hide");
      this.reason = reason;
      this.remark = remarks;
      if (this.refuseFlag == "pi"){
        this.updateProcessByPi("refuse");
      }else if (this.refuseFlag == "admin"){
        this.updateProcess("refuse");
      }

    },
    showRefuseAlert : function (flag){
      this.refuseFlag = flag;
      this.$(this.$refs.refuse.$el).modal("show");
    },
    updateProcessByPi : function (flag){
      if (flag == "confirm" || !this.checkPre()){
        return ;
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      var postData = {
        process : JSON.stringify(this.process),
        flag : flag,
        reason : this.reason,
        remark : this.remark
      }
      this.$axios.post("/task/process/pisetPrincepal",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("save_success"));
          window.location.reload();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    checkPre : function (){
      if (util.isNull(this.process.sampleinput)){
        this.$message.error(this.$t("sampleInput") + this.$t("principal") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(this.process.samplepreparation)){
        this.$message.error(this.$t("samplePreparation") + this.$t("principal") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(this.process.librarypreparation)){
        this.$message.error(this.$t("libraryPreparation") + this.$t("principal") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(this.process.dismountdata)){
        this.$message.error(this.$t("dismountData") + this.$t("principal") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(this.process.bioinformaticsanalysis)){
        this.$message.error(this.$t("bioinformaticsAnalysis") + this.$t("principal") + this.$t("not_null"));
        return false;
      }
      return  true;
    },
    updateProcess : function (flag){
      if (flag == "confirm" || !this.checkPre()){
        return ;
      }
      var postData = {
        process : JSON.stringify(this.process),
        reason : this.reason,
        remark : this.remark,
        flag :flag
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/setPrincepal",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("save_success"));
          window.location.reload();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },

  },
  watch:{
    process : {
      handler(newVal){
        if (util.isNull(newVal)){
          return ;
        }
        this.initPage();
      },
      deep : true
    }
  },
  computed : {
    isNotConfirm : function (){
      if (
          (this.process.taskstatu == "10" || this.process.taskstatu == "21")
          && this.task.currentuser == this.$store.getters.getUser.id
      ){
        return false;
      }
      return true;
    },
    isPInotConfirm : function (){
      if (
          (this.process.taskstatu == "10" || this.process.taskstatu == "22")
          && this.groupAdmin.id == this.$store.getters.getUser.id
      ){
        return false;
      }
      return true;
    },
    geneGroupUser : function (){
      // var list = new Array();
      // for (var i = 0;i < this.users.length;i++){
      //   var u = this.users[i];
      //   if (u.roleid == this.jyzxGroup.id){
      //     list.push(u);
      //   }
      // }
      // return list;
      return this.users;
    }
  }
}
</script>

<style scoped>

</style>