<template>
  <div>
    <a-table :columns="columns" :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll" :pagination="{ pageSize: 20 }" size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record, index"
      >
        <div :key="col">
          <template v-if="record.editable">
            <!-- 建库时间 -->
            <a-date-picker v-if="col == 'createdbtime'"
                           format="YYYY-MM-DD"
                           @change="e => handleChange(e.target.value, record.key, col)"
                           v-model="record.createdbtime"/>
            <!-- 浓度(ng/ul)/（细胞个数/μl) -->
            <a-input-number
                v-else-if="col == 'concentration'"
                style="margin: -5px 0"
                v-model="record.concentration"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 核酸/细胞总量（ug/细胞个数） -->
            <a-input-number
                v-else-if="col == 'totalnumber'"
                style="margin: -5px 0"
                v-model="record.totalnumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 样本使用量(ug)/细胞使用量（细胞个数） -->
            <a-input-number
                v-else-if="col == 'usenumber'"
                style="margin: -5px 0"
                v-model="record.usenumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 片段大小（bp） -->
            <a-input-number
                v-else-if="col == 'partsize'"
                style="margin: -5px 0"
                v-model="record.partsize"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 常规PCR循环数 -->
            <a-input-number
                v-else-if="col == 'cyclenumber'"
                style="margin: -5px 0"
                v-model="record.cyclenumber"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 上机数据量 -->
            <a-input-number
                v-else-if="col == 'uploadsize'"
                style="margin: -5px 0"
                v-model="record.uploadsize"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 文库体积（ul） -->
            <a-input-number
                v-else-if="col == 'libsize'"
                style="margin: -5px 0"
                v-model="record.libsize"
                :min="0"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <!-- 建库人 -->
            <a-select  style="width: 100%" v-else-if="col == 'createdbuser'"
                       v-model="record.createdbuser"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>
            <!-- 审核人 -->
            <a-select  style="width: 100%" v-else-if="col == 'reviewer'"
                       v-model="record.reviewer"
                       @change="e => handleChange(e.target.value, record.key, col)"
            >
              <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
                {{item.name}}
              </a-select-option>
            </a-select>

            <!-- 序号 -->
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
           &nbsp;
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>{{$t("cancel")}}</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{$t("edit")}}</a>
          &nbsp;
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
      <button type="button" class="btn btn-warning"
              :disabled="editingKey !== ''" @click="submitData('tmp')">{{$t("tmpSave")}}</button>
      <button type="button" class="btn btn-primary"
              :disabled="editingKey !== ''" @click="submitData('real')">{{$t("submit")}}</button>
    </div>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>

