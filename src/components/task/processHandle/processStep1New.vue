<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('sampleInput')"
    >
      <template slot="extra">
        <a-button @click="startProcess" :disabled="selectedRows.length == 0" type="primary">
          {{$t("start")}}
        </a-button>
        <a-button @click="submitData('tmp')" color="orange">
          {{$t("tmpSave")}}
        </a-button>
        <a-button @click="submitData('real')">
          {{$t("submit")}}
        </a-button>
        <a-button class="editable-add-btn"
                  @click="handleAdd"
        >
          {{ $t("add") }}
        </a-button>
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
            <a-button><a-icon type="upload" />{{ $t("input") }}</a-button>
          </a-tooltip>
        </a-upload>
      </template>
      <a-row type="flex">
        <a-tag color="pink">
          pink
        </a-tag>
        <a-tag color="red">
          red
        </a-tag>
        <a-tag color="orange">
          orange
        </a-tag>
        <a-tag color="green">
          green
        </a-tag>
        <a-tag color="cyan">
          cyan
        </a-tag>
        <a-tag color="blue">
          blue
        </a-tag>
        <a-tag color="purple">
          purple
        </a-tag>
      </a-row>
    </a-page-header>
    <a-table :columns="columns" :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll"
             :row-selection="rowSelection"
             size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record,index"
      >
        <div :key="col">
<!--          <template v-if="record.editable">-->
            <!-- 样本类型 -->
            <a-select  style="width: 100%" v-if="col == 'samplemsg'"
                       v-model="record.samplemsg"
            >
              <a-select-option v-for="item in sampletypes(record.initsample)" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 样本状态 -->
            <a-select  style="width: 100%" v-else-if="col == 'samplestatu'"
                       v-model="record.samplestatu"
            >
              <a-select-option v-for="item in sampleStatu(record.initsample)" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 细胞分选法 -->
            <a-select  style="width: 100%" v-else-if="col == 'cellsort'"
                       v-model="record.cellsort"
                       :disabled="colIsDisabed(record.initsample,'cellsort')"
            >
              <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>

            <!-- 建库类型 -->
            <a-select  style="width: 100%" v-else-if="col == 'databasetype'"
                       v-model="record.databasetype"
            >
              <a-select-option v-for="item in databaseTypes(record.initsample)" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- initSample -->
            <a-select  style="width: 100%" v-else-if="col == 'initsample'"
                       v-model="record.initsample"
            >
              <a-select-option v-for="item in sampleInits" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 测序平台 -->
            <a-select  style="width: 100%" v-else-if="col == 'sequencingplatform'"
                       v-model="record.sequencingplatform"
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
                :disabled="colIsDisabed(record.initsample,'samplevolume')"
            />
            <a-input-number
                v-else-if="col == 'tissuenumber'"
                style="margin: -5px 0"
                v-model="record.tissuenumber"
                :min="0"
                :disabled="colIsDisabed(record.initsample,'tissuenumber')"
            />
            <a-input-number
                v-else-if="col == 'bloodvolume'"
                style="margin: -5px 0"
                v-model="record.bloodvolume"
                :min="0"
                :disabled="colIsDisabed(record.initsample,'bloodvolume')"
            />
            <a-input-number
                v-else-if="col == 'concentration'"
                style="margin: -5px 0"
                v-model="record.concentration"
                :min="0"
                :disabled="colIsDisabed(record.initsample,'concentration')"
            />
            <a-input-number
                v-else-if="col == 'totalnumber'"
                style="margin: -5px 0"
                v-model="record.totalnumber"
                :min="0"
                :disabled="colIsDisabed(record.initsample,'totalnumber')"
            />
            <a-input
                v-else-if="col != 'index'"
                style="margin: -5px 0"
                v-model="record[col]"
                :disabled="colIsDisabed(record.initsample,col)"
            />
            <template v-else>
              {{ showText(col,text,index,record) }}
            </template>
