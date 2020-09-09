<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('samplePreparation')"
    >
      <template slot="extra">

        <a-button @click="submitData('tmp')">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button type="primary" @click="submitData('real')">
          {{ $t("submit") }}
        </a-button>
        <a-button icon="download" @click="downLoad">
          {{ $t("outPut") }}
        </a-button>
        <a-upload
            name="file"
            accept=".xls,.xlsx"
            :headers="{token:this.$cookies.get('token'),processId : process.id}"
            @change="handUploadChange"
            :action="this.$axios.defaults.baseURL + '/file/import/makeInput'"
        >
          <a-button><a-icon type="upload" />{{ $t("input") }}</a-button>
        </a-upload>
      </template>
    </a-page-header>
    <a-table :columns="columns" :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll" :pagination="{ pageSize: 20 }" size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record,index"
      >
        <div :key="col">

          <!-- 细胞分选法 -->
          <a-select style="width: 100%" v-if="col == 'cellsort'"
                    v-model="record.cellsort"
                    :disabled="colIsDisabed(record.initsample,col) || isStop(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- initSample -->
          <a-select  style="width: 100%" v-else-if="col == 'initsample'"
                     v-model="record.initsample"
                     disabled
          >
            <a-select-option v-for="item in sampleInits" :key="item.key" :value="item.key">
              {{item.val}}
            </a-select-option>
          </a-select>
          <!-- 检测结果 -->
          <a-select style="width: 100%" v-else-if="col == 'checkresult'"
                    :disabled="isStop(record)"
                    v-model="record.checkresult"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in checkresults" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 检测员 -->
          <a-select style="width: 100%" v-else-if="col == 'checkuser'"
                    v-model="record.checkuser"
                    :disabled="isStop(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 审核人 -->
          <a-select style="width: 100%" v-else-if="col == 'reviewer'"
                    v-model="record.reviewer"
                    :disabled="isStop(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 提取方法 -->
          <a-select style="width: 100%" v-else-if="col == 'extractmethod'"
                    v-model="record.extractmethod"
                    :disabled="isStop(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in extractmethods" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 检测日期 -->
          <a-date-picker v-else-if="col == 'testdate'"
                         format="YYYY-MM-DD"
                         :disabled="isStop(record)"
                         @change="e => handleChange(e.target.value, record.key, col)"
                         v-model="record.testdate"/>
          <!-- 建库类型 -->
          <a-select style="width: 100%" v-else-if="col == 'databasetype'"
                    v-model="record.databasetype"
                    :disabled="isStop(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in databaseTypes(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 测序平台 -->
          <a-select style="width: 100%" v-else-if="col == 'sequencingplatform'"
                    v-model="record.sequencingplatform"
                    :disabled="isStop(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <a-input-number
              v-else-if="col == 'samplevolume'"
              style="margin: -5px 0"
              v-model="record.samplevolume"
              :disabled="isStop(record)"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input-number
              v-else-if="col == 'concentration'"
              style="margin: -5px 0"
              v-model="record.concentration"
              :disabled="isStop(record)"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input-number
              v-else-if="col == 'totalnumber'"
              style="margin: -5px 0"
              v-model="record.totalnumber"
              :disabled="isStop(record)"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <div v-else-if="col == 'upload'">
            <a-upload

                name="file"
                :multiple="true"
                :disabled="isStop(record)"
                :headers="uploadHeader(record)"
                :action="uploadUrl"
                :showUploadList="false"
                @change="handleUploadChange"
            >
              <a-button :disabled="isStop(record)"> <a-icon type="upload" />{{ $t("upload") }} </a-button>
            </a-upload>
          </div>
          <a-input
              v-else-if="col != 'index'"
              style="margin: -5px 0"
              :value="text"
              v-model="record[col]"
              :disabled="colIsDisabed(record.initsample,col) || isStop(record)"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ showText(col, text, index) }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <a @click="() => showReason(record.id)" v-if="isStop(record)">{{ $t("showReason") }}</a>
          <a @click="() => showStopAlert(record.id)" v-if="!isStop(record)">{{ $t("stop") }}</a>
          &nbsp;<a @click="() => showFileList(record.id)" >{{ "查看附件" }}</a>

          <!--          <span v-if="record.editable">-->
