<template>
  <div class="form-row">
    <a-divider orientation="left">{{$t("index") + "：" + (index + 1)}}
    </a-divider>
    <!--  样本名称  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleName">{{ $t("sampleName") }}</label>
      <a-input id="sampleName" v-model="row.sampleName"/>
    </div>
    <!--  物种  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="species">{{ $t("species") }}</label>
      <a-input id="species" v-model="row.species"/>
    </div>
    <!--  组织来源  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="tissue">{{ $t("tissue") +  $t("animal_stock_resource")  }}</label>
      <a-input id="tissue" v-model="row.tissue"/>
    </div>
    <!--  样本类型  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleMsg">{{ $t("sampleMsg")}}</label>
      <a-input id="sampleMsg" disabled  :value="sampletype"/>
    </div>
    <!--  样本状态  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleStatu">{{ $t("sampleStatu")}}</label>
      <a-input id="sampleStatu" v-model="row.sampleStatu"/>
    </div>
    <!--  组织量（g）  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="tissueNumber">{{ $t("tissueNumber") + "（g）"}}</label>
      <a-input id="tissueNumber" v-model="row.tissueNumber"/>
    </div>
    <!--  血液体积(ml)  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="bloodVolume">{{ $t("bloodVolume") + "(ml)"}}</label>
      <a-input id="bloodVolume" v-model="row.bloodVolume"/>
    </div>
    <!--  浓度(ng/ul)/（细胞个数/μl)  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="concentration">{{ concentrationName }}</label>
      <a-input id="concentration" v-model="row.concentration"/>
    </div>
    <!--  样本体积(ul)  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleVolume">{{ $t("sampleVolume") + "(ul)"}}</label>
      <a-input id="sampleVolume" v-model="row.sampleVolume"/>
    </div>
    <!--  核酸/细胞总量（ug/细胞个数）  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="totalNumber">{{ totalNumberTitle}}</label>
      <a-input id="totalNumber" v-model="row.totalNumber"/>
    </div>
    <!--  细胞活性  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="cellLife">{{ $t("cellLife")}}</label>
      <a-input id="cellLife" v-model="row.cellLife"/>
    </div>
    <!--  细胞分选法  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="cellSort">{{ $t("cellSort")}}</label>
      <a-input id="cellSort" v-model="row.cellSort"/>
    </div>
    <!--  建库类型  -->
<!--    <div class="form-group col-md-3 col-sm-12 col-lg-2">-->
<!--      <label for="databaseType">{{ $t("databaseType")}}</label>-->
<!--      <a-input id="databaseType" v-model="row.cellSort"/>-->
<!--    </div>-->
    <!--  测序平台  -->
<!--    <div class="form-group col-md-3 col-sm-12 col-lg-2">-->
<!--      <label for="SequencingPlatform">{{ $t("SequencingPlatform")}}</label>-->
<!--      <a-input id="SequencingPlatform" v-model="row.SequencingPlatform"/>-->
<!--    </div>-->
    <!--  备注  -->
    <div class="form-group-sm col-md-12">
      <label for="remarks">{{$t("remarks")}}</label>
      <textarea class="form-control" id="remarks" v-model="row.remarks" placeholder="例：我很着急" rows="2"></textarea>
    </div>
    <!--  建库类型  -->
    <div class="form-group-sm col-md-12">
      <label for="files">{{ $t("upload")}}</label>
      <div id="files">
        <a-upload-dragger
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </a-upload-dragger>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "samplePreparationDetail",
  props : {
    process : Object,
    index : Number,
    uuid : String,
    item : Object,
    rowsLength : Number
  },
  data : function (){
    return {
      row : {
        sampleName : "",
        species : "",
        tissue : "",
        sampletype : this.process.sampletype,
        sampleMsg : "",
        sampleStatu : "",
        tissueNumber : "",
        bloodVolume : "",
        concentration : "",
        sampleVolume : "",
        totalNumber : "",
        cellLife:"",
        cellSort :"",
        databaseType : "",
        SequencingPlatform : "",
        remarks : "",
        files:[]
      }
    }
  },
  methods:{
    deleteRow : function (){
      this.$emit("deleteRow",this.uuid);
    },
    saveData : function (){
      this.$emit("saveData",this.row,this.uuid);
    }
  },
  watch : {
    row : {
      handler : function (){
        this.saveData();
      },
      deep : true
    },
    item : {
      handler : function (newVal){
        this.row = newVal;
      },
      deep : true
    }
  },
  computed : {
    sampletype : function (){
      if (this.process.sampletype == "01"){
        return "核酸";
      }else if (this.process.sampletype == "02"){
        return "组织";
      }else if (this.process.sampletype == "03"){
        return "细胞";
      }
      return""
    },
    concentrationName : function (){
      if (this.process.sampletype == "01"){
        return this.$t("concentration") + "(ng/ul)";
      }else{
        return this.$t("concentration") + "(" + this.$t("cellNumber") + "/μl)";
      }
    },
    totalNumberTitle : function (){
      if (this.process.sampletype == "01"){
        return this.$t("nucleicAcid") + this.$t("totalNumber") +"(ug)";
      }else{
        return this.$t("cell") + this.$t("totalNumber") +"(" + this.$t("cellNumber") + ")";
      }
    }
  }
}
</script>

<style scoped>

</style>