export default {
  name: "processStep3",
  props : {
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
      allUsers : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods:{
    initPage : function (){
      this.initColumns();
      var _this = this;
      this.$axios.post("/task/process/libInit",{processId:this.process.id}).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          if (res.data.retMap.libs.length != 0){
            for (var ind in res.data.retMap.libs){
              var lib = res.data.retMap.libs[ind];
              lib.key = lib.id;
              _this.data.push(lib);
            }
          }
          _this.cacheData = _this.data.map(item => ({ ...item }));
          _this.allUsers = res.data.retMap.allUsers;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initColumns : function (){
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
      /**建库时间*/
      clom.push({
        title: this.$t("createdbtime"),
        dataIndex: 'createdbtime',
        width: '150px',
        scopedSlots: { customRender: 'createdbtime' },
      });
      scorllLength += 150;
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'selfnumber',
        width: '150px',
        scopedSlots: { customRender: 'selfnumber' },
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
      /**物种*/
      clom.push({
        title: this.$t("species"),
        dataIndex: 'species',
        width: '150px',
        scopedSlots: { customRender: 'species' },
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
      /** 核酸/细胞总量（ug/细胞个数） */
      clom.push({
        title: this.totalNumberTitle,
        dataIndex: 'totalnumber',
        width: '150px',
        scopedSlots: { customRender: 'totalnumber' },
      });
      scorllLength += 150;
      /** 细胞活性 */
      clom.push({
        title: this.$t("cellLife"),
        dataIndex: 'celllife',
        width: '100px',
        scopedSlots: { customRender: 'celllife' },
      });
      scorllLength += 100;
      /** 样本使用量(ug)/细胞使用量（细胞个数） */
      clom.push({
        title: this.$t("useNumber"),
        dataIndex: 'usenumber',
        width: '100px',
        scopedSlots: { customRender: 'usenumber' },
      });
      scorllLength += 100;
      /** 片段大小（bp） */
      clom.push({
        title: this.$t("partsize"),
        dataIndex: 'partsize',
        width: '100px',
        scopedSlots: { customRender: 'partsize' },
      });
      scorllLength += 100;
      /** index */
      clom.push({
        title: "index",
        dataIndex: 'libindex',
        width: '100px',
        scopedSlots: { customRender: 'libindex' },
      });
      scorllLength += 100;
      /** barcode */
      clom.push({
        title: "barcode",
        dataIndex: 'libbarcode',
        width: '100px',
        scopedSlots: { customRender: 'libbarcode' },
      });
      scorllLength += 100;
      /** 常规PCR循环数 */
      clom.push({
        title: this.$t("cyclenumber"),
        dataIndex: 'cyclenumber',
        width: '100px',
        scopedSlots: { customRender: 'cyclenumber' },
      });
      scorllLength += 100;
      /** 文库类型 */
      clom.push({
        title: this.$t("databasetype2"),
        dataIndex: 'databasetype',
        width: '100px',
        scopedSlots: { customRender: 'databasetype' },
      });
      scorllLength += 100;
      /** 文库编号 */
      clom.push({
        title: this.$t("databaseindex"),
        dataIndex: 'databaseindex',
        width: '100px',
        scopedSlots: { customRender: 'databaseindex' },
      });
      scorllLength += 100;
      /** 建库人 */
      clom.push({
        title: this.$t("createdbuser"),
        dataIndex: 'createdbuser',
        width: '100px',
        scopedSlots: { customRender: 'createdbuser' },
      });
      scorllLength += 100;
      /** 审核人 */
      clom.push({
        title: this.$t("reviewer"),
        dataIndex: 'reviewer',
        width: '150px',
        scopedSlots: { customRender: 'reviewer' },
      });
      scorllLength += 150;
      /** Qubit浓度 */
      clom.push({
        title: this.$t("qbit"),
        dataIndex: 'qbit',
        width: '150px',
        scopedSlots: { customRender: 'qbit' },
      });
      scorllLength += 150;
      /** 文库体积（ul） */
      clom.push({
        title: this.$t("libsize"),
        dataIndex: 'libsize',
        width: '150px',
        scopedSlots: { customRender: 'libsize' },
      });
      scorllLength += 150;
      /** 文库体积（ul） */
      clom.push({
        title: this.$t("seqmethods"),
        dataIndex: 'seqmethods',
        width: '150px',
        scopedSlots: { customRender: 'seqmethods' },
      });
      scorllLength += 150;
      /** 上机数据量 */
      clom.push({
        title: this.$t("uploadsize"),
        dataIndex: 'uploadsize',
        width: '150px',
        scopedSlots: { customRender: 'uploadsize' },
      });
      scorllLength += 150;
      /** 数据量单位 */
      clom.push({
        title: this.$t("databaseunit"),
        dataIndex: 'databaseunit',
        width: '150px',
        scopedSlots: { customRender: 'databaseunit' },
      });
      scorllLength += 150;
      /** 建库备注 */
      clom.push({
        title: this.$t("libremark"),
        dataIndex: 'libremark',
        width: '150px',
        scopedSlots: { customRender: 'libremark' },
      });
      scorllLength += 150;
      /** 上机备注 */
      clom.push({
        title: this.$t("uploadremark"),
        dataIndex: 'uploadremark',
        width: '150px',
        scopedSlots: { customRender: 'uploadremark' },
      });
      scorllLength += 150;

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
    showText : function (clo,text,ind){
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