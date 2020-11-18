<template>
  <div>
    <top-nav></top-nav>
    <div class="process-container">
      <a-divider orientation="left">
        <a-tooltip>
          <template slot="title">
            {{$t("process.projectInfoTip")}}
          </template>
          {{$t("processMsg")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </a-divider>
      <div class="form-row">
        <div class="form-group col-md-6 col-sm-12 col-lg-4">
          <label for="projectName">
            {{ $t("projectName") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <a-input :addon-before="projectPre" id="projectName"
                   placeholder="例：2019.10开始，长期项目，近缘物种，性别，左右对称"
                   v-model="projectName"/>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-2" style="display: none">
          <label for="dataType">
            {{ $t("dataType") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
<!--          <a-input id="dataType" v-model="dataType"/>-->
          <div id="dataType">
            <a-select style="width: 100%" v-model="dataType">
              <a-select-option v-for="dt in dataTypes" :key="dt" :value="dt">
                {{ dt }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-2" v-if="this.dataType == '其他'">
          <label for="otherdataType">
            {{ $t("other") + $t("dataType") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <a-input id="otherdataType" v-model="otherDataType"/>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-2">
          <label for="principal">
            {{ $t("principal") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <div id="principal">
            <a-select  style="width: 100%" v-model="principal" :disabled="true">
              <a-select-option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-group col-md-4 col-sm-12 col-lg-3">
          <label for="email">
            {{ $t("userEmail") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <a-tooltip placement="topRight" :title="$t('process.emailsTip')" :mouseLeaveDelay="1"
                     :auto-adjust-overflow="true">
          <a-select id="email" mode="tags" style="width: 100%" v-model="emails">
            <a-select-option v-for="user in users" :key="user.email">
              {{ user.email }}
            </a-select-option>
          </a-select>
          </a-tooltip>
        </div>
        <!--样本类型-->
        <div class="form-group col-md-4 col-sm-12 col-lg-2" style="display: none">
          <label for="sampleMsg">
            {{$t("sampleMsg")  }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <div id="sampleMsg">
            <a-select style="width: 100%" v-model="sampleMsg" mode="multiple">
              <a-select-option value="01">{{$t("nucleicAcid") + $t("sample")}}</a-select-option>
              <a-select-option value="02">{{$t("tissue") + $t("sample")}}</a-select-option>
              <a-select-option value="03">{{$t("cell") + $t("sample")}}</a-select-option>
            </a-select>
          </div>
        </div>
        <!--  项目描述  -->
        <div class="form-group-sm col-md-12">
          <label for="projectDesc">{{$t("projectDesc")}}</label>
          <textarea class="form-control" id="projectDesc" v-model="projectDesc" maxlength="1000"
                    placeholder="例：果蝇近缘物种雌雄脑睾丸子宫转录组" rows="3"></textarea>
        </div>
        <a-divider orientation="left">
          <a-tooltip>
            <template slot="title">
              {{$t("process.preSelectTip")}}
            </template>
            {{$t("staffing")}}
            <a-icon type="question-circle" theme="twoTone"/>
          </a-tooltip>
        </a-divider>
        <!--样品录入负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-2">
          <label for="sampleInput">
            {{$t("sampleInput") + $t("principal") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <div id="sampleInput">
            <a-select  style="width: 100%" v-model="sampleInput">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--样品制备负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-2">
          <label for="samplePreparation">
            {{$t("samplePreparation") + $t("principal") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <div id="samplePreparation">
            <a-select  style="width: 100%" v-model="samplePreparation">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--文库制备负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-2">
          <label for="libraryPreparation">
            {{$t("libraryPreparation") + $t("principal") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <div id="libraryPreparation">
            <a-select style="width: 100%" v-model="libraryPreparation">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--下机数据负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-2">
          <label for="dismountData">
            {{$t("dismountData") + $t("principal") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
          <div id="dismountData">
            <a-select style="width: 100%" v-model="dismountData">
              <a-select-option v-for="user in users" :key="user.id">
                {{ user.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--生信分析负责人-->
        <div class="form-group col-md-4 col-sm-12 col-lg-2">
          <label for="bioinformaticsAnalysis">
            {{$t("bioinformaticsAnalysis") + $t("principal") }}
            <icon-font style="font-size: 20px" type="icon-bitian" />
          </label>
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
          <textarea class="form-control" id="remarks" v-model="remarks" placeholder="例：注意事项..." rows="3" maxlength="1000"></textarea>
        </div>
      </div>
      <div class="modal-footer" style="margin-top: 20px">
        <button type="button" class="btn btn-primary"
                @click="submitData">{{$t("submit")}}</button>
      </div>
    </div>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
    <process-tip-alert ref="processTip"></process-tip-alert>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import Submitting from "@/components/publib/submitting";
import {formatDate} from "@/components/publib/date";
import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";
import ProcessTipAlert from "@/components/task/processHandle/processTipAlert";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});

export default {
  name: "createProcess",
  components: {ProcessTipAlert, Submitting, TopNav,IconFont},
  data:function (){
    return{
      projectName :"",
      otherDataType : "",
      dataType:"",
      principal:this.$store.getters.getUser.id,
      emails : [],
      users : [],
      remarks:"",
      sampleMsg : [],
      samplePreparation:"",
      libraryPreparation : "",
      sampleInput : this.$store.getters.getUser.id,
      dismountData : "",
      bioinformaticsAnalysis :"",
      projectDesc : "",
      dataTypes : ["10x单细胞转录组","普通转录组","全基因组","全外显子组","HiC基因组","其他"]
    }
  },
  mounted : function() {
    this.initPage();
  },
  methods:{
    initPage : function (){
      var _this = this;
      _this.$(this.$refs.processTip.$el).modal("show");
      this.$axios.post("/user/getAllUsers").then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.users = res.data.retMap.users;
          _this.samplePreparation = util.getuserIdByRole(_this.users,"31");
          _this.libraryPreparation = util.getuserIdByRole(_this.users,"32");
          _this.dismountData = util.getuserIdByRole(_this.users,"33");
          _this.bioinformaticsAnalysis = util.getuserIdByRole(_this.users,"34");
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
        projectName : this.projectPre + this.projectName,
        dataType : this.dataType,
        principal : this.principal,
        emails : this.emails,
        sampleMsg : this.sampleMsg.join("##"),
        samplePreparation :this.samplePreparation,
        libraryPreparation : this.libraryPreparation,
        dismountData : this.dismountData,
        bioinformaticsAnalysis : this.bioinformaticsAnalysis,
        sampleInput : this.sampleInput,
        remarks : this.remarks,
        projectDesc : this.projectDesc
      };
      if (postData.dataType == "其他"){
        postData.dataType = this.otherDataType;
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
      // if (this.dataType == ""){
      //   this.$message.error(this.$t("dataType") + this.$t("not_null"));
      //   return false;
      // }
      // if (this.dataType == "其他" && this.otherDataType == ""){
      //   this.$message.error(this.$t("other") + this.$t("dataType") + this.$t("not_null"));
      //   return false;
      // }
      if (this.principal == ""){
        this.$message.error(this.$t("principal") + this.$t("not_null"));
        return false;
      }if (this.emails.length == 0){
        this.$message.error(this.$t("userEmail") + this.$t("not_null"));
        return false;
      }
      // if (this.sampleMsg.length == 0){
      //   this.$message.error(this.$t("sampleMsg") + this.$t("not_null"));
      //   return false;
      // }
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
  },
  computed : {
    projectPre : function (){
      return this.$store.getters.getUser.group.groupname + "-"
          + this.$store.getters.getUser.name + "-"
          + formatDate(new Date(),"yyyyMM") + "-";
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