<template>
  <div>
    <a-button class="editable-add-btn"
              @click="handleAdd"
              :disabled="editingKey !== ''"
    >
      {{ $t("add") }}
    </a-button>
    <a-table :columns="columns" :data-source="data" bordered
             :scroll="scroll" :pagination="{ pageSize: 50 }" size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record"
      >
        <div :key="col">
          <template v-if="record.editable">
            <!-- 样本类型 -->
            <a-select  style="width: 100%" v-if="col == 'sampleMsg'"
                       v-model="record.sampleMsg"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in sampletypes" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 样本状态 -->
            <a-select  style="width: 100%" v-else-if="col == 'sampleStatu'"
                       v-model="record.sampleStatu"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in sampleStatu" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 细胞分选法 -->
            <a-select  style="width: 100%" v-else-if="col == 'cellSort'"
                       v-model="record.cellSort"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>

            <!-- 建库类型 -->
            <a-select  style="width: 100%" v-else-if="col == 'databaseType'"
                       v-model="record.databaseType"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in databaseTypes" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>

            <!-- 测序平台 -->
            <a-select  style="width: 100%" v-else-if="col == 'SequencingPlatform'"
                       v-model="record.SequencingPlatform"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <a-input-number
                v-else-if="col == 'sampleVolume'"
                style="margin: -5px 0"
                v-model="record.sampleVolume"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input-number
                v-else-if="col == 'tissueNumber'"
                style="margin: -5px 0"
                v-model="record.tissueNumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input-number
                v-else-if="col == 'bloodVolume'"
                style="margin: -5px 0"
                v-model="record.bloodVolume"
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
                v-else-if="col == 'totalNumber'"
                style="margin: -5px 0"
                v-model="record.totalNumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <a-input
                v-else
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
          </template>
          <template v-else>
            {{ showText(col,text) }}
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
              :disabled="editingKey !== ''">{{$t("submit")}}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "processStep1New",
  props : {
    process : Object
  },
  data() {
    this.cacheData = [];
    return {
      data : [],
      columns : [],
      columnNames : [],
      scroll :{x:1500,y:400},
      editingKey: '',
    };
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
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
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        target.editable = false;
        this.data = newData;
      }
    },
    checkRowData : function (rowData){
      console.log(rowData);
      if (this.isNull(rowData.sampleName)){
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
      if (this.isNull(rowData.sampleMsg)){
        this.$message.error(this.$t("sampleMsg") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.sampleStatu)){
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
      if (this.process.sampletype == "03" && this.isNull(rowData.cellLife)){
        this.$message.error(this.$t("cellLife") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "03" && this.isNull(rowData.cellSort)){
        this.$message.error(this.$t("cellSort") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.databaseType)){
        this.$message.error(this.$t("databaseType") + this.$t("not_null"));
        return false;
      }
      if (this.isNull(rowData.databaseType)){
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
      if (this.data.length == 0){
        this.handleAdd();
      }
    },
    handleAdd : function (){
      this.editingKey = new Date().getTime();
      const newData = this.createNewRowData();
      newData.key = this.editingKey;
      newData.editable = true;
      this.data = [...this.data, newData];
      this.cacheData = this.data.map(item => ({ ...item }));
    },
    createNewRowData : function (){
      return {
        sampleName : "",
        species : "",
        tissue : "",
        sampleMsg : "",
        sampleStatu : "",
        tissueNumber : 0,
        bloodVolume : 0,
        concentration : 0,
        sampleVolume : 0,
        totalNumber : 0,
        cellLife:"",
        cellSort :"",
        databaseType : "",
        SequencingPlatform : "",
        remarks : "",
        files:[]
      }
    },

    initColumns : function (type){
      console.log(type)
      var scorllLength = 0;
      var clom = new Array();
      /**序号*/
      // clom.push({
      //   title: this.$t("index"),
      //   dataIndex: 'index',
      //   width: '100px',
      //   fixed: 'left',
      //   scopedSlots: { customRender: 'name' },
      // });
      // scorllLength +=150;
      /**样本名称*/
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'sampleName',
        width: '150px',
        fixed: 'left',
        scopedSlots: { customRender: 'sampleName' },
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
        dataIndex: 'sampleMsg',
        width: '150px',
        scopedSlots: { customRender: 'sampleMsg' },
      });
      scorllLength += 150;
      /**样本状态*/
      clom.push({
        title: this.$t("sampleStatu"),
        dataIndex: 'sampleStatu',
        width: '150px',
        scopedSlots: { customRender: 'sampleStatu' },
      });
      scorllLength += 150;

      if (type == "02"){
        /** 组织量（g）*/
        clom.push({
          title: this.$t("tissueNumber") + "（g）",
          dataIndex: 'tissueNumber',
          width: '100px',
          scopedSlots: { customRender: 'tissueNumber' },
        });
        scorllLength += 100;
      }
      if (type == "02"){
        /** 血液体积(ml)*/
        clom.push({
          title: this.$t("bloodVolume") + "(ml)",
          dataIndex: 'bloodVolume',
          width: '100px',
          scopedSlots: { customRender: 'bloodVolume' },
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
          dataIndex: 'sampleVolume',
          width: '150px',
          scopedSlots: { customRender: 'sampleVolume' },
        });
        scorllLength += 150;
      }
      if (type != "02"){
        /** 核酸/细胞总量（ug/细胞个数） */
        clom.push({
          title: this.totalNumberTitle,
          dataIndex: 'totalNumber',
          width: '150px',
          scopedSlots: { customRender: 'totalNumber' },
        });
        scorllLength += 150;
      }
      if (type == "03"){
        /** 细胞活性 */
        clom.push({
          title: this.$t("cellLife"),
          dataIndex: 'cellLife',
          width: '100px',
          scopedSlots: { customRender: 'cellLife' },
        });
        scorllLength += 100;
      }
      if (type == "03"){
        /** 细胞分选法 */
        clom.push({
          title: this.$t("cellSort"),
          dataIndex: 'cellSort',
          width: '200px',
          scopedSlots: { customRender: 'cellSort' },
        });
        scorllLength += 200;
      }
      /**建库类型*/
      clom.push({
        title: this.$t("databaseType"),
        dataIndex: 'databaseType',
        width: '200px',
        scopedSlots: { customRender: 'databaseType' },
      });
      scorllLength += 200;

      /**测序平台*/
      clom.push({
        title: this.$t("SequencingPlatform"),
        dataIndex: 'SequencingPlatform',
        width: '200px',
        scopedSlots: { customRender: 'SequencingPlatform' },
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
        width: '200px',
        fixed: 'right',
        scopedSlots: { customRender: 'operation' },
      });
      scorllLength += 200;

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom){
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    showText : function (clo,text){
      if (clo == "sampleMsg"){
        for (var index in this.sampletypes){
          var item = this.sampletypes[index];
          if (item.key == text){
            return item.val;
          }
        }
      }
      if (clo == "sampleStatu"){
        for (var statuIndex in this.sampleStatu){
          var statu = this.sampleStatu[statuIndex];
          if (statu.key == text){
            return statu.val;
          }
        }
      }
      if (clo == "cellSort"){
        for (var cellSortIndex in this.cellSortMethods){
          var cellSort = this.cellSortMethods[cellSortIndex];
          if (cellSort.key == text){
            return cellSort.val;
          }
        }
      }
      if (clo == "databaseType"){
        for (var databaseTypeIndex in this.databaseTypes){
          var databaseType = this.databaseTypes[databaseTypeIndex];
          if (databaseType.key == text){
            return databaseType.val;
          }
        }
      }
      if (clo == "SequencingPlatform"){
        for (var seqPlantsIndex in this.seqPlants){
          var seqPlant = this.seqPlants[seqPlantsIndex];
          if (seqPlant.key == text){
            return seqPlant.val;
          }
        }
      }

      if (clo == "index"){
        return index;
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
        array.push({key:"42",val:"smart-seq"});
        array.push({key:"42",val:"ATAC"});
        array.push({key:"42",val:"HI-C"});
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