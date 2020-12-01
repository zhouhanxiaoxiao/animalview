<template>
  <div class="form-row">
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-4 itemDiv">
      <!--   样本录入   -->
      <a-card  :title="$t('sampleInput')" style="width: 100%">
        <a-select slot="extra" default-value="02"
                  v-model="loading['01'].statu"
                  style="width: 120px" @change="changeInputs">
          <a-select-option value="03">
            {{ $t("allAllow") }}
          </a-select-option>
          <a-select-option value="02">
            {{ $t("notAllow") }}
          </a-select-option>
          <a-select-option value="00">
            {{ $t("init") }}
          </a-select-option>
        </a-select>
        <a-list
            size="small"
            class="listClass"
            :loading="loading['01'].load"
            item-layout="horizontal"
            :data-source="inputs"
        >
          <a-list-item slot="renderItem" slot-scope="item">
<!--            <template v-if="loading['01'].statu == '02'">-->
<!--              <a slot="actions">{{ $t("pass") }}</a>-->
<!--              <a slot="actions">{{ $t("unPass") }}</a>-->
<!--            </template>-->
            <template v-if="loading['01'].statu == '02' && item.currentstatu == '08'">
              <a slot="actions" @click="() => showReason(item.id)">{{ $t("showReason") }}</a>
            </template>
            <template v-if="loading['01'].statu == '03'">
              <a slot="actions" @click="nextStep(item,'01')" :disabled="!isCreater">{{ $t("samplePreparation") }}</a>
            </template>
            <a slot="actions" @click="showDetail('1','p1',loading['01'].statu)">{{ $t("detail") }}</a>
            <div>{{ item.samplename + "-" + item.sampleindex }}</div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-4 itemDiv">
      <!--   样本制备   -->
      <a-card  :title="$t('samplePreparation')" style="width: 100%">
        <a-select slot="extra"
                  v-model="loading['02'].statu"
                  default-value="02" style="width: 120px" @change="changeMakes">
          <a-select-option value="03">
            {{ $t("allAllow") }}
          </a-select-option>
          <a-select-option value="02">
            {{ $t("notAllow") }}
          </a-select-option>
          <a-select-option value="00">
            {{ $t("init") }}
          </a-select-option>
        </a-select>
        <a-list
            size="small"
            class="listClass"
            :loading="loading['02'].load"
            item-layout="horizontal"
            :data-source="makes"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="loading['02'].statu == '02'">
              <template v-if="item.currentstatu == '02'">
                <a slot="actions" @click="passItem(item,'02')" :disabled="!isCreater">{{ $t("pass") }}</a>
                <a slot="actions" @click="unPassItem(item,'02')" :disabled="!isCreater">{{ $t("unPass") }}</a>
              </template>
              <template v-else>
                <a slot="actions" @click="() => showReason(item.id)">{{ $t("showReason") }}</a>
              </template>
            </template>
            <template v-if="loading['02'].statu == '03'">
              <a slot="actions" @click="nextStep(item,'02')" :disabled="!isCreater">{{ $t("libraryPreparation") }}</a>
            </template>
            <a slot="actions" @click="showDetail('2','p2',loading['02'].statu)">{{ $t("detail") }}</a>
            <div>{{ item.samplename + "-" + item.selfnumber }}</div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-4 itemDiv">
      <!--   文库制备   -->
      <a-card  :title="$t('libraryPreparation')" style="width: 100%">
        <a-select slot="extra"
                  v-model="loading['03'].statu"
                  default-value="02" style="width: 120px" @change="changeLibs">
          <a-select-option value="03">
            {{ $t("allAllow") }}
          </a-select-option>
          <a-select-option value="02">
            {{ $t("notAllow") }}
          </a-select-option>
          <a-select-option value="00">
            {{ $t("init") }}
          </a-select-option>
        </a-select>
        <a-list
            size="small"
            class="listClass"
            :loading="loading['03'].load"
            item-layout="horizontal"
            :data-source="libs"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="loading['03'].statu == '02' && item.currentstatu != '02'">
              <a slot="actions" @click="() => showReason(item.id)">{{ $t("showReason") }}</a>
            </template>
            <template v-if="loading['03'].statu == '03'">
              <a slot="actions" @click="nextStep(item,'03')" :disabled="!isCreater">{{ $t("uploadConfirm") }}</a>
            </template>
            <a slot="actions" @click="showDetail('3','p3',loading['03'].statu)">{{ $t("detail") }}</a>
            <div>{{ item.samplename + "-" + item.selfnumber }}</div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-4 itemDiv">
      <!--   上机确认   -->
      <a-card  :title="$t('uploadConfirm')" style="width: 100%">
        <a-select slot="extra"
                  v-model="loading['04'].statu"
                  default-value="02" style="width: 120px" @change="changeConfirms">
          <a-select-option value="03">
            {{ $t("allAllow") }}
          </a-select-option>
          <a-select-option value="02">
            {{ $t("notAllow") }}
          </a-select-option>
          <a-select-option value="00">
            {{ $t("init") }}
          </a-select-option>
        </a-select>
        <a-list
            size="small"
            class="listClass"
            :loading="loading['04'].load"
            item-layout="horizontal"
            :data-source="confirms"
        >
          <a-list-item slot="renderItem" slot-scope="item">
