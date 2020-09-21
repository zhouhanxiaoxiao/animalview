<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('samplePreparation')"
    >
      <template slot="extra">
        <a-popconfirm placement="topLeft"
                      :ok-text="$t('yes')"
                      :disabled="selectedRows.length == 0"
                      :cancel-text="$t('no')"
                      @confirm="deleteByIds">
          <template slot="title">
            <p>{{ $t("areyousureDelete") }}</p>
          </template>
          <a-button :disabled="canComplete" type="danger">
            {{$t("delete")}}
          </a-button>
        </a-popconfirm>
        <a-button type="primary" @click="subTaskInfo"
                  :disabled="canComplete">
          {{ $t("complete") }}
        </a-button>
        <a-button type="primary" @click="submitData('real')"
                  :disabled="cansubmit">
          {{ $t("submit") }}
        </a-button>
        <a-button @click="submitData('tmp')">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button icon="download" @click="downLoad">
          {{ $t("outPut") }}
        </a-button>
        <a-upload
            name="file"
            accept=".xls,.xlsx"
            :show-upload-list="false"
            :headers="{token:this.$cookies.get('token'), processId : this.process.id}"
            @change="handUploadChange"
            :action="this.$axios.defaults.baseURL + '/file/import/makeInput'"
        >
          <a-button><a-icon type="upload" />{{ $t("input") }}</a-button>
        </a-upload>
      </template>
      <a-row type="flex">
<!--        <a-tag color="pink" @click="showSubTask('01')">-->
<!--          {{ $t("showAll") }}-->
<!--        </a-tag>-->
        <a-tag color="pink" @click="showSubTask('02')">
          {{ $t("allcomplete") }}
        </a-tag>
        <a-tag color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
          {{ sub.name }}
        </a-tag>
        <a-tag color="#108ee9" @click="showSubTask('00')">
          {{ $t("init") }}
        </a-tag>
      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll"
             :row-selection="rowSelection"
             :pagination="false"
             size="middle">
      <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
      >
        <a-input
            v-ant-ref="c => (searchInput = c)"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block;"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          {{ $t("search") }}
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          {{ $t("reset") }}
        </a-button>
      </div>
      <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record,index"
      >
        <div :key="col">

          <!-- 细胞分选法 -->
          <a-select style="width: 100%" v-if="col == 'cellsort'"
                    v-model="record.cellsort"
                    :disabled="colIsDisabed(record,col) || isStop(record) || isDisabled(record)"
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
          <!-- 转化样本 -->
          <a-select  style="width: 100%" v-else-if="col == 'transform'"
                     v-model="record.transform"
                     :disabled="isStop(record) || !isTissu(record) || isDisabled(record)"

          >
            <a-select-option v-for="item in transformSamples" :key="item.key" :value="item.key">
              {{item.val}}
            </a-select-option>
          </a-select>
          <!-- 检测结果 -->
          <a-select style="width: 100%" v-else-if="col == 'checkresult'"
                    :disabled="isStop(record) || isDisabled(record)"
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
                    :disabled="isStop(record) || isDisabled(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 审核人 -->
          <a-select style="width: 100%" v-else-if="col == 'reviewer'"
                    v-model="record.reviewer"
                    :disabled="isStop(record) || isDisabled(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 提取方法 -->
          <a-select style="width: 100%" v-else-if="col == 'extractmethod'"
                    v-model="record.extractmethod"
                    :disabled="isStop(record) || isDisabled(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in extractmethods" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 检测日期 -->
          <a-date-picker v-else-if="col == 'testdate'"
                         format="YYYY-MM-DD"
                         :disabled="isStop(record) || isDisabled(record)"
                         @change="e => handleChange(e.target.value, record.key, col)"
                         v-model="record.testdate"/>
          <!-- 建库类型 -->
          <a-select style="width: 100%" v-else-if="col == 'databasetype'"
                    v-model="record.databasetype"
                    :disabled="isStop(record) || isDisabled(record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in databaseTypes(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 测序平台 -->
          <a-select style="width: 100%" v-else-if="col == 'sequencingplatform'"
                    v-model="record.sequencingplatform"
                    :disabled="isStop(record) || isDisabled(record)"
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
              :disabled="isStop(record)|| isDisabled(record)"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input-number
              v-else-if="col == 'concentration'"
              style="margin: -5px 0"
              v-model="record.concentration"
              :disabled="isStop(record)|| isDisabled(record)"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <a-input-number
              v-else-if="col == 'totalnumber'"
              style="margin: -5px 0"
              v-model="record.totalnumber"
              :disabled="isStop(record)|| isDisabled(record)"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <div v-else-if="col == 'upload'">
            <a-upload

                name="file"
                :multiple="true"
                :disabled="isStop(record)|| isDisabled(record)"
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
              :disabled="colIsDisabed(record,col) || isStop(record)|| isDisabled(record)"
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
          &nbsp;
          <a @click="() => showStopAlert(record.id)" v-if="!isStop(record) && !isDisabled(record)">{{ $t("stop") }}</a>
          <a @click="() => showFileList(record.id)" >{{ "查看附件" }}</a>

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
    <sub-task-info @subTaskInfo="startProcess" ref="thisSubTaskInfo"></sub-task-info>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <refuse-alert :modal-title="$t('reason')" @confirmFun="stopProcess" ref="refuseAlert"></refuse-alert>
    <show-filelist :detail-id="detailId" ref="showFilelist"></show-filelist>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";
