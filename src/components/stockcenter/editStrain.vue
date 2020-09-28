<template>
  <div class="modal fade" id="editStrainModal" tabindex="-1" role="dialog" aria-labelledby="editStrainLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editStrainLabel">{{ $t("edit") }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group col-md-6 col-sm-12 col-lg-4">
              <label for="selfindex">{{$t("animal_stock_stockID")}}</label>
              <a-input id="selfindex" v-model="strain.selfindex" disabled>
                <icon-font slot="prefix" type="icon-bianhao" />
              </a-input>
            </div>
            <div class="form-group col-md-6 col-sm-12 col-lg-4">
              <label for="animalName">{{$t("animalName")}}</label>
              <a-input id="animalName" v-model="strain.name">
                <icon-font slot="prefix" type="icon-guoying" />
              </a-input>
            </div>
            <div class="form-group col-md-6 col-sm-12 col-lg-4">
              <label for="stockID">{{ "stock id" }}</label>
              <a-input id="stockID" v-model="strain.stockId">
                <icon-font slot="prefix" type="icon-bianhao" />
              </a-input>
            </div>
            <div class="form-group col-md-6 col-sm-12 col-lg-4">
              <label for="genotype">{{$t("animal_stock_genotype")}}</label>
              <a-input id="genotype" v-model="strain.genotype">
                <icon-font slot="prefix" type="icon-jiyingongcheng" />
              </a-input>
            </div>
            <div class="form-group col-md-6 col-sm-12 col-lg-4">
              <label for="resource">{{$t("animal_stock_resource")}}</label>
              <a-input id="resource" v-model="strain.resource">
                <icon-font slot="prefix" type="icon-laiyuan" />
              </a-input>
            </div>
          </div>
        </div>
        <div class="modal-footer">
<!--          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>-->
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
  name: "editStrain",
  components: {IconFont},
  props:{
    strainId : String
  },
  data : function (){
    return {
      strain : {}
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    submitData : function (){
      this.$emit("updateStrain",JSON.stringify(this.strain));
    },
    initPage : function (){
      var postData = {
        strainId : this.strainId
      };
      var _this = this;
      this.$axios.post("/editStrain/init",postData).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.strain = res.data.retMap.strain;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch : {
    strainId(){
      this.initPage();
    }
  }
}
</script>

<style scoped>
.modal-body{
  text-align: left;
}
</style>