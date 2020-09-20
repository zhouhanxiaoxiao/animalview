<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container ">
      <div class="form-row">
        <a-divider orientation="left">
          {{$t("baseInfo")}}
        </a-divider>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="animalName">{{$t("animalName")}}</label>
          <a-input id="animalName" v-model="stock.animal.name" disabled>
            <icon-font slot="prefix" type="icon-guoying" />
          </a-input>
        </div>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="stockID">{{$t("animal_stock_stockID")}}</label>
          <a-input id="stockID" v-model="stock.animal.stockId" disabled>
            <icon-font slot="prefix" type="icon-bianhao" />
          </a-input>
        </div>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="genotype">{{$t("animal_stock_genotype")}}</label>
          <a-input id="genotype" v-model="stock.animal.genotype" disabled>
            <icon-font slot="prefix" type="icon-jiyingongcheng" />
          </a-input>
        </div>
        <div class="form-group col-md-6 col-sm-12 col-lg-4">
          <label for="resource">{{$t("animal_stock_resource")}}</label>
          <a-input id="resource" v-model="stock.animal.resource" disabled>
            <icon-font slot="prefix" type="icon-laiyuan" />
          </a-input>
        </div>
      </div>
      <a-divider orientation="left">{{ $t("personnal_btn_stock")}}
      </a-divider>
      <div class="form-row">
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="container">{{$t("animal_stock_container")}}</label>
          <a-input id="container" v-model="stock.contanertype">
            <icon-font slot="prefix" type="icon-rongqi" />
          </a-input>
        </div>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="number">{{$t("animal_stock_number")}}</label>
          <div id="number">
            <a-input-number min="0" style="width: 100%" v-model="stock.contanernmuber">
            </a-input-number>
          </div>
        </div>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="useType">{{$t("useType")}}</label>
          <div id="useType">
            <a-select v-model="stock.usagetype" style="width: 100%" @change="handleChange">
              <a-select-option value="keep">
                {{$t("keep")}}
              </a-select-option>
              <a-select-option value="stock">
                {{$t("personnal_btn_stock")}}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="environment">{{$t("animal_stock_environment")}}</label>
          <div id="environment">
            <a-select v-model="stock.environment" style="width: 100%" @change="handleChange">
              <a-select-option v-for="environ in stock.envs" :key="environ.id">
                {{environ.displayname}}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="location">{{$t("location")}}</label>
          <a-input id="location" v-model="stock.location">
            <icon-font slot="prefix" type="icon-weizhi" />
          </a-input>
        </div>
        <div class="form-group col-md-3 col-sm-12 col-lg-2">
          <label for="birthday">{{$t("birthday")}}</label>
          <div id="birthday">
            <date-picker value-type="format" format="YYYY-MM-DD"
                         v-model="birthday" required></date-picker>
          </div>
        </div>
      </div>
      <div class="modal-footer" style="margin-top: 10px" >
        <button type="button" class="btn btn-primary" @click="handleState">{{$t("confirm")}}</button>
        <button type="button" class="btn btn-danger" @click="deleteSotck">{{$t("delete")}}</button>
      </div>
    </div>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import util from "@/components/publib/util";
import {formatDate} from '@/components/publib/date'
import {Icon} from "ant-design-vue";
import Submitting from "@/components/publib/submitting";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
  name: "editStock",
  components: {Submitting, TopNav,IconFont},
  data : function (){
    return {
      stockId :"",
      stock : {},
      birthday : "",
    }
  },
  beforeMount() {
    this.stockId = this.$route.query.stockId;
    this.initPage();
  },
  methods : {
    deleteSotck : function (){
      var _this = this;
      this.$confirm({
        title: this.$t("areyousureDelete"),
        okText: this.$t("yes"),
        okType: 'danger',
        cancelText: this.$t("no"),
        onOk() {
          _this.deleteThisStock();
        },
      });
    },
    deleteThisStock : function (){
      var psotData = {
        stockId : this.stockId
      };
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/stock/edit/delete",psotData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$router.push("/stock/currentStrain");
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initPage : function (){
      if (util.isNull(this.stockId)){
        return ;
      }
      var postData = {
        stockId : this.stockId
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/stock/edit/init",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          _this.stock = res.data.retMap.stock;
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    handleState : function (){
      var postData = {
        stock : JSON.stringify(this.stock)
      };
      this.$("#submitting").modal("show");
      var _this = this;
      this.$axios.post("/stock/edit/updateStock",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          window.location.reload();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch : {
    getStockId(newVal){
      this.stockId = newVal;
      this.initPage();
    },
    birthday(newVal){
      this.stock.birthday = newVal;
    },
    stock : {
      handler(newVal){
        this.birthday = formatDate(new Date(newVal.birthday),"yyyy-MM-dd");
      },
      deep : true
    }
  },
  computed : {
    getStockId : function (){
      return this.$route.query.stockId;
    },
  }
}
</script>

<style scoped>

</style>