<!--            <template v-if="loading['04'].statu == '02'">-->
<!--              <a slot="actions">{{ $t("pass") }}</a>-->
<!--              <a slot="actions">{{ $t("unPass") }}</a>-->
<!--            </template>-->
            <template v-if="loading['04'].statu == '02' && item.currentstatu != '02'">
              <a slot="actions" @click="() => showReason(item.id)">{{ $t("showReason") }}</a>
            </template>
            <template v-if="loading['04'].statu == '03'">
              <a slot="actions" @click="nextStep(item,'04')" :disabled="!isCreater">{{ $t("dismountData") }}</a>
            </template>
            <a slot="actions" @click="showDetail('4','p4',loading['04'].statu)">{{ $t("detail") }}</a>
            <div>{{ item.samplename + "-" + item.sampleindex }}</div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-4 itemDiv">
      <!--   数据交付   -->
      <a-card  :title="$t('dismountData')" style="width: 100%">
        <a-select slot="extra"
                  v-model="loading['05'].statu"
                  default-value="02" style="width: 120px" @change="changeDisList">
          <a-select-option value="03">
            {{ $t("allAllow") }}
          </a-select-option>
          <a-select-option value="02">
            {{ $t("notAllow") }}
          </a-select-option>
          <a-select-option value="00">
            {{ $t("init") }}
          </a-select-option>
        </a-select>
        <a-list
            size="small"
            class="listClass"
            :loading="loading['05'].load"
            item-layout="horizontal"
            :data-source="disList"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="loading['05'].statu == '02'">
              <template v-if="item.currentstatu == '02'">
                <a slot="actions" @click="passItem(item,'05')" :disabled="!isCreater">{{ $t("pass") }}</a>
                <a slot="actions" @click="unPassItem(item,'05')" :disabled="!isCreater">{{ $t("unPass") }}</a>
              </template>
              <template v-else>
                <a slot="actions" @click="() => showReason(item.id)">{{ $t("showReason") }}</a>
              </template>
            </template>
            <template v-if="loading['05'].statu == '03'">
              <a slot="actions" @click="nextStep(item,'05')" :disabled="!isCreater">{{ $t("bioinformaticsAnalysis") }}</a>
            </template>
            <a slot="actions" @click="showDetail('5','p5',loading['05'].statu)">{{ $t("detail") }}</a>
            <div>{{ item.samplename + "-" + item.sampleindex }}</div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
    <div class="col-sm-12 col-md-12 col-lg-6 col-xl-4 itemDiv">
      <!--   生信分析   -->
      <a-card  :title="$t('bioinformaticsAnalysis')" style="width: 100%">
        <a-select slot="extra"
                  v-model="loading['06'].statu"
                  default-value="02" style="width: 120px" @change="changeAnalysises">
          <a-select-option value="03">
            {{ $t("allAllow") }}
          </a-select-option>
          <a-select-option value="02">
            {{ $t("notAllow") }}
          </a-select-option>
          <a-select-option value="00">
            {{ $t("init") }}
          </a-select-option>
        </a-select>
        <a-list
            size="small"
            class="listClass"
            :loading="loading['06'].load"
            item-layout="horizontal"
            :data-source="analyses"
        >
          <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="loading['06'].statu == '02'">
              <template v-if="item.currentstatu == '02'">
                <a slot="actions" @click="passItem(item,'06')" :disabled="!isCreater">{{ $t("pass") }}</a>
                <a slot="actions" @click="unPassItem(item,'06')" :disabled="!isCreater">{{ $t("unPass")}}</a>
              </template>
              <template v-else>
                <a slot="actions" @click="() => showReason(item.id)">{{ $t("showReason") }}</a>
              </template>
            </template>
<!--            <template v-if="loading['06'].statu == '03'">-->
<!--              <a slot="actions">{{ $t("bioinformaticsAnalysis") }}</a>-->
<!--            </template>-->
            <a slot="actions" @click="showDetail('6','p6',loading['06'].statu)">{{ $t("detail") }}</a>
            <div>{{ item.samplename + "-" + item.sampleindex }}</div>
          </a-list-item>
        </a-list>
      </a-card>
    </div>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
    <refuse-alert ref="unPassAlert" :modal-title="$t('unPass')" @confirmFun="confirmFun"></refuse-alert>
  </div>
</template>

<script>
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";
import RefuseAlert from "@/components/publib/refuseAlert";

