<template>
  <div class="modal fade" id="addNewStrain" tabindex="-1" role="dialog" aria-labelledby="addNewStrainLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addNewStrainLabel">{{$t("add")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="text-align: left">
          <form class="was-validated">
            <a-divider>基本信息</a-divider>
          <br>
          <div class="form-row">
            <div class="col-md-3 mb-3">
              <label for="animalName">{{$t("animalName")}}</label>
              <input type="text" class="form-control" id="animalName" :class="animalNameValid" v-model="animalName" required
                placeholder="例：果蝇">
            </div>
            <div class="form-group col-md-3 mb-3">
              <label for="stockID">{{$t("animal_stock_stockID")}}</label>
              <input type="text" class="form-control" :class="stockIDValid" id="stockID" v-model="stockID" required
                placeholder="例：bc4f93">
            </div>
            <div class="form-group col-md-3 mb-3">
              <label for="genotype">{{$t("animal_stock_genotype")}}</label>
              <div class="input-group">
                <input type="text" class="form-control" :class="genotypeValid" id="genotype" v-model="genotype" required
                       aria-describedby="checkExist" placeholder="例：w1118">
                <div class="input-group-append">
                  <button class="btn btn-outline-primary" type="button" id="checkExist"
                          @click="checkExist" :disabled="canCheckRepe">{{$t("checkExist")}}</button>
                </div>
              </div>
            </div>
            <div class="form-group col-md-3 mb-3">
              <label for="resource">{{$t("animal_stock_resource")}}</label>
              <input type="text" class="form-control" :class="resourceValid" id="resource" v-model="resource" required
                placeholder="例：中科院上化学与细胞生物学研究所果蝇资源与技术平台">
            </div>
          </div>
            <a-divider>{{ $t("personnal_btn_stock")}}</a-divider>
          <div class="form-row">
            <div class="form-group col-md-3">
              <label for="container">{{$t("animal_stock_container")}}</label>
              <input type="text" class="form-control" :class="containerValid" id="container" v-model="container" required
              placeholder="例：小管">
            </div>
            <div class="form-group col-md-3">
              <label for="number">{{$t("animal_stock_number")}}</label>
              <input type="number" class="form-control" :class="numberValid" id="number" v-model="number" required>
            </div>
            <div class="form-group col-md-3">
              <label for="useType">{{$t("useType")}}</label>
              <input type="text" class="form-control" :class="useTypeValid" id="useType" v-model="useType" required
               placeholder="例：保种">
            </div>
            <div class="form-group col-md-3">
              <label for="birthday">{{$t("birthday")}}</label>
              <div id="birthday">
                <date-picker value-type="format" format="YYYY-MM-DD"
                             v-model="birthday" required></date-picker>
              </div>
            </div>
            <div class="form-group col-md-3">
              <label for="environment">{{$t("animal_stock_environment")}}</label>
              <select id="environment" class="form-control" :class="environmentValid" v-model="environmentId" required>
                <option selected value="">{{$t("choose")}}</option>
                <option :value="evn.id" v-for="evn in environment" v-bind:key="evn.id">{{evn.displayname}}</option>
              </select>
            </div>
            <div class="form-group col-md-3">
              <label for="location">{{$t("location")}}</label>
              <input type="text" class="form-control" id="location" v-model="location" required>
            </div>
          </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="reset">{{ $t("reset") }}</button>
          <button type="submit" class="btn btn-primary" @click="submitData">{{$t("submit")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "addNewStrain",
  data: function (){
    return {
      animalName : "",
      animalNameValid : "",
      stockID : "",
      stockIDValid : "",
      genotype : "",
      genotypeValid : "",
      resource : "",
      resourceValid : "",
      container : "",
      containerValid : "",
      number : 0,
      numberValid : "",
      useType : "",
      useTypeValid : "",
      birthday : "",
      environmentId: "",
      environmentValid : "",
      environment : [],
      location : "",
      checkExistFlag : true
    }
  },
  methods : {
    checkSumitData : function (){
      if (this.animalName == ""){
        this.$message.error(this.$t("animalName") + this.$t("not_null"));
        return false;
      }
      if (this.stockID == ""){
        this.$message.error(this.$t("animal_stock_stockID") + this.$t("not_null"));
        return false;
      }
      if (this.genotype == ""){
        this.$message.error(this.$t("animal_stock_genotype") + this.$t("not_null"));
        return false;
      }
      if (this.resource == ""){
        this.$message.error(this.$t("animal_stock_resource") + this.$t("not_null"));
        return false;
      }
      if (this.container == ""){
        this.$message.error(this.$t("animal_stock_container") + this.$t("not_null"));
        return false;
      }
      if (this.number < 0){
        this.$message.error(this.$t("animal_stock_number") + this.$t("not_null"));
        return false;
      }
      if (this.useType == ""){
        this.$message.error(this.$t("useType") + this.$t("not_null"));
        return false;
      }
      if (this.birthday == ""){
        this.$message.error(this.$t("birthday") + this.$t("not_null"));
        return false;
      }
      if (this.environmentId == ""){
        this.$message.error(this.$t("animal_stock_environment") + this.$t("not_null"));
        return false;
      }
      if (this.location == ""){
        this.$message.error(this.$t("location") + this.$t("not_null"));
        return false;
      }
      return true;
    },
    submitData : function () {
      if (!this.checkSumitData()){
        return;
      }
      var postData = {
        animalName : this.animalName,
        stockID : this.stockID,
        genotype : this.genotype,
        resource : this.resource,
        container : this.container,
        number : this.number,
        useType : this.useType,
        birthday : this.birthday,
        environmentId : this.environmentId,
        location : this.location
      }
      this.$("#addNewStrain").modal("hide");
      this.$emit("submitData",postData);
    },
    reset : function () {
      this.animalName = "";
      this.location = "";
      this.useType = "";
      this.birthday = "";
      this.errall = "";
      this.stockID = "";
      this.stockIDValid = "";
      this.genotype = "";
      this.genotypeValid = "";
      this.resource = "";
      this.resourceValid = "";
      this.container = "";
      this.containerValid = "";
      this.number = 0;
      this.numberValid = "";
      this.environmentId= "";
      this.environment = [];
      this.environmentValid = "";
      this.checkExistFlag = true;
      this.initEvn();
    },
    initEvn : function () {
      var _this = this;
      this.$axios({
        method : "post",
        url:"/personal/environment"
      }).then(function (res) {
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.environment = res.data.retMap.envs;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    checkExist : function () {
      var _this = this;
      var postData = {
        "gentype" : _this.genotype
      };
      this.$axios.post(
          "/personal/checkGenTypeExist",
          postData
      ).then(function (res) {
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          if (res.data.retMap.hasExist){
            _this.$message.success(_this.$t("animal_stock_genotype") + _this.$t("hasExist"));
          }else {
            _this.$message.success(_this.$t("animal_stock_genotype") + _this.$t("hasNotExist"));
          }
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    }
  },
  beforeMount : function(){
    this.initEvn();
  },
  computed: {
    submitOk: function () {
      return this.numberValid == "is-valid"
          && this.stockIDValid == "is-valid"
          && this.genotypeValid == "is-valid"
          && this.resourceValid == "is-valid"
          && this.containerValid == "is-valid"
          && this.environmentId != ""
    },
    canCheckRepe : function (){
      if (this.genotype == ""){
        return  true;
      }else {
        return false;
      }
    }
  },
  watch:{

  }
}
</script>

<style scoped>
  .modal{
    z-index: 999 !important;
  }
  .modal-backdrop {
    z-index: 998 !important;
  }
</style>