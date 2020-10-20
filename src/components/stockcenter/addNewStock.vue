<template>
  <div class="modal fade" id="addNewStock" tabindex="-1" role="dialog" aria-labelledby="addNewStockLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addNewStockLabel">{{$t("addNewStock")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group col-md-4 mb-3">
              <label for="selectStrain">{{ $t("strain") }}</label>
              <div id="selectStrain">
                <a-select v-model="stock.drosophilaId" style="width: 100%"
                          show-search :filter-option="filterOption">
                  <a-select-option v-for="animal in animals" :key="animal.id" :value="animal.id">
                    {{ animal.selfindex + "-" + animal.genotype}}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="container">{{$t("animal_stock_container")}}</label>
              <a-input id="container" v-model="stock.contanertype">
                <icon-font slot="prefix" type="icon-rongqi" />
              </a-input>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="number">{{$t("animal_stock_number")}}</label>
              <div id="number">
                <a-input-number min="0" style="width: 100%" v-model="stock.contanernmuber">
                </a-input-number>
              </div>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="useType">{{$t("useType")}}</label>
              <div id="useType">
                <a-select v-model="stock.usagetype" style="width: 100%">
                  <a-select-option value="keep">
                    {{$t("keep")}}
                  </a-select-option>
                  <a-select-option value="stock">
                    {{$t("personnal_btn_stock")}}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="environment">{{$t("animal_stock_environment")}}</label>
              <div id="environment">
                <a-select v-model="stock.environment" style="width: 100%">
                  <a-select-option v-for="environ in envs" :key="environ.id">
                    {{environ.displayname}}
                  </a-select-option>
                </a-select>
              </div>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="location">{{$t("location")}}</label>
              <a-input id="location" v-model="stock.location">
                <icon-font slot="prefix" type="icon-weizhi" />
              </a-input>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="birthday">{{$t("birthday")}}</label>
              <div id="birthday">
                <date-picker value-type="format" format="YYYY-MM-DD"
                             v-model="stock.birthday" ></date-picker>
              </div>
            </div>
            <div class="form-group col-md-4 mb-3">
              <label for="createContainerTime">{{$t("createContainerTime")}}</label>
              <div id="createContainerTime">
                <date-picker value-type="format" format="YYYY-MM-DD"
                             v-model="stock.createtime" ></date-picker>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
          <button type="button" class="btn btn-primary" @click="submitData">{{ $t("confirm") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
  name: "addNewStock",
  components : {IconFont},
  data : function (){
    return {
      stock : {
        drosophilaId : "",
        contanertype : "",
        contanernmuber : 0,
        usagetype : "keep",
        environment : "",
        location : "",
        birthday : new Date(),
        createtime : new Date(),
      },
      animals : [],
      envs :[]
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    submitData : function (){
      var _this = this;
      if (!this.checkData()){
        return ;
      }
      var postData = {
        stock : JSON.stringify(this.stock)
      }
      this.$("#addNewStock").modal("hide");
      this.$("#submitting").modal("show");
      this.$axios.post("/stock/addNewStock", postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.$emit("currentInit");
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    checkData : function (){
      if (util.isNull(this.stock.drosophilaId)){
        this.$message.error(this.$t("strain") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(this.stock.contanertype)){
        this.$message.error(this.$t("animal_stock_container") + this.$t("not_null"));
        return false;
      }
      // if (util.isNull(this.stock.contanernmuber)){
      //   this.$message.error(this.$t("animal_stock_number") + this.$t("not_null"));
      //   return false;
      // }
      if (util.isNull(this.stock.usagetype)){
        this.$message.error(this.$t("useType") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(this.stock.environment)){
        this.$message.error(this.$t("animal_stock_environment") + this.$t("not_null"));
        return false;
      }
      // if (util.isNull(this.stock.location)){
      //   this.$message.error(this.$t("location") + this.$t("not_null"));
      //   return false;
      // }
      if (util.isNull(this.stock.birthday)){
        this.$message.error(this.$t("birthday") + this.$t("not_null"));
        return false;
      }
      return true;
    },
    initPage : function (){
      var _this = this;
      this.$axios.post("/stock/initAddStockPage").then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.animals = res.data.retMap.animals;
          _this.envs = res.data.retMap.envs;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    filterOption(input, option) {
      return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  }
}
</script>

<style scoped>
  #addNewStock{
    text-align: left;
  }
</style>