import RefuseAlert from "@/components/publib/refuseAlert";
import ShowFilelist from "@/components/publib/showFilelist";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";

export default {
  name: "processStep2",
  components: {SubTaskInfo, ShowFilelist, RefuseAlert, Submitting},
  props: {
    taskId: String,
    process: Object,
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
      subs : [],
      selectedRowKeys : [],
      selectedRows : [],
      stopId : "",
      detailId : "",
      subTask : {},
      curFlag : "01",
      subProcessName : "",
      remarks : "",
      subId : "00"
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    deleteByIds : function (){
      var _this = this;
      var postData = {
        ids : this.selectedRowKeys,
        type : "02"
      };
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/deleteByIds",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    isDisabled : function (record){
      if (record.currentstatu == "02"){
        return true;
      }
      return false;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    startProcess : function (subProcessName,remarks){
      this.$(this.$refs.thisSubTaskInfo.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("complete");
    },
    subTaskInfo : function (){
      this.$(this.$refs.thisSubTaskInfo.$el).modal("show");
    },
    showSubTask : function (subId){
      // this.$router.push({name:"processDetail",query:{subId : subId}});
      this.subId = subId;
      this.initPage();
    },
    backToTotal : function (){
      this.$router.push({name:"processInit",query:{taskId:this.process.taskid}});
    },
    isTissu : function (record){
      if (record.initsample == "02"){
        return true;
      }
      return false;
    },
    handUploadChange : function (ret){
      console.log(ret);
      if (ret.file.status == "uploading"){
        this.$(this.$refs.submitting.$el).modal("show");
      }else {
        this.$(this.$refs.submitting.$el).modal("hide");
        if (ret.file.status == "error"){
          this.$message.error(this.$t("systemErr"));
        }else if (ret.file.status == "done"){
          this.$message.success(this.$t("commitSucc"));
          this.initPage();
        }
      }
    },
    downLoad : function (){
      var postData = {
        processId : this.process.id
      }
      util.downLoad(postData,"/task/process/downloadMakes","样品制备.xls");
    },
    showFileList : function (detailId){
      console.log(detailId);
      this.detailId = detailId;
      this.$(this.$refs.showFilelist.$el).modal("show");
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
      this.$(this.$refs.refuseAlert.$el).modal("show");
    },
    stopProcess : function (reason,remark){
      this.$("#refuseAlert").modal("hide");
      var postData = {
        makeId : this.stopId,
        reason : reason,
        remark : remark
      }
      var _this = this;
      // this.$("#submitting").modal("show");
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/stopMake",postData).then(function (res){
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
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
    colIsDisabed : function (record,col){
      var sampleType = record.initsample;
      var trans = record.transform;
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
          && sampleType != "03" && trans != '03'
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
        subId : this.subId,
        processId: this.process.id,
        data: JSON.stringify(this.data),
        flag: flag,
        subProcessName : this.subProcessName,
        remarks : this.remarks
      }
      if (flag != "tmp"){
        postData.data = JSON.stringify(this.selectedRows);
      }
      var _this = this;
      // this.$("#submitting").modal("show");
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/submitMakes", postData).then(function (res) {
        console.log(res);
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.value = "";
          _this.selectedRowKeys = [];
          _this.selectedRows = [];
          _this.initPage();
          // window.location.reload();
        }
      }).catch(function (res) {
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initPage: function () {
      this.initColumns(this.process.sampletype);
      var _this = this;
      if (util.isNull(this.process.id)) {
        return;
      }
      var postData = {
        processId: this.process.id,
        subId: this.subId,
        curFlag : this.curFlag
      }
      this.tableLoad = true;
      this.$axios.post("/task/process/makeInit", postData).then(function (res) {
        console.log(res);
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.data = new Array();
          if (res.data.retMap.makes.length != 0) {
            for (var ind in res.data.retMap.makes) {
              var make = res.data.retMap.makes[ind];
              make.testdate = formatDate(new Date(make.testdate),"yyyy-MM-dd");
              make.key = make.id;
              _this.data.push(make);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
          // _this.subTask = res.data.retMap.subtask;
          _this.subs = res.data.retMap.subs;
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
        }
      }).catch(function (res) {
        _this.tableLoad = false;
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
      /**转化样本*/
      clom.push({
        title: this.$t("transformSample"),
        dataIndex: 'transform',
        width: '150px',
        scopedSlots: { customRender: 'transform' },
      });
      scorllLength +=150;
      /**样本名称*/
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'samplename'
        },
        onFilter: (value, record) =>
            record.samplename
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'selfnumber',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'selfnumber'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.selfnumber)){
            return false;
          }
          return record.selfnumber
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;
      /**样本衍生编号*/
      clom.push({
        title: this.$t("derivativeindex"),
        dataIndex: 'derivativeindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'derivativeindex'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.derivativeindex)){
            return false;
          }
          return record.derivativeindex
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;
      /**物种*/
      clom.push({
        title: this.$t("species"),
        dataIndex: 'species',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'species'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.species)){
            return false;
          }
          return record.species
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;
      /**组织来源*/
      clom.push({
        title: this.$t("tissue") + this.$t("animal_stock_resource"),
        dataIndex: 'tissue',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'tissue'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.tissue)){
            return false;
          }
          return record.tissue
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;
      /**检测日期*/
      clom.push({
        title: this.$t("testDate"),
        dataIndex: 'testdate',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'testdate'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.testdate)){
            return false;
          }
          return record.testdate
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
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
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'celllife'
          },
          onFilter: (value, record) =>{
            if (util.isNull(record.celllife)){
              return false;
            }
            return record.celllife
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
          },
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
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
        width: '150px',
        fixed: 'right',
        scopedSlots: {customRender: 'operation'},
      });
      scorllLength += 150;

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
    rowSelection() {
      const { selectedRowKeys,selectedRows } = this;
      return {
        selectedRowKeys : selectedRowKeys,
        selectedRows : selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: record => ({
          props: {
            // Column configuration not to be checked
            disabled: record.currentstatu == "09",
          },
        }),
      };
    },
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
    transformSamples : function (){
      var arr = new Array();
      for (var i=0;i<this.sampleInits.length;i++){
        if (this.sampleInits[i].key != "02"){
          arr.push(this.sampleInits[i]);
        }
      }
      return arr;
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
    cansubmit(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (this.selectedRows[item].currentstatu != '02'){
          return true;
        }
      }
      return false;
    },
    canComplete(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (this.selectedRows[item].currentstatu == '02'){
          return true;
        }
      }
      return false;
    },
    uploadUrl : function (){
      return this.$axios.defaults.baseURL + '/file/import/makeUpload';
    },
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