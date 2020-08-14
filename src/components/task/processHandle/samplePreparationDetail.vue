<template>
  <div class="form-row">
    <a-divider orientation="left">{{$t("index") + "：" + (index + 1) }}
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
      <label for="tissue">{{ $t("tissue") +  $t("animal_stock_resource")}}</label>
      <a-input id="tissue" v-model="row.tissue"/>
    </div>
    <!--  样本类型  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleMsg">{{ $t("sampleMsg")}}</label>
      <div id="sampleMsg">
        <a-select  style="width: 100%" v-model="row.sampletype">
          <a-select-option v-for="item in sampletype" :key="item.key" :value="item.key">
            {{item.val}}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <!--  样本状态  -->
    <div class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleStatu">{{ $t("sampleStatu")}}</label>
      <div id="sampleStatu">
        <a-select  style="width: 100%" v-model="row.sampleStatu">
          <a-select-option v-for="item in sampleStatu" :key="item.key" :value="item.key">
            {{item.val}}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <!--  组织量（g）  -->
    <div v-if="process.sampleMsg == '02'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="tissueNumber">{{ $t("tissueNumber") + "（g）"}}</label>
      <a-input id="tissueNumber" v-model="row.tissueNumber"/>
    </div>
    <!--  血液体积(ml)  -->
    <div v-if="process.sampleMsg == '02'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="bloodVolume">{{ $t("bloodVolume") + "(ml)"}}</label>
      <a-input id="bloodVolume" v-model="row.bloodVolume"/>
    </div>
    <!--  浓度(ng/ul)/（细胞个数/μl)  -->
    <div v-if="process.sampleMsg != '02'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="concentration">{{ concentrationName }}</label>
      <a-input id="concentration" v-model="row.concentration"/>
    </div>
    <!--  样本体积(ul)  -->
    <div v-if="process.sampleMsg != '02'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="sampleVolume">{{ $t("sampleVolume") + "(ul)"}}</label>
      <a-input id="sampleVolume" v-model="row.sampleVolume"/>
    </div>
    <!--  核酸/细胞总量（ug/细胞个数）  -->
    <div v-if="process.sampleMsg != '02'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="totalNumber">{{ totalNumberTitle}}</label>
      <a-input id="totalNumber" v-model="row.totalNumber"/>
    </div>
    <!--  细胞活性  -->
    <div v-if="process.sampleMsg == '03'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="cellLife">{{ $t("cellLife")}}</label>
      <a-input id="cellLife" v-model="row.cellLife"/>
    </div>
    <!--  细胞分选法  -->
    <div v-if="process.sampleMsg == '03'" class="form-group col-md-3 col-sm-12 col-lg-2">
      <label for="cellSort">{{ $t("cellSort")}}</label>
      <div id="cellSort">
        <a-select  default-value="01" style="width: 100%" v-model="row.cellSort">
          <a-select-option value="01">过筛网</a-select-option>
          <a-select-option value="02">磁珠分选</a-select-option>
          <a-select-option value="03">口吸管法</a-select-option>
          <a-select-option value="04">BD流式分选</a-select-option>
          <a-select-option value="05">NanoCellect 流式分选</a-select-option>
        </a-select>
      </div>
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
    <div class="form-group-sm col-md-12">
      <label for="files">{{ $t("upload")}}</label>
      <div id="files">
        <a-upload-dragger
            name="file"
            :multiple="true"
            :headers="{token:this.$cookies.get('token')}"
            :action="this.$axios.defaults.baseURL + '/file/upload'"
            @change="handleChange"
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
        sampletype : "",
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
    },
    handleChange(info) {
      const status = info.file.status;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
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
    },

  },
  computed : {
    sampletype : function (){
      var array = new Array();
      if (this.process.sampletype == "01"){
        /** 核酸样本类型 */
        array.push({key:"01",val:"基因组DNA"});
        array.push({key:"02",val:"total RNA"});
        array.push({key:"03",val:"PCR产物"});
        array.push({key:"04",val:"chip-seq DNA"});
        array.push({key:"05",val:"单细胞扩增产物"});
        array.push({key:"06",val:"FFPE"});
        array.push({key:"00",val:"其它"});
      }else if (this.process.sampletype == "02"){
        /** 组织样本类型 */
        array.push({key:"21",val:"组织"});
        array.push({key:"22",val:"全血"});
        array.push({key:"23",val:"石蜡组织"});
        array.push({key:"24",val:"血清"});
        array.push({key:"25",val:"口腔拭子"});
        array.push({key:"26",val:"菌体"});
        array.push({key:"20",val:"其它"});
      }else if (this.process.sampletype == "03"){
        /** 细胞样本类型 */
      }
      return array;
    },
    sampleStatu : function (){
      var array = new Array();
      if (this.process.sampletype == "01"){
        /** 核酸样本类型 */
        array.push({key:"01",val:"溶于纯水"});
        array.push({key:"02",val:"溶于TE"});
        array.push({key:"03",val:"溶于无Rnase水"});
        array.push({key:"04",val:"溶于EB"});
        array.push({key:"05",val:"干粉"});
        array.push({key:"00",val:"其它"});
      }else if (this.process.sampletype == "02"){
        /** 组织样本类型 */
        array.push({key:"21",val:"速冻组织"});
        array.push({key:"22",val:"活体"});
        array.push({key:"23",val:"RNAlater保存"});
        array.push({key:"24",val:"Trlzol保存"});
        array.push({key:"20",val:"其它"});
      }else if (this.process.sampletype == "03"){
        /** 细胞样本类型 */
        array.push({key:"41",val:"裂解液"});
        array.push({key:"42",val:"液氮速冻"});
        array.push({key:"40",val:"其它"});
      }
      return array;
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
    },
  }
}
</script>

<style scoped>

</style>