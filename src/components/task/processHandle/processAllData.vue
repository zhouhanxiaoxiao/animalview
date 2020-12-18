<template>
  <div>
    <a-card class="item-card" size="small" :title="$t('sampleInput')">
      <a-table
          bordered :scroll="input.scroll"
          :columns="input.columns"
          :pagination="false"
          :data-source="input.inputs" size="small" >
        <!--   自定义列名 开始  -->
        <template slot="initSampleTitle">
          {{this.$t("initSample")}}
        </template>
        <template slot="sampleNameTitle">
          {{this.$t("sampleName")}}
        </template>
        <template slot="sampleIndexTitle">
          {{this.$t("sampleIndex")}}
        </template>
        <template slot="speciesTitle">
          {{this.$t("species")}}
        </template>
        <template slot="tissueTitle">
          {{this.$t("tissue") + this.$t("animal_stock_resource")}}
        </template>
        <template slot="sampleMsgTitle">
          {{$t("sampleMsg")}}
        </template>
        <template slot="sampleStatuTitle">
          {{$t("sampleStatu")}}
        </template>
        <template slot="databaseTypeTitle">
          {{$t("databaseType")}}
        </template>
        <template slot="SequencingPlatformTitle">
          {{$t("SequencingPlatform")}}
        </template>
        <template slot="operationTitle">
          {{$t("operation")}}
        </template>
        <!--   自定义列名 结束  -->
        <template
            v-for="col in input.columnNames"
            :slot="col"
            slot-scope="text, record,index"
        >
          <div :key="col">
            {{ showText(col, text, record, index) }}
          </div>
        </template>
      </a-table>
    </a-card>

    <a-card class="item-card" size="small" :title="$t('sampleInput')">
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
    <a-card class="item-card" size="small" :title="$t('sampleInput')">
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
    <a-card class="item-card" size="small" :title="$t('sampleInput')">
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
    <a-card class="item-card" size="small" :title="$t('sampleInput')">
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
    <a-card class="item-card" size="small" :title="$t('sampleInput')">
      <p>card content</p>
      <p>card content</p>
      <p>card content</p>
    </a-card>
  </div>
</template>

<script>
import util from "@/components/publib/util";

export default {
  name: "processAllData",
  props : {
    process:Object,
  },
  data : function (){
    return {
      input :{
        inputs : [],
        scroll: {x: 1500,y:300},
        columns : [],
        columnNames : []
      }
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      this.initCols();
      this.getData("01");
    },
    getData : function (flag){
      var postData = {
        flag : flag,
        processId : this.process.id
      }
      var _this = this;
      this.$axios.post("/task/process/allData",postData).then(function (res){
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          if (flag == "01"){
            _this.input.inputs = res.data.retMap.inputs;
            _this.input.inputs.map(ip => ip.key=ip.id);
          }
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols : function (){
      var inputCols = util.initInputCols();
      this.input.columns = inputCols.clom;
      this.input.scroll.x = inputCols.scorllLength;
      this.input.columnNames = inputCols.columnNames;
    },
    showText : function (col,text, record, ind){
      if (col == "index") {
        return ind + 1;
      }
      if (col == "samplemsg") {
        var samptyp = this.sampletypes(record.initsample);
        for (var index in samptyp) {
          var item = samptyp[index];
          if (item.key == text) {
            return item.val;
          }
        }
      }

      if (col == "samplestatu") {
        var sampStu = this.sampleStatu(record.initsample);
        for (var statuIndex in sampStu) {
          var statu = sampStu[statuIndex];
          if (statu.key == text) {
            return statu.val;
          }
        }
      }

      if (col == "cellsort") {
        for (var cellSortIndex in this.cellSortMethods) {
          var cellSort = this.cellSortMethods[cellSortIndex];
          if (cellSort.key == text) {
            return cellSort.val;
          }
        }
      }

      if (col == "databasetype") {
        var dbtyp = this.databaseTypes(record.initsample);
        for (var databaseTypeIndex in dbtyp) {
          var databaseType = dbtyp[databaseTypeIndex];
          if (databaseType.key == text) {
            return databaseType.val;
          }
        }
      }

      if (col == "sequencingplatform") {
        for (var seqPlantsIndex in this.seqPlants) {
          var seqPlant = this.seqPlants[seqPlantsIndex];
          if (seqPlant.key == text) {
            return seqPlant.val;
          }
        }
      }

      if (col == "initsample") {
        var sampint = this.sampleInits;
        for (var initSampleIndex = 0; initSampleIndex< sampint.length; initSampleIndex++){
          var sampleInit = sampint[initSampleIndex];
          if (sampleInit.key == text) {
            return sampleInit.val;
          }
        }
      }
      return text;
    },
    sampletypes: function (sampleType) {
      return util.sampletypes(sampleType);
    },
    sampleStatu: function (sampleType) {

      return util.sampleStatu(sampleType);
    },
    databaseTypes: function (sampleType) {
      return util.databaseTypes(sampleType);
    },
  },
  watch : {
    process : {
      handler : function (){
        this.initPage();
      },
      deep : true
    }
  },
  computed :{
    seqPlants: function () {
      return util.seqPlants();
    },
    sampleInits: function () {
      return util.sampleInits();
    },
    cellSortMethods: function () {
      return util.cellSortMethods();
    },
  }
}
</script>

<style scoped>
.item-card{
  margin-top: 20px;
}
</style>