<!--            <a @click="() => save(record.key)">{{ $t("save") }}</a>-->
<!--            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">-->
<!--              <a>{{ $t("cancel") }}</a>-->
<!--            </a-popconfirm>-->
<!--          </span>-->
<!--            <span v-else>-->
<!--            <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{ $t("edit") }}</a>-->
<!--            &nbsp;-->
<!--            <a-popconfirm-->
<!--                v-if="data.length>1"-->
<!--                title="Sure to delete?"-->
<!--                @confirm="() => onDelete(record.key)"-->
<!--            >-->
<!--            <a :disabled="editingKey !== ''">{{ $t("delete") }}</a>-->
<!--          </a-popconfirm>-->
<!--          </span>-->
        </div>
      </template>
    </a-table>
<!--    <div class="modal-footer" v-if="canEdit">-->
<!--      <button type="button" class="btn btn-warning"-->
<!--              :disabled="editingKey !== ''" @click="submitData('tmp')">{{ $t("tmpSave") }}-->
<!--      </button>-->
<!--      <button type="button" class="btn btn-primary"-->
<!--              :disabled="editingKey !== ''" @click="submitData('real')">{{ $t("submit") }}-->
<!--      </button>-->
<!--    </div>-->
    <submitting :title="$t('submitting')"></submitting>
    <refuse-alert :modal-title="$t('reason')" @confirmFun="stopProcess"></refuse-alert>
    <show-filelist :detail-id="detailId"></show-filelist>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";
import RefuseAlert from "@/components/publib/refuseAlert";
import ShowFilelist from "@/components/publib/showFilelist";

