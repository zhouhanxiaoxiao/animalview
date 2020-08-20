<template>
  <div>
    <a-table :columns="columns" :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll" :pagination="{ pageSize: 20 }" size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record,index"
      >
        <div :key="col">
          <template v-if="record.editable">
            <!-- 细胞分选法 -->
            <a-select  style="width: 100%" v-if="col == 'cellsort'"
                       v-model="record.cellsort"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 检测结果 -->
            <a-select  style="width: 100%" v-else-if="col == 'checkresult'"
                       v-model="record.checkresult"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in checkresults" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <!-- 提取方法 -->
            <a-select  style="width: 100%" v-else-if="col == 'extractmethod'"
                       v-model="record.extractmethod"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in extractmethods" :key="item.key" :value="item.key">
                {{item.val}}
              </a-select-option>
            </a-select>
            <a-date-picker v-else-if="col == 'testdate'"
                           format="YYYY-MM-DD"
                           v-model="record.testdate"/>
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
  </div>
</template>

<script>
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";

export default {
  name: "processStep2",
  props : {
    taskId : String,
    process : Object
  },
  data : function (){
    this.cacheData = [];
    return{
      tableLoad:false,
      data : [],
      columns : [],
      columnNames : [],
      scroll :{x:1500},
      editingKey: '',
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      this.initColumns(this.process.sampletype);
      var _this = this;
      this.$axios.post("/task/process/makeInit",
          {processId:this.process.id}).then(function (res){
        console.log(res);
        if (res.data.code != "200") {
          console.log(res);
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.data = res.data.retMap.makes;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initColumns : function (type){
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
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'selfnumber',
        width: '150px',
        scopedSlots: { customRender: 'selfnumber' },
      });
      scorllLength +=150;
      /**物种*/
      clom.push({
        title: this.$t("species"),
        dataIndex: 'species',
        width: '150px',
        scopedSlots: { customRender: 'species' },
      });
      scorllLength +=150;
      /**组织来源*/
      clom.push({
        title: this.$t("tissue") + this.$t("animal_stock_resource"),
        dataIndex: 'tissue',
        width: '150px',
        scopedSlots: { customRender: 'tissue' },
      });
      scorllLength +=150;
      /**组织来源*/
      clom.push({
        title: this.$t("testDate") ,
        dataIndex: 'testdate',
        width: '150px',
        scopedSlots: { customRender: 'testdate' },
      });
      scorllLength +=150;
      /** 浓度(ng/ul)/（细胞个数/μl) */
      clom.push({
        title: this.concentrationName,
        dataIndex: 'concentration',
        width: '150px',
        scopedSlots: { customRender: 'concentration' },
      });
      scorllLength += 150;
      /** 样本体积(ul) */
      clom.push({
        title: this.$t("sampleVolume") + "(ul)",
        dataIndex: 'samplevolume',
        width: '150px',
        scopedSlots: { customRender: 'samplevolume' },
      });
      scorllLength += 150;
      /** 核酸/细胞总量（ug/细胞个数） */
      clom.push({
        title: this.totalNumberTitle,
        dataIndex: 'totalnumber',
        width: '150px',
        scopedSlots: { customRender: 'totalnumber' },
      });
      scorllLength += 150;
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
      if (type == "02"){
        /** 提取方法 */
        clom.push({
          title: this.$t("extractMethod"),
          dataIndex: 'extractmethod',
          width: '100px',
          scopedSlots: { customRender: 'extractmethod' },
        });
      }
      scorllLength += 100;
      /** 检测结果 */
      clom.push({
        title: this.$t("checkResult"),
        dataIndex: 'checkresult',
        width: '100px',
        scopedSlots: { customRender: 'checkresult' },
      });
      scorllLength += 100;
      /** 检测备注 */
      clom.push({
        title: this.$t("checkRemarks"),
        dataIndex: 'checkremarks',
        width: '100px',
        scopedSlots: { customRender: 'checkremarks' },
      });
      scorllLength += 100;
      /** 检测员 */
      clom.push({
        title: this.$t("checkUser"),
        dataIndex: 'checkuser',
        width: '100px',
        scopedSlots: { customRender: 'checkuser' },
      });
      scorllLength += 100;
      /** 审核人 */
      clom.push({
        title: this.$t("reviewer"),
        dataIndex: 'reviewer',
        width: '100px',
        scopedSlots: { customRender: 'reviewer' },
      });
      scorllLength += 100;
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
      /**剩余量*/
      clom.push({
        title: this.$t("remaining"),
        dataIndex: 'remaining',
        width: '200px',
        scopedSlots: { customRender: 'remaining' },
      });
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
      if (util.isNull(rowData.samplename)){
        this.$message.error(this.$t("sampleName") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.selfnumber)){
        this.$message.error(this.$t("sampleIndex") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.species)){
        this.$message.error(this.$t("species") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.tissue)){
        this.$message.error(this.$t("tissue") + this.$t("animal_stock_resource") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.testdate)){
        util.$message.error(this.$t("testDate") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.concentration)){
        this.$message.error(this.$t("concentration") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.samplevolume)){
        this.$message.error(this.$t("sampleVolume") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "02" && util.isNull(rowData.remaining)){
        this.$message.error(this.$t("remaining") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.checkresult)){
        this.$message.error(this.$t("checkResult") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "02" && util.isNull(rowData.extractmethod)){
        this.$message.error(this.$t("extractMethod") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.totalNumber)){
        this.$message.error(this.$t("totalNumber") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "03" && util.isNull(rowData.celllife)){
        this.$message.error(this.$t("celllife") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "03" && util.isNull(rowData.cellsort)){
        this.$message.error(this.$t("cellsort") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.databasetype)){
        this.$message.error(this.$t("databaseType") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.sequencingplatform)){
        this.$message.error(this.$t("SequencingPlatform") + this.$t("not_null"));
        return false;
      }
      return true;
    },
    showText : function (clo,text,ind){
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

      if (clo == "testdate"){
        if (util.isNull(text)){
          return "";
        }
        return formatDate(new Date(text),"yyyy-MM-dd");
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
    cellSortMethods : function (){
      return util.cellSortMethods();
    },
    databaseTypes : function (){
      return util.databaseTypes(this.process.sampletype);
    },
    seqPlants : function (){
      return util.seqPlants();
    },
    extractmethods : function (){
      return util.extractmethods();
    },
    checkresults : function (){
      return util.checkresults();
    }
  },
  watch :{
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

</style>