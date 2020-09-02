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
            <a-divider orientation="left">
              {{$t("baseInfo")}}
            </a-divider>
          <br>
          <div class="form-row">
            <div class="col-md-3 mb-3">
              <label for="animalName">{{$t("animalName")}}</label>
              <input type="text" class="form-control" id="animalName" v-model="animalName" required
                placeholder="例：果蝇">
            </div>
            <div class="form-group col-md-3 mb-3">
              <label for="stockID">{{$t("animal_stock_stockID")}}</label>
              <input type="text" class="form-control" id="stockID" v-model="stockID" required
                placeholder="例：bc4f93">
            </div>
            <div class="form-group col-md-3 mb-3">
              <label for="genotype">{{$t("animal_stock_genotype")}}</label>
              <div class="input-group">
                <input type="text" class="form-control" id="genotype" v-model="genotype" required
                       aria-describedby="checkExist" placeholder="例：w1118">
                <div class="input-group-append">
                  <button class="btn btn-outline-primary" type="button" id="checkExist"
                          @click="checkExist" :disabled="canCheckRepe">{{$t("checkExist")}}</button>
                </div>
              </div>
            </div>
            <div class="form-group col-md-3 mb-3">
              <label for="resource">{{$t("animal_stock_resource")}}</label>
              <input type="text" class="form-control"  id="resource" v-model="resource" required
                placeholder="例：中科院上化学与细胞生物学研究所果蝇资源与技术平台">
            </div>
          </div >
            <div class="stock-statu" v-for="(row, index) in rows" :key="index">
              <a-divider orientation="left">{{ $t("personnal_btn_stock")}}
                <a-icon type="plus-square" theme="twoTone" style="font-size: 24px" @click="addNewRow"
                  v-if="rows.length < 2"/>
                <a-icon type="close-square" theme="twoTone" style="font-size: 24px" @click="delRow(index)"
                  v-if="rows.length > 1"/>
              </a-divider>
              <div class="form-row">
                <div class="form-group col-md-3">
                  <label for="container">{{$t("animal_stock_container")}}</label>
                  <input type="text" class="form-control" id="container" v-model="row.container" required
                         placeholder="例：小管">
                </div>
                <div class="form-group col-md-3">
                  <label for="number">{{$t("animal_stock_number")}}</label>
                  <input type="number" min="0" class="form-control" id="number" v-model="row.number" required>
                </div>
                <div class="form-group col-md-3">
                  <label for="useType">{{$t("useType")}}</label>
                  <select class="form-control" id="useType" v-model="row.useType" required>
                    <option value="keep">{{$t("keep")}}</option>
                    <option value="stock">{{$t("personnal_btn_stock")}}</option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label for="birthday">{{$t("birthday")}}</label>
                  <div id="birthday">
                    <date-picker value-type="format" format="YYYY-MM-DD"
                                 v-model="row.birthday" required></date-picker>
                  </div>
                </div>
                <div class="form-group col-md-3">
                  <label for="environment">{{$t("animal_stock_environment")}}</label>
                  <select id="environment" class="form-control" v-model="row.environmentId" required>
                    <option selected value="">{{$t("choose")}}</option>
                    <option :value="evn.id" v-for="evn in environment" v-bind:key="evn.id">{{evn.displayname}}</option>
                  </select>
                </div>
                <div class="form-group col-md-3">
                  <label for="location">{{$t("location")}}</label>
                  <input type="text" class="form-control" id="location" v-model="row.location" required>
                </div>
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
      stockID : "",
      genotype : "",
      resource : "",
      environment : [],
      checkExistFlag : true,
      rows :[
        {
          container : "",
          number : 0,
          useType : "keep",
          birthday : "",
          environmentId: "",
          location : "",
        }
      ]
    }
  },
  methods : {
    delRow : function (index){
      this.$delete(this.rows,index);
    },
    addNewRow : function (){
      var row = {
        container : "",
        number : 0,
        useType : "keep",
        birthday : "",
        environmentId: "",
        location : "",
      };
      this.rows.push(row);
    },
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
      for (var i in this.rows){
        var row = this.rows[i];
        if (row.container == ""){
          this.$message.error(this.$t("animal_stock_container") + this.$t("not_null"));
          return false;
        }
        if (row.number < 0){
          this.$message.error(this.$t("animal_stock_number") + this.$t("not_null"));
          return false;
        }
        if (row.useType == ""){
          this.$message.error(this.$t("useType") + this.$t("not_null"));
          return false;
        }
        if (row.birthday == ""){
          this.$message.error(this.$t("birthday") + this.$t("not_null"));
          return false;
        }
        if (row.environmentId == ""){
          this.$message.error(this.$t("animal_stock_environment") + this.$t("not_null"));
          return false;
        }
        if (row.location == ""){
          this.$message.error(this.$t("location") + this.$t("not_null"));
          return false;
        }
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
        rows : this.rows
      }
      this.$("#addNewStrain").modal("hide");
      this.$emit("submitData",postData);
    },
    reset : function () {
      this.animalName = "";
      this.stockID = "";
      this.genotype = "";
      this.resource = "";
      this.environment = [];
      this.checkExistFlag = true;
      this.rows = [
        {
          container : "",
          number : 0,
          useType : "keep",
          birthday : "",
          environmentId: "",
          location : "",
        }
      ];
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
      return true;
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