export default {
  name: "processAllConfirm",
  components: {RefuseAlert, Submitting},
  props:{
    process:Object,
    flag : String
  },
  data : function (){
    return {
      inputs :[],
      makes : [],
      libs : [],
      confirms : [],
      disList : [],
      analyses : [],
      loading :{
        "01" : {load : false,statu:"00"},
        "02" : {load : false,statu:"00"},
        "03" : {load : false,statu:"00"},
        "04" : {load : false,statu:"00"},
        "05" : {load : false,statu:"00"},
        "06" : {load : false,statu:"00"},
      },
      tempItem : {},
      tempFlag : ""
    }
  },
  mounted() {
    this.initPage("all","00");
  },
  methods :{
    nextStep : function (item,flag){
      var postData = {
        item : JSON.stringify(item),
        flag : flag
      }
      var _this = this;
      this.loading[flag].load = true;
      this.$axios.post("/task/process/nextStep",postData).then(function (res){
        _this.loading[flag].load = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage(flag,_this.loading[flag].statu);
          if (flag == "01"){
            _this.loading["02"].statu = "00";
            _this.initPage("02",_this.loading["02"].statu);
          }
          if (flag == "02"){
            _this.loading["03"].statu = "00";
            _this.initPage("03",_this.loading["03"].statu);
          }
          if (flag == "03"){
            _this.loading["04"].statu = "00";
            _this.initPage("04",_this.loading["04"].statu);
          }
          if (flag == "04"){
            _this.loading["05"].statu = "00";
            _this.initPage("05",_this.loading["05"].statu);
          }
          if (flag == "05"){
            _this.loading["06"].statu = "00";
            _this.initPage("06",_this.loading["06"].statu);
          }
        }
      }).catch(function (res){
        console.log(res);
        _this.loading[flag].load = false;
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showReason: function (id) {
      var _this = this;
      this.$axios.post("/task/process/showStopReason", {detailId: id}).then(function (res) {
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$error({
            title: _this.$t("reason"),
            content: res.data.retMap.reason
          });
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    confirmFun : function (reason,remark){
      this.$(this.$refs.unPassAlert.$el).modal("hide");
      var postData = {
        item : JSON.stringify(this.tempItem),
        flag : this.tempFlag,
        reason : reason,
        remark : remark
      }
      var _this = this;
      _this.$(_this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/unPassItem",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage(_this.tempFlag,_this.loading[_this.tempFlag].statu);
        }
      }).catch(function (res){
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    unPassItem : function (item,flag){
      this.tempFlag = flag;
      this.tempItem = item;
      this.$(this.$refs.unPassAlert.$el).modal("show");
    },
    passItem : function (item,flag){
      var postData = {
        item : JSON.stringify(item),
        flag : flag
      }
      var _this = this;
      _this.$(_this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/passItem",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage(flag,_this.loading[flag].statu);
        }
      }).catch(function (res){
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showDetail : function (tabVal,val,statu){
      this.$emit("changeTab",tabVal,val,statu);
    },
    changeAnalysises : function (val){
      this.initPage("06",val);
    },
    changeDisList : function (val){
      this.initPage("05",val);
    },
    changeConfirms : function (val){
      this.initPage("04",val);
    },
    changeLibs : function (val){
      this.initPage("03",val);
    },
    changeMakes : function (val){
      this.initPage("02",val);
    },
    changeInputs : function (val){
      this.initPage("01",val);
    },
    initPage : function(flag,stat){
      if (util.isNull(this.process) || util.isNull(this.process.id)){
        return ;
      }
      var postData = {
        processId : this.process.id,
        flag : flag,
        stat : stat
      }
      var _this = this;
      if (flag != "all"){
        this.loading[flag].load = true;
      }
      this.$axios.post("/task/process/initAllConfirm",postData).then(function (res){
        if (flag != "all"){
          _this.loading[flag].load = false;
        }
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          console.log(res);
          if (res.data.retMap.inputs != undefined){
            _this.inputs = res.data.retMap.inputs;
          }
          if (res.data.retMap.makes != undefined){
            _this.makes = res.data.retMap.makes;
          }
          if (res.data.retMap.libs != undefined){
            _this.libs = res.data.retMap.libs;
          }
          if (res.data.retMap.confirms != undefined){
            _this.confirms = res.data.retMap.confirms;
          }
          if (res.data.retMap.disList != undefined){
            _this.disList = res.data.retMap.disList;
          }
          if (res.data.retMap.analyses != undefined){
            _this.analyses = res.data.retMap.analyses;
          }
        }
      }).catch(function (res){
        if (flag != "all"){
          _this.loading[flag].load = false;
        }
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch: {
    process: {
      handler: function () {
        // console.log(newVal)
        this.initPage("all","00");
      },
      deep: true
    },
    flag(newVal){
      this.initPage(newVal,this.loading[newVal].statu);
    }
  },
  computed : {
    isCreater : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.creater)
      ) {
        return true
      }
      return false;
    },
  }
}
</script>

<style scoped>
.itemDiv{
  margin-bottom: 20px;
}
.listClass::-webkit-scrollbar { width: 0 !important }
.listClass {
  height: 165px;
  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;

  overflow-y: auto;
}
</style>