<!--          </template>-->
<!--          <template v-else>-->
<!--            {{ showText(col,text,index,record) }}-->
<!--          </template>-->
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
<!--    <div class="modal-footer" v-if="canOperating">-->
<!--      <button type="button" class="btn btn-warning"-->
<!--              :disabled="editingKey !== ''" @click="submitData('tmp')">{{$t("tmpSave")}}</button>-->
<!--      <button type="button" class="btn btn-primary"-->
<!--              :disabled="editingKey !== ''" @click="submitData('real')">{{$t("submit")}}</button>-->
<!--    </div>-->
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
      selectedRowKeys : [],
      selectedRows : [],
      scroll :{x:1500},
      editingKey: '',
    };
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    colIsDisabed : function (sampleType,col){
      if (
          (
              col == "tissuenumber"
              || col == "bloodvolume"
          )
          && sampleType != "02"
      ){
        return true;
      }else if (
          (
              col == "concentration"
              || col == "samplevolume"
              || col == "totalnumber"
          )
          && sampleType == "02"){
        return true;
      }else if (
          (
              col == "cellsort"
              || col == "celllife"
          )
          && sampleType != "03"
      ){
        return true;
      }
      return false;
    },
    startProcess : function (){
      var postData = {
        datas : JSON.stringify(this.selectedRows),
        processId : this.process.id,
        type : "sub"
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/task/process/commitDatas",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
        _this.$("#submitting").modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    // onSelectChange : function (selectedRowKeys){
    //   console.log('selectedRowKeys changed: ', selectedRowKeys);
    //   this.selectedRowKeys = selectedRowKeys;
    // },
    submitData : function (type){
      var _this = this;
      var postData = {
        processId : this.process.id,
        datas : JSON.stringify(this.data),
        type : type
      }
      this.$("#submitting").modal("show");
      this.$axios.post("/task/process/commitDatas",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          window.location.reload();
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
      // console.log(dat);
      if (dat.file.status == "done"){
        this.initPage();
      }
    },
    // handleChange(value, key, column) {
    //   console.log(value, key, column);
    //   const newData = [...this.data];
    //   const target = newData.filter(item => key === item.key)[0];
    //   if (target) {
    //     target[column] = value;
    //     this.data = newData;
    //   }
    // },
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
      console.log(key);
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
      // console.log(this.data);
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
        // console.log(res);
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
            _this.cacheData = _this.data.map(item => ({ ...item }));
            console.log(_this.data);
          }
        }
      }).catch(function (res){
        console.log(res);
        _this.tableLoad = false;
        _this.$message.error(_this.$t("systemErr"));
      })
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
      /**批次*/
      clom.push({
        title: this.$t("arrindex"),
        dataIndex: 'arrindex',
        width: '150px',
        scopedSlots: { customRender: 'arrindex' },
      });
      scorllLength +=150;
      /**初始样本*/
      clom.push({
        title: this.$t("initSample"),
        dataIndex: 'initsample',
        width: '150px',
        scopedSlots: { customRender: 'initsample' },
      });
      scorllLength +=150;
      /**样本名称*/
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: { customRender: 'samplename' },
      });
      scorllLength +=150;
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'sampleindex',
        width: '150px',
        scopedSlots: { customRender: 'sampleindex' },
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

      // if (type == "02"){
        /** 组织量（g）*/
        clom.push({
          title: this.$t("tissueNumber") + "（g）",
          dataIndex: 'tissuenumber',
          width: '130px',
          scopedSlots: { customRender: 'tissuenumber' },
        });
        scorllLength += 130;
      // }
      // if (type == "02"){
        /** 血液体积(ml)*/
        clom.push({
          title: this.$t("bloodVolume") + "(ml)",
          dataIndex: 'bloodvolume',
          width: '130px',
          scopedSlots: { customRender: 'bloodvolume' },
        });
        scorllLength += 130;
      // }
      // if (type != "02"){
        /** 浓度(ng/ul)/（细胞个数/μl) */
        clom.push({
          title: this.concentrationName,
          dataIndex: 'concentration',
          width: '130px',
          scopedSlots: { customRender: 'concentration' },
        });
        scorllLength += 130;
      // }
      // if (type != "02"){
        /** 样本体积(ul) */
        clom.push({
          title: this.$t("sampleVolume") + "(ul)",
          dataIndex: 'samplevolume',
          width: '130px',
          scopedSlots: { customRender: 'samplevolume' },
        });
        scorllLength += 130;
      // }
      // if (type != "02"){
        /** 核酸/细胞总量（ug/细胞个数） */
        clom.push({
          title: this.totalNumberTitle,
          dataIndex: 'totalnumber',
          width: '130px',
          scopedSlots: { customRender: 'totalnumber' },
        });
        scorllLength += 130;
      // }
      // if (type == "03"){
        /** 细胞活性 */
        clom.push({
          title: this.$t("cellLife"),
          dataIndex: 'celllife',
          width: '100px',
          scopedSlots: { customRender: 'celllife' },
        });
        scorllLength += 100;
      // }
      // if (type == "03"){
        /** 细胞分选法 */
        clom.push({
          title: this.$t("cellSort"),
          dataIndex: 'cellsort',
          width: '200px',
          scopedSlots: { customRender: 'cellsort' },
        });
        scorllLength += 200;
      // }
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
      // if (this.canOperating){
      //   /**操作*/
      //   clom.push({
      //     title: this.$t("operation"),
      //     dataIndex: 'operation',
      //     width: '100px',
      //     fixed: 'right',
      //     scopedSlots: { customRender: 'operation' },
      //   });
      //   scorllLength += 100;
      // }
      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom){
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    showText : function (clo,text,ind,record){
      if (clo == "samplemsg"){
        for (var index in this.sampletypes(record.initsample)){
          var item = this.sampletypes[index];
          if (item.key == text){
            return item.val;
          }
        }
      }

      if (clo == "samplestatu"){
        for (var statuIndex in this.sampleStatu(record.initsample)){
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
        for (var databaseTypeIndex in this.databaseTypes(record.initsample)){
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

      if (clo == "initSample"){
        for (var initSampleIndex in this.sampleInits){
          var sampleInit = this.sampleInits[initSampleIndex];
          if (sampleInit.key == sampleInit){
            return sampleInit.val;
          }
        }
      }

      if (clo == "index"){
        return ind + 1;
      }
      return text;
    },
    sampletypes : function (sampleType){
      return util.sampletypes(sampleType);
    },
    sampleStatu : function (sampleType){

      return util.sampleStatu(sampleType);
    },
    databaseTypes : function (sampleType){
      return util.databaseTypes(sampleType);
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
    seqPlants : function (){
      return util.seqPlants();
    },
    sampleInits : function (){
      return util.sampleInits();
    },
    cellSortMethods : function (){
      return util.cellSortMethods();
    },
    canOperating : function (){
      if (this.process.taskstatu != "10"){
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.process.sampleinput)
        && !this.isAdmin
      ){
        return false;
      }
      return true;
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.currentstatu === '00', // Column configuration not to be checked
            name: record.name,
          },
        }),
      };
    },
  },
  watch : {
    process:{
      handler:function (){
        // console.log(newVal)
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