export default {
  name: "processStep2",
  components: {ShowFilelist, RefuseAlert, Submitting},
  props: {
    taskId: String,
    process: Object,
    subId: String
  },
  data: function () {
    this.cacheData = [];
    return {
      tableLoad: false,
      data: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      editingKey: '',
      allUsers: [],
      stopId : "",
      detailId : "",
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    handUploadChange : function (ret){
      console.log(ret);
      if (ret.file.status == "uploading"){
        this.$("#submitting").modal("show");
      }else {
        this.$("#submitting").modal("hide");
        if (ret.file.status == "error"){
          this.$message.error(this.$t("systemErr"));
        }else if (ret.file.status == "done"){
          this.$message.success(this.$t("commitSucc"));
        }
      }
    },
    downLoad : function (){
      var postData = {
        subId : this.subId
      }
      util.downLoad(postData,"/task/process/downloadMakes","样品制备.xls");
    },
    showFileList : function (detailId){
      console.log(detailId);
      this.detailId = detailId;
      this.$("#showFileList").modal("show");
    },
    showReason : function (makeId){
      var _this = this;
      this.$axios.post("/task/process/showStopReason",{detailId : makeId}).then(function (res){
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$error({
            title: _this.$t("reason"),
            content : res.data.retMap.reason
          });
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showStopAlert : function (makeId){
      this.stopId = makeId;
      this.$("#refuseAlert").modal("show");
    },
    stopProcess : function (reason,remark){
      this.$("#refuseAlert").modal("hide");
      var postData = {
        makeId : this.stopId,
        reason : reason,
        remark : remark
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/task/process/stopMake",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    handleUploadChange : function (ret){
      if (ret.file.status == "done"){
        this.$message.success(this.$t("upload") + this.$t("save_success"));
      }else if (ret.file.status == "error"){
        this.$message.success(this.$t("systemErr"));
      }
    },
    colIsDisabed : function (sampleType,col){
      if (
          (
              col == "extractmethod"
              || col == "remaining"
          )
          && sampleType != "02"
      ){
        return true;
      }else if (
          (
              col == "cellsort"
              || col == "celllife"
          )
          && sampleType != "03"
      ){
        return true;
      }else if (
          col == "samplename"
          || col == "selfnumber"
      ){
        return true;
      }
      return false;
    },
    submitData: function (flag) {
      var postData = {
        processId: this.process.id,
        data: JSON.stringify(this.data),
        flag: flag
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/task/process/submitMakes", postData).then(function (res) {
        console.log(res);
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.value = "";
          _this.initPage();
          window.location.reload();
        }
      }).catch(function (res) {
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initPage: function () {
      this.initColumns(this.process.sampletype);
      var _this = this;
      if (util.isNull(this.process.id) || util.isNull(this.subId)) {
        return;
      }
      _this.data = new Array();
      var postData = {
        processId: this.process.id,
        subId: this.subId
      }
      this.$axios.post("/task/process/makeInit", postData).then(function (res) {
        console.log(res);
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          if (res.data.retMap.makes.length != 0) {
            for (var ind in res.data.retMap.makes) {
              var make = res.data.retMap.makes[ind];
              make.testdate = formatDate(new Date(make.testdate),"yyyy-MM-dd");
              make.key = make.inputid;
              _this.data.push(make);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initColumns: function (type) {
      console.log(type);
      var scorllLength = 0;
      var clom = new Array();
      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });
      scorllLength += 50;
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
        scopedSlots: {customRender: 'samplename'},
      });
      scorllLength += 150;
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'selfnumber',
        width: '150px',
        scopedSlots: {customRender: 'selfnumber'},
      });
      scorllLength += 150;
      /**样本衍生编号*/
      clom.push({
        title: this.$t("derivativeindex"),
        dataIndex: 'derivativeindex',
        width: '150px',
        scopedSlots: {customRender: 'derivativeindex'},
      });
      scorllLength += 150;
      /**物种*/
      clom.push({
        title: this.$t("species"),
        dataIndex: 'species',
        width: '150px',
        scopedSlots: {customRender: 'species'},
      });
      scorllLength += 150;
      /**组织来源*/
      clom.push({
        title: this.$t("tissue") + this.$t("animal_stock_resource"),
        dataIndex: 'tissue',
        width: '150px',
        scopedSlots: {customRender: 'tissue'},
      });
      scorllLength += 150;
      /**检测日期*/
      clom.push({
        title: this.$t("testDate"),
        dataIndex: 'testdate',
        width: '150px',
        scopedSlots: {customRender: 'testdate'},
      });
      scorllLength += 150;
      /** 浓度(ng/ul)/（细胞个数/μl) */
      clom.push({
        title: this.concentrationName,
        dataIndex: 'concentration',
        width: '150px',
        scopedSlots: {customRender: 'concentration'},
      });
      scorllLength += 150;
      /** 样本体积(ul) */
      clom.push({
        title: this.$t("sampleVolume") + "(ul)",
        dataIndex: 'samplevolume',
        width: '150px',
        scopedSlots: {customRender: 'samplevolume'},
      });
      scorllLength += 150;
      /** 核酸/细胞总量（ug/细胞个数） */
      clom.push({
        title: this.totalNumberTitle,
        dataIndex: 'totalnumber',
        width: '150px',
        scopedSlots: {customRender: 'totalnumber'},
      });
      scorllLength += 150;
      // if (type == "03") {
        /** 细胞活性 */
        clom.push({
          title: this.$t("cellLife"),
          dataIndex: 'celllife',
          width: '100px',
          scopedSlots: {customRender: 'celllife'},
        });
        scorllLength += 100;
      // }
      // if (type == "03") {
        /** 细胞分选法 */
        clom.push({
          title: this.$t("cellSort"),
          dataIndex: 'cellsort',
          width: '200px',
          scopedSlots: {customRender: 'cellsort'},
        });
        scorllLength += 200;
      // }
      // if (type == "02") {
        /** 提取方法 */
        clom.push({
          title: this.$t("extractMethod"),
          dataIndex: 'extractmethod',
          width: '150px',
          scopedSlots: {customRender: 'extractmethod'},
        });
      // }
      scorllLength += 150;
      /** 检测结果 */
      clom.push({
        title: this.$t("checkResult"),
        dataIndex: 'checkresult',
        width: '150px',
        scopedSlots: {customRender: 'checkresult'},
      });
      scorllLength += 150;
      /** 检测备注 */
      clom.push({
        title: this.$t("checkRemarks"),
        dataIndex: 'checkremarks',
        width: '200px',
        scopedSlots: {customRender: 'checkremarks'},
      });
      scorllLength += 200;
      /** 检测员 */
      clom.push({
        title: this.$t("checkUser"),
        dataIndex: 'checkuser',
        width: '150px',
        scopedSlots: {customRender: 'checkuser'},
      });
      scorllLength += 150;
      /** 审核人 */
      clom.push({
        title: this.$t("reviewer"),
        dataIndex: 'reviewer',
        width: '150px',
        scopedSlots: {customRender: 'reviewer'},
      });
      scorllLength += 150;
      /**建库类型*/
      clom.push({
        title: this.$t("databaseType"),
        dataIndex: 'databasetype',
        width: '200px',
        scopedSlots: {customRender: 'databasetype'},
      });
      scorllLength += 200;
      /**测序平台*/
      clom.push({
        title: this.$t("SequencingPlatform"),
        dataIndex: 'sequencingplatform',
        width: '200px',
        scopedSlots: {customRender: 'sequencingplatform'},
      });
      scorllLength += 200;
      /**剩余量*/
      clom.push({
        title: this.$t("remaining"),
        dataIndex: 'remaining',
        width: '200px',
        scopedSlots: {customRender: 'remaining'},
      });
      scorllLength += 200;
      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remarks',
        width: '200px',
        scopedSlots: {customRender: 'remarks'},
      });
      scorllLength += 200;
      /**上传*/
      clom.push({
        title: this.$t("upload"),
        dataIndex: 'upload',
        width: '200px',
        scopedSlots: {customRender: 'upload'},
      });
      scorllLength += 200;

      /**操作*/
      clom.push({
        title: this.$t("operation"),
        dataIndex: 'operation',
        width: '100px',
        fixed: 'right',
        scopedSlots: {customRender: 'operation'},
      });
      scorllLength += 100;

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
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
      if (!this.checkRowData(target)) {
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
      if (target.add == true) {
        this.editingKey = "";
        this.onDelete(target.key);
        return;
      }
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        target.editable = false;
        this.data = newData;
      }
    },
    checkRowData: function (rowData) {
      if (util.isNull(rowData.samplename)) {
        this.$message.error(this.$t("sampleName") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.selfnumber)) {
        this.$message.error(this.$t("sampleIndex") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.species)) {
        this.$message.error(this.$t("species") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.tissue)) {
        this.$message.error(this.$t("tissue") + this.$t("animal_stock_resource") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.testdate)) {
        util.$message.error(this.$t("testDate") + this.$t("not_null"));
        return false;
      }
      if (rowData.concentration < 0) {
        this.$message.error(this.$t("concentration") + this.$t("not_null"));
        return false;
      }
      if (rowData.samplevolume < 0) {
        this.$message.error(this.$t("sampleVolume") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "02" && util.isNull(rowData.remaining)) {
        this.$message.error(this.$t("remaining") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.checkresult)) {
        this.$message.error(this.$t("checkResult") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "02" && util.isNull(rowData.extractmethod)) {
        this.$message.error(this.$t("extractMethod") + this.$t("not_null"));
        return false;
      }
      if (rowData.totalNumber < 0) {
        this.$message.error(this.$t("totalNumber") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "03" && util.isNull(rowData.celllife)) {
        this.$message.error(this.$t("celllife") + this.$t("not_null"));
        return false;
      }
      if (this.process.sampletype == "03" && util.isNull(rowData.cellsort)) {
        this.$message.error(this.$t("cellsort") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.databasetype)) {
        this.$message.error(this.$t("databaseType") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.sequencingplatform)) {
        this.$message.error(this.$t("SequencingPlatform") + this.$t("not_null"));
        return false;
      }
      return true;
    },
    databaseTypes: function (type) {
      return util.databaseTypes(type);
    },
    isStop : function (record){
      if (record.currentstatu == "09"){
        return true;
      }
      return false;
    },
    showText: function (clo, text, ind) {
      if (clo == "samplemsg") {
        for (var index in this.sampletypes) {
          var item = this.sampletypes[index];
          if (item.key == text) {
            return item.val;
          }
        }
      }

      if (clo == "samplestatu") {
        for (var statuIndex in this.sampleStatu) {
          var statu = this.sampleStatu[statuIndex];
          if (statu.key == text) {
            return statu.val;
          }
        }
      }

      if (clo == "cellsort") {
        for (var cellSortIndex in this.cellSortMethods) {
          var cellSort = this.cellSortMethods[cellSortIndex];
          if (cellSort.key == text) {
            return cellSort.val;
          }
        }
      }

      if (clo == "databasetype") {
        for (var databaseTypeIndex in this.databaseTypes) {
          var databaseType = this.databaseTypes[databaseTypeIndex];
          if (databaseType.key == text) {
            return databaseType.val;
          }
        }
      }

      if (clo == "sequencingplatform") {
        for (var seqPlantsIndex in this.seqPlants) {
          var seqPlant = this.seqPlants[seqPlantsIndex];
          if (seqPlant.key == text) {
            return seqPlant.val;
          }
        }
      }

      if (clo == "checkuser" || clo == "reviewer") {
        for (var userIndex in this.allUsers) {
          var user = this.allUsers[userIndex];
          if (user.id == text) {
            return user.name;
          }
        }
      }

      if (clo == "extractmethod") {
        for (var extractIndex in this.extractmethods) {
          var extract = this.extractmethods[extractIndex];
          if (extract.key == text) {
            return extract.val;
          }
        }
      }

      if (clo == "checkresult") {
        for (var checkresultIndex in this.checkresults) {
          var checkresult = this.checkresults[checkresultIndex];
          if (checkresult.key == text) {
            return checkresult.val;
          }
        }
      }

      if (clo == "testdate") {
        if (util.isNull(text)) {
          return "";
        }
        return formatDate(new Date(text), "yyyy-MM-dd");
      }

      if (clo == "index") {
        return ind + 1;
      }
      return text;
    },
    uploadHeader : function (record){
      return {token:this.$cookies.get('token'),make:record.id}
    },
  },
  computed: {
    concentrationName: function () {
      if (this.process.sampletype == "01") {
        return this.$t("concentration") + "(ng/ul)";
      } else {
        return this.$t("concentration") + "(" + this.$t("cellNumber") + "/μl)";
      }
    },
    totalNumberTitle: function () {
      if (this.process.sampletype == "01") {
        return this.$t("nucleicAcid") + this.$t("totalNumber") + "(ug)";
      } else {
        return this.$t("cell") + this.$t("totalNumber") + "(" + this.$t("cellNumber") + ")";
      }
    },
    cellSortMethods: function () {
      return util.cellSortMethods();
    },

    seqPlants: function () {
      return util.seqPlants();
    },
    extractmethods: function () {
      return util.extractmethods();
    },
    checkresults: function () {
      return util.checkresults();
    },
    sampleInits : function (){
      return util.sampleInits();
    },
    canOperating: function () {
      if (this.process.taskstatu != "20") {
        return false;
      }
      if (this.$store.getters.getUser.id != this.process.samplepreparation) {
        return false;
      }
      return true;
    },
    canEdit: function () {
      if (
          !this.$store.getters.isCurrentUser(this.process.samplepreparation)
          && !this.$store.getters.isAdmin
      ) {
        return false;
      }
      return true;
    },

    uploadUrl : function (){
      return this.$axios.defaults.baseURL + '/file/import/makeUpload';
    }
  },
  watch: {
    process: {
      handler: function () {
        // console.log(newVal)
        this.initPage();
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>