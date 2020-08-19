<template>
  <div>
    <a-button class="editable-add-btn"
              @click="handleAdd"
              :disabled="editingKey !== ''"
    >
      {{ $t("add") }}
    </a-button>
    &nbsp;
    <a-upload
        name="file"
        accept=".xls,.xlsx"
        :headers="{token:this.$cookies.get('token'),processId : process.id}"
        @change="handUploadChange"
        @reject="handUnaccept"
        :beforeUpload="handBeforeUpload"
        :action="this.$axios.defaults.baseURL + '/file/import/sampleInput'"
    >
      <a-tooltip placement="topLeft" :title="$t('overText')">
        <a-button> <a-icon type="upload" />{{ $t("input") }}</a-button>
      </a-tooltip>
    </a-upload>
    <br/>
    <a-table :columns="columns" :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll" :pagination="{ pageSize: 50 }" size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record,index"
      >
        <div :key="col">
          <template v-if="record.editable">
            <!-- 样本类型 -->
            <a-select  style="width: 100%" v-if="col == 'samplemsg'"
                       v-model="record.samplemsg"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in sampletypes" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 样本状态 -->
            <a-select  style="width: 100%" v-else-if="col == 'samplestatu'"
                       v-model="record.samplestatu"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in sampleStatu" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 细胞分选法 -->
            <a-select  style="width: 100%" v-else-if="col == 'cellsort'"
                       v-model="record.cellsort"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>

            <!-- 建库类型 -->
            <a-select  style="width: 100%" v-else-if="col == 'databasetype'"
                       v-model="record.databasetype"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in databaseTypes" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>

            <!-- 测序平台 -->
            <a-select  style="width: 100%" v-else-if="col == 'sequencingplatform'"
                       v-model="record.sequencingplatform"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <a-input-number
                v-else-if="col == 'samplevolume'"
                style="margin: -5px 0"
                v-model="record.samplevolume"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input-number
                v-else-if="col == 'tissuenumber'"
                style="margin: -5px 0"
                v-model="record.tissuenumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input-number
                v-else-if="col == 'bloodvolume'"
                style="margin: -5px 0"
                v-model="record.bloodvolume"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input-number
                v-else-if="col == 'concentration'"
                style="margin: -5px 0"
                v-model="record.concentration"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input-number
                v-else-if="col == 'totalnumber'"
                style="margin: -5px 0"
                v-model="record.totalnumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
                v-else-if="col != 'index'"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>
              {{ showText(col,text,index) }}
            </template>
          </template>
          <template v-else>
            {{ showText(col,text,index) }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">{{$t("save")}}</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>{{$t("cancel")}}</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{$t("edit")}}</a>
          <a-popconfirm
                v-if="data.length>1"
                title="Sure to delete?"
                @confirm="() => onDelete(record.key)"
            >
          <a :disabled="editingKey !== ''">{{$t("delete")}}</a>
        </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
      <button type="button" class="btn btn-primary"
              :disabled="editingKey !== ''" @click="submitData">{{$t("submit")}}</button>
    </div>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";
export default {
  name: "processStep1New",
  components: {Submitting},
  props : {
    process : Object
  },
  data() {
    this.cacheData = [];
    return {
      tableLoad:false,
      data : [],
      columns : [],
      columnNames : [],
      scroll :{x:1500},
      editingKey: '',
    };
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    submitData : function (){
      this.$("#submitting").modal("show");
      var _this = this;
      var postData = {
        processId : this.process.id,
        datas : JSON.stringify(this.data)
      }
      this.$axios.post("/task/process/commitDatas",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
        }
      }).catch(function (res){
        console.log(res);
        _this.$("#submitting").modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    handBeforeUpload : function (file){
      if (file.name.indexOf("样本录入-") != 0){
        this.$message.error(this.$t("fileNameErr"));
        return false;
      }
      if (this.process.sampletype == "01" && file.name.indexOf("-核酸-") == -1){
        this.$message.error(this.$t("fileNameErr"));
        return false;
      }else if (this.process.sampletype == "02" && file.name.indexOf("-组织-") == -1){
        this.$message.error(this.$t("fileNameErr"));
        return false;
      }else if (this.process.sampletype == "02" && !file.name.indexOf("-组织-") == -1){
        this.$message.error(this.$t("fileNameErr"));
        return false;
      }
      return true;
    },
    handUnaccept : function (){
      this.$message.error(this.$t("unAcceptFile"));
    },
    handUploadChange :function (dat){
      console.log(dat);
      if (dat.file.status == "done"){
        this.initPage();
      }
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter(item => item.key !== key);
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      if (!this.checkRowData(target)){
        return;
      }
      target.add = false;
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      target.editable = false;
      this.editingKey = '';
      console.log(this.data);
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target.add == true){
        this.editingKey ="";
        this.onDelete(target.key);
        return ;
      }
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        target.editable = false;
        this.data = newData;
      }
    },
    checkRowData : function (rowData){
      console.log(rowData);
      if (this.isNull(rowData.samplename)){
        this.$message.error(this.$t("sampleName") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.species)){
        this.$message.error(this.$t("species") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.tissue)){
        this.$message.error(this.$t("tissue") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.samplemsg)){
        this.$message.error(this.$t("sampleMsg") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.samplestatu)){
        this.$message.error(this.$t("sampleStatu") + this.$t("not_null"));
        return false;
      }
      // if (this.process.sampletype == "02" && this.isNull(rowData.tissueNumber)){
      //   this.$message.error(this.$t("tissueNumber") + this.$t("not_null"));
      //   return false;
      // }
      // if (this.process.sampletype == "02" && this.isNull(rowData.bloodVolume)){
      //   this.$message.error(this.$t("bloodVolume") + this.$t("not_null"));
      //   return false;
      // }
      // if (this.process.sampletype != "02" && this.isNull(rowData.concentration)){
      //   this.$message.error(this.$t("concentration") + this.$t("not_null"));
      //   return false;
      // }
      // if (this.process.sampletype != "02" && this.isNull(rowData.sampleVolume)){
      //   this.$message.error(this.$t("sampleVolume") + this.$t("not_null"));
      //   return false;
      // }
      // if (this.process.sampletype != "02" && this.isNull(rowData.totalNumber)){
      //   this.$message.error(this.$t("totalNumber") + this.$t("not_null"));
      //   return false;
      // }
      if (this.process.sampletype == "03" && this.isNull(rowData.celllife)){
        this.$message.error(this.$t("celllife") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "03" && this.isNull(rowData.cellsort)){
        this.$message.error(this.$t("cellsort") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.databasetype)){
        this.$message.error(this.$t("databaseType") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.sequencingplatform)){
        this.$message.error(this.$t("SequencingPlatform") + this.$t("not_null"));
        return false;
      }
      return true;
    },
    isNull : function (d){
      if (d == "" || d == null || d== undefined){
        return true;
      }
      return false;
    },
    initPage : function (){
      this.initColumns(this.process.sampletype);
      if (util.isNull(this.process) || util.isNull(this.process.id)){
        return ;
      }
      var postData = {
        processId : this.process.id
      }
      var _this = this;
      this.tableLoad = true;
      _this.data = new Array();
      this.$axios.post("/task/process/sampleInput",postData).then(function (res){
        console.log(res);
        _this.tableLoad = false;
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          if (res.data.retMap.sampleInputs == undefined
              ||res.data.retMap.sampleInputs == null
              ||res.data.retMap.sampleInputs.length == 0){
            _this.handleAdd();
          }else {
            _this.editingKey = "";
            for (var i=0;i<res.data.retMap.sampleInputs.length;i++){
              var d = res.data.retMap.sampleInputs[i];
              d.key = d.id;
              _this.data.push(d);
            }
          }
        }
      }).catch(function (res){
        console.log(res);
        _this.tableLoad = false;
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    handleIndex : function (){

    },
    handleAdd : function (){
      this.editingKey = new Date().getTime();
      const newData = this.createNewRowData();
      newData.key = this.editingKey;
      newData.editable = true;
      newData.add = true;
      this.data = [...this.data, newData];
      this.cacheData = this.data.map(item => ({ ...item }));
    },
    createNewRowData : function (){
      return {
        index:1,
        samplename : "",
        species : "",
        tissue : "",
        samplemsg : "",
        samplestatu : "",
        tissuenumber : 0,
        bloodvolume : 0,
        concentration : 0,
        samplevolume : 0,
        totalnumber : 0,
        celllife:"",
        cellsort :"",
        databasetype : "",
        sequencingplatform : "",
        remarks : "",
        files:[]
      }
    },
    initColumns : function (type){
      console.log(type)
      var scorllLength = 0;
      var clom = new Array();
      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: { customRender: 'index' },
      });
      scorllLength +=50;
      /**样本名称*/
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: { customRender: 'samplename' },
      });
      scorllLength +=150;
      /**物种*/
      clom.push({
        title: this.$t("species"),
        dataIndex: 'species',
        width: '100px',
        scopedSlots: { customRender: 'species' },
      });
      scorllLength += 100;
      /**组织来源*/
      clom.push({
        title: this.$t("tissue") + this.$t("animal_stock_resource"),
        dataIndex: 'tissue',
        width: '150px',
        scopedSlots: { customRender: 'tissue' },
      });
      scorllLength += 150;
      /**样本类型*/
      clom.push({
        title: this.$t("sampleMsg"),
        dataIndex: 'samplemsg',
        width: '150px',
        scopedSlots: { customRender: 'samplemsg' },
      });
      scorllLength += 150;
      /**样本状态*/
      clom.push({
        title: this.$t("sampleStatu"),
        dataIndex: 'samplestatu',
        width: '150px',
        scopedSlots: { customRender: 'samplestatu' },
      });
      scorllLength += 150;

      if (type == "02"){
        /** 组织量（g）*/
        clom.push({
          title: this.$t("tissueNumber") + "（g）",
          dataIndex: 'tissuenumber',
          width: '100px',
          scopedSlots: { customRender: 'tissuenumber' },
        });
        scorllLength += 100;
      }
      if (type == "02"){
        /** 血液体积(ml)*/
        clom.push({
          title: this.$t("bloodVolume") + "(ml)",
          dataIndex: 'bloodvolume',
          width: '100px',
          scopedSlots: { customRender: 'bloodvolume' },
        });
        scorllLength += 100;
      }
      if (type != "02"){
        /** 浓度(ng/ul)/（细胞个数/μl) */
        clom.push({
          title: this.concentrationName,
          dataIndex: 'concentration',
          width: '150px',
          scopedSlots: { customRender: 'concentration' },
        });
        scorllLength += 150;
      }
      if (type != "02"){
        /** 样本体积(ul) */
        clom.push({
          title: this.$t("sampleVolume") + "(ul)",
          dataIndex: 'samplevolume',
          width: '150px',
          scopedSlots: { customRender: 'samplevolume' },
        });
        scorllLength += 150;
      }
      if (type != "02"){
        /** 核酸/细胞总量（ug/细胞个数） */
        clom.push({
          title: this.totalNumberTitle,
          dataIndex: 'totalnumber',
          width: '150px',
          scopedSlots: { customRender: 'totalnumber' },
        });
        scorllLength += 150;
      }
      if (type == "03"){
        /** 细胞活性 */
        clom.push({
          title: this.$t("cellLife"),
          dataIndex: 'celllife',
          width: '100px',
          scopedSlots: { customRender: 'celllife' },
        });
        scorllLength += 100;
      }
      if (type == "03"){
        /** 细胞分选法 */
        clom.push({
          title: this.$t("cellSort"),
          dataIndex: 'cellsort',
          width: '200px',
          scopedSlots: { customRender: 'cellsort' },
        });
        scorllLength += 200;
      }
      /**建库类型*/
      clom.push({
        title: this.$t("databaseType"),
        dataIndex: 'databasetype',
        width: '200px',
        scopedSlots: { customRender: 'databasetype' },
      });
      scorllLength += 200;

      /**测序平台*/
      clom.push({
        title: this.$t("SequencingPlatform"),
        dataIndex: 'sequencingplatform',
        width: '200px',
        scopedSlots: { customRender: 'sequencingplatform' },
      });
      scorllLength += 200;
      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remarks',
        width: '200px',
        scopedSlots: { customRender: 'remarks' },
      });
      scorllLength += 200;
      /**操作*/
      clom.push({
        title: this.$t("operation"),
        dataIndex: 'operation',
        width: '100px',
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
      });
      scorllLength += 100;

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom){
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    showText : function (clo,text,ind){
      console.log(clo,text,ind);
      if (clo == "samplemsg"){
        for (var index in this.sampletypes){
          var item = this.sampletypes[index];
          if (item.key == text){
            return item.val;
          }
        }
      }
      if (clo == "samplestatu"){
        for (var statuIndex in this.sampleStatu){
          var statu = this.sampleStatu[statuIndex];
          if (statu.key == text){
            return statu.val;
          }
        }
      }
      if (clo == "cellsort"){
        for (var cellSortIndex in this.cellSortMethods){
          var cellSort = this.cellSortMethods[cellSortIndex];
          if (cellSort.key == text){
            return cellSort.val;
          }
        }
      }
      if (clo == "databasetype"){
        for (var databaseTypeIndex in this.databaseTypes){
          var databaseType = this.databaseTypes[databaseTypeIndex];
          if (databaseType.key == text){
            return databaseType.val;
          }
        }
      }
      if (clo == "sequencingplatform"){
        for (var seqPlantsIndex in this.seqPlants){
          var seqPlant = this.seqPlants[seqPlantsIndex];
          if (seqPlant.key == text){
            return seqPlant.val;
          }
        }
      }

      if (clo == "index"){
        return ind + 1;
      }
      return text;
    },
  },
  computed : {
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
    sampletypes : function (){
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
    cellSortMethods : function (){
      return[
        {key:"01",val:"过筛网"},
        {key:"02",val:"磁珠分选"},
        {key:"03",val:"口吸管法"},
        {key:"04",val:"BD流式分选"},
        {key:"05",val:"NanoCellect 流式分选"}
      ]
    },
    databaseTypes : function (){
      var array = new Array();
      if (this.process.sampletype == "01"){
        /** 核酸样本类型 */
        array.push({key:"01",val:"DNA常规小片段"});
        array.push({key:"02",val:"DNA非常规小片段"});
        array.push({key:"03",val:"人外显子"});
        array.push({key:"04",val:"PCR-free文库"});
        array.push({key:"05",val:"真核普通转录组"});
        array.push({key:"06",val:"真核链特异性"});
        array.push({key:"07",val:"LncRNA"});
      }else if (this.process.sampletype == "02"){
        /** 组织样本类型 */
        array.push({key:"21",val:"10X单细胞转录组"});
        array.push({key:"22",val:"10X空间转录组"});
        array.push({key:"23",val:"10X ATAC"});
        array.push({key:"24",val:"smart-seq"});
        array.push({key:"25",val:"ATAC"});
        array.push({key:"26",val:"HI-C"});
        array.push({key:"27",val:"DNA常规小片段"});
        array.push({key:"28",val:"DNA非常规小片段"});
        array.push({key:"29",val:"人外显子"});
        array.push({key:"30",val:"PCR-free文库"});
        array.push({key:"31",val:"真核普通转录组"});
        array.push({key:"32",val:"真核链特异性"});
        array.push({key:"33",val:"LncRNA"});
      }else if (this.process.sampletype == "03"){
        /** 细胞样本类型 */
        array.push({key:"41",val:"10X单细胞转录组"});
        array.push({key:"42",val:"10X ATAC"});
        array.push({key:"43",val:"smart-seq"});
        array.push({key:"44",val:"ATAC"});
        array.push({key:"45",val:"HI-C"});
      }
      return array;
    },
    seqPlants : function (){
      var array = new Array();
      array.push({key:"01",val:"Hiseq-SE50"});
      array.push({key:"02",val:"Hiseq-PE150"});
      array.push({key:"03",val:"Hiseq-PE250"});
      array.push({key:"00",val:"其它"});
      return array;
    }
  },
  watch : {
    process:{
      handler:function (newVal){
        console.log(newVal)
        this.initPage();
      },
      deep : true
    }
  }
}
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>