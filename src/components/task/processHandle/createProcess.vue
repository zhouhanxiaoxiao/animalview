<template>
  <div>
    <top-nav></top-nav>
    <div class="process-container">
      <a-divider orientation="left">{{$t("processMsg")}}</a-divider>
      <div class="form-row">
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="projectName">{{ $t("projectName") }}</label>
          <a-input id="projectName" v-model="projectName"/>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="dataType">{{ $t("dataType") }}</label>
          <a-input id="dataType" v-model="dataType"/>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="principal">{{ $t("principal") }}</label>
          <div id="principal">
            <a-select  style="width: 100%" v-model="principal">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="email">{{ $t("userEmail") }}</label>
          <a-tooltip placement="topRight" title="数据下载及报告分析完成后将发送相关信息至以上邮箱列表" :mouseLeaveDelay="1"
                     :auto-adjust-overflow="true">
          <a-select id="email" mode="tags" style="width: 100%" v-model="emails">
            <a-select-option v-for="user in users" :key="user.email">
              {{ user.email }}
            </a-select-option>
          </a-select>
          </a-tooltip>
        </div>
        <!--样本类型-->
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="sampleMsg">{{$t("sampleMsg")  }}</label>
          <div id="sampleMsg">
            <a-select style="width: 100%" v-model="sampleMsg">
              <a-select-option value="01">{{$t("nucleicAcid") + $t("sample")}}</a-select-option>
              <a-select-option value="02">{{$t("tissue") + $t("sample")}}</a-select-option>
              <a-select-option value="03">{{$t("cell") + $t("sample")}}</a-select-option>
            </a-select>
          </div>
        </div>
        <a-divider orientation="left">{{$t("staffing")}}</a-divider>
        <!--样品制备负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="samplePreparation">{{$t("samplePreparation") + $t("principal") }}</label>
          <div id="samplePreparation">
            <a-select  style="width: 100%" v-model="samplePreparation">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--文库制备负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="libraryPreparation">{{$t("libraryPreparation") + $t("principal") }}</label>
          <div id="libraryPreparation">
            <a-select style="width: 100%" v-model="libraryPreparation">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--下机数据负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="dismountData">{{$t("dismountData") + $t("principal") }}</label>
          <div id="dismountData">
            <a-select style="width: 100%" v-model="dismountData">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--生信分析负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="bioinformaticsAnalysis">{{$t("bioinformaticsAnalysis") + $t("principal") }}</label>
          <div id="bioinformaticsAnalysis">
            <a-select style="width: 100%" v-model="bioinformaticsAnalysis">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!--  备注  -->
        <div class="form-group-sm col-md-12">
          <label for="remarks">{{$t("remarks")}}</label>
          <textarea class="form-control" id="remarks" v-model="remarks" placeholder="例：我很着急" rows="3"></textarea>
        </div>
      </div>
      <div class="modal-footer" style="margin-top: 20px">
        <button type="button" class="btn btn-primary"
                @click="submitData">{{$t("submit")}}</button>
      </div>
    </div>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import Submitting from "@/components/publib/submitting";
export default {
  name: "createProcess",
  components: {Submitting, TopNav},
  data:function (){
    return{
      projectName :"",
      dataType:"",
      principal:"",
      emails : [],
      users : [],
      remarks:"",
      sampleMsg : "",
      samplePreparation:"",
      libraryPreparation:"",
      dismountData : "",
      bioinformaticsAnalysis :""
    }
  },
  beforeMount : function() {
    this.initPage();
  },
  methods:{
    initPage : function (){
      var _this = this;
      this.$axios.post("/user/getAllUsers").then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.users = res.data.retMap.users;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    submitData : function (){
      if (!this.checkData()){
        return ;
      }
      var postData = {
        projectName : this.projectName,
        dataType : this.dataType,
        principal : this.principal,
        emails : this.emails,
        sampleMsg : this.sampleMsg,
        samplePreparation :this.samplePreparation,
        libraryPreparation : this.libraryPreparation,
        dismountData : this.dismountData,
        bioinformaticsAnalysis : this.bioinformaticsAnalysis,
        remarks : this.remarks
      }
      var _this = this;
      _this.$("#submitting").modal("show");
      this.$axios.post("/task/addProcess",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("save_success"));
          _this.$router.push("/task");
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    isEmail : function (inputValue,option){
      console.log(inputValue,option);
      var ePattern = /^([A-Za-z0-9_\-\\.])+\\@([A-Za-z0-9_\-\\.])+\.([A-Za-z]{2,4})$/;
      console.log(ePattern.test(inputValue));
      if(!ePattern.test(inputValue)){
        option = null;
      }
      return ePattern.test(inputValue);
    },
    checkData : function (){
      if (this.projectName == ""){
        this.$message.error(this.$t("projectName") + this.$t("not_null"));
        return false;
      }
      if (this.dataType == ""){
        this.$message.error(this.$t("dataType") + this.$t("not_null"));
        return false;
      }
      if (this.principal == ""){
        this.$message.error(this.$t("principal") + this.$t("not_null"));
        return false;
      }if (this.emails.length == 0){
        this.$message.error(this.$t("userEmail") + this.$t("not_null"));
        return false;
      }
      if (this.sampleMsg == ""){
        this.$message.error(this.$t("sampleMsg") + this.$t("not_null"));
        return false;
      }
      if (this.samplePreparation == ""){
        this.$message.error(this.$t("samplePreparation") + this.$t("not_null"));
        return false;
      }
      if (this.libraryPreparation == ""){
        this.$message.error(this.$t("libraryPreparation") + this.$t("not_null"));
        return false;
      }
      if (this.dismountData == ""){
        this.$message.error(this.$t("dismountData") + this.$t("not_null"));
        return false;
      }
      if (this.bioinformaticsAnalysis == ""){
        this.$message.error(this.$t("bioinformaticsAnalysis") + this.$t("not_null"));
        return false;
      }
      return true;
    }
  },
  watch:{
    emails(newVal){
      if (newVal.length>0){
        var ePattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        for (var i=newVal.length-1;i>=0;i--){
          if (!ePattern.test(newVal[i])){
            this.$delete(newVal,i);
          }
        }
      }
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
    padding: 20px 20px;
    text-align: left;
  }
</style>