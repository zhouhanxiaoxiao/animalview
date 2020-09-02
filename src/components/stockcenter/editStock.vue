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
          <a-input id="animalName" ref="userNameInput" v-model="userName" placeholder="Basic usage">
            <icon-font slot="prefix" type="icon-guoying" />
          </a-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import util from "@/components/publib/util";
import {Icon} from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
  name: "editStock",
  components: {TopNav,IconFont},
  data : function (){
    return {
      stockId :"",
      stock : {}
    }
  },
  beforeMount() {
    this.stockId = this.$route.query.stockId;
    this.initPage();
  },
  methods : {
    initPage : function (){
      if (util.isNull(this.stockId)){
        return ;
      }
      var postData = {
        stockId : this.stockId
      }
      var _this = this;
      this.$axios.post("/stock/edit/init",postData).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          _this.stock = res.data.retMap.stock;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch : {
    getStockId(newVal){
      this.stockId = newVal;
      this.initPage();
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