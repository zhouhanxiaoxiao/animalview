<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('libraryPreparation')"
        :sub-title="process.projectname"
    >
      <template slot="extra">
        <a-button type="primary" @click="submitData('pass')"
                  v-if="canPase" :disabled="disabledPass">
          {{ $t("pass") }}
        </a-button>
        <a-popconfirm placement="topLeft"
                      :ok-text="$t('yes')"
                      :disabled="selectedRows.length == 0"
                      :cancel-text="$t('no')"
                      v-if="isEnd"
                      @confirm="deleteByIds">
          <template slot="title">
            <p>{{ $t("areyousureDelete") }}</p>
          </template>
          <a-button :disabled="canComplete" type="danger">
            {{$t("delete")}}
          </a-button>
        </a-popconfirm>
        <a-button type="primary" @click="submitData('complete')"
                  v-if="isEnd"
                  :disabled="canComplete">
          {{ $t("complete") }}
        </a-button>

        <a-button @click="subTaskInfo" v-if="isEnd"
                  :disabled="canDivide" type="primary">
          {{$t("divide")}}
        </a-button>

        <a-button type="primary" @click="submitData('real')" v-if="isEnd"
                  :disabled="cansubmit">
          {{ $t("dismountData") }}
        </a-button>

        <a-button @click="submitData('tmp')" v-if="isEnd">
          {{ $t("tmpSave") }}
        </a-button>

        <a-button icon="download" @click="downLoad" :disabled="this.selectedRowKeys.length == 0">
          {{ $t("outPut") }}
        </a-button>

        <a-upload
            name="file"
            v-if="isEnd"
            accept=".xls,.xlsx"
            :show-upload-list="false"
            :headers="{token:this.$cookies.get('token'), processId : this.process.id}"
            @change="handleUploadChange"
            :action="this.$axios.defaults.baseURL + '/file/import/libImport'"
        >
          <a-button>
            <a-icon type="upload"/>
            {{ $t("input") }}
          </a-button>
        </a-upload>

      </template>
      <a-row type="flex">
        <a-row type="flex">
          <a-tag class="pointer" color="pink" @click="showSubTask('03')">
            {{ $t("allcomplete") + $t("allAllow") }}
          </a-tag>
          <a-tag class="pointer" color="pink" @click="showSubTask('02')">
            {{ $t("allcomplete") + $t("notAllow") }}
          </a-tag>
          <a-tag class="pointer" color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
            {{ sub.name }}
          </a-tag>
          <a-tag class="pointer" color="#108ee9" @click="showSubTask('00')">
            {{ $t("init") }}
          </a-tag>
        </a-row>
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
          slot-scope="text, record, index"
      >
        <div :key="col">
          <!--          <template v-if="record.editable">-->
          <!-- 建库时间 -->
          <a-date-picker v-if="col == 'createdbtime'"
                         format="YYYY-MM-DD"
                         :disabled="isStop(record) || isDisabled(record)"
                         @change="e => handleChange(e.target.value, record.key, col)"
                         v-model="record.createdbtime"/>
          <!-- 浓度(ng/ul)/（细胞个数/μl) -->
          <a-input-number
              v-else-if="col == 'concentration'"
              style="width: 100%"
              :disabled="isStop(record)|| isDisabled(record)"
              v-model="record.concentration"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 核酸/细胞总量（ug/细胞个数） -->
          <a-input-number
              v-else-if="col == 'totalnumber'"
              :disabled="isStop(record)|| isDisabled(record)"
              style="width: 100%"
              v-model="record.totalnumber"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 样本使用量(ug)/细胞使用量（细胞个数） -->
          <a-input-number
              v-else-if="col == 'usenumber'"
              :disabled="isStop(record)|| isDisabled(record)"
              style="width: 100%"
              v-model="record.usenumber"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 片段大小（bp） -->
          <a-input-number
              v-else-if="col == 'partsize'"
              :disabled="isStop(record)|| isDisabled(record)"
              style="width: 100%"
              v-model="record.partsize"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 常规PCR循环数 -->
          <a-input-number
              v-else-if="col == 'cyclenumber'"
              :disabled="isStop(record)|| isDisabled(record)"
              style="width: 100%"
              v-model="record.cyclenumber"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 上机数据量 -->
          <a-input-number
              v-else-if="col == 'uploadsize'"
              :disabled="isStop(record) || isDisabled(record)"
              style="width: 100%"
              v-model="record.uploadsize"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 文库体积（ul） -->
          <a-input-number
              v-else-if="col == 'libsize'"
              :disabled="isStop(record)|| isDisabled(record)"
              style="width: 100%"
              v-model="record.libsize"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 建库人 -->
          <a-select style="width: 100%" v-else-if="col == 'createdbuser'"
                    :disabled="isStop(record)|| isDisabled(record)"
                    v-model="record.createdbuser"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 审核人 -->
          <a-select style="width: 100%" v-else-if="col == 'reviewer'"
                    :disabled="isStop(record)|| isDisabled(record)"
                    v-model="record.reviewer"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 上传附件 -->
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
              <a-button :disabled="isStop(record)|| isDisabled(record)">
                <a-icon type="upload"/>
                {{ $t("upload") }}
              </a-button>
            </a-upload>
          </div>
          <!-- 建库类型 -->
          <a-select style="width: 100%" v-else-if="col == 'databasetype'"
                    :disabled="isStop(record)|| isDisabled(record)"
                    v-model="record.databasetype"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in databaseTypes(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 序号 -->
          <a-input
              v-else-if="col != 'index'"
              style="margin: -5px 0"
              :value="text"
              :disabled="isStop(record) || isDisabled(record)"
              v-model="record[col]"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ showText(col, text, index) }}
          </template>
          <!--          </template>-->
          <!--          <template v-else>-->
          <!--            {{ showText(col,text,index) }}-->
          <!--          </template>-->
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <a @click="() => showReason(record.id)" v-if="isStop(record)">{{ $t("showReason") }}</a>
          <a @click="() => showStopAlert(record.id)" v-if="!isStop(record) && !isDisabled(record)">{{ $t("stop") }}</a>
          &nbsp;<a @click="() => showFileList(record.id)">{{ "查看附件" }}</a>
          <!--        <span v-if="record.editable">-->
          <!--          <a @click="() => save(record.key)">{{$t("save")}}</a>-->
          <!--           &nbsp;-->
          <!--          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">-->
          <!--            <a>{{$t("cancel")}}</a>-->
          <!--          </a-popconfirm>-->
          <!--        </span>-->
          <!--          <span v-else>-->
          <!--          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{$t("edit")}}</a>-->
          <!--          &nbsp;-->
          <!--            <a-popconfirm-->
          <!--                v-if="data.length>1"-->
          <!--                title="Sure to delete?"-->
          <!--                @confirm="() => onDelete(record.key)"-->
          <!--            >-->
          <!--          <a :disabled="editingKey !== ''">{{$t("delete")}}</a>-->
          <!--        </a-popconfirm>-->
          <!--        </span>-->
        </div>
      </template>
    </a-table>
    <!--    <div class="modal-footer" v-if="this.canOperating">-->
    <!--      <button type="button" class="btn btn-warning"-->
    <!--              :disabled="editingKey !== ''" @click="submitData('tmp')">{{$t("tmpSave")}}</button>-->
    <!--      <button type="button" class="btn btn-primary"-->
    <!--              :disabled="editingKey !== ''" @click="submitData('real')">{{$t("submit")}}</button>-->
    <!--    </div>-->
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <refuse-alert :modal-title="$t('reason')" @confirmFun="stopProcess" ref="refuse"></refuse-alert>
    <show-filelist :detail-id="detailId" ref="showFilelist"></show-filelist>
    <sub-task-info @subTaskInfo="startProcess" ref="subTask"></sub-task-info>
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
  name: "processStep3",
  components: {SubTaskInfo, ShowFilelist, RefuseAlert, Submitting},
  props: {
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
      selectedRowKeys: [],
      selectedRows: [],
      subtask: {},
      subs: [],
      detailId: "",
      stopId: "",
      curFlag : "",
      subId : "00",
      subProcessName : "",
      remarks : ""
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
        type : "03"
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
      if (!this.isEnd){
        return true;
      }
      if (record.currentstatu == "02" || record.currentstatu == "03"){
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
      this.$(this.$refs.subTask.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("divide");
    },
    subTaskInfo : function (){
      this.$(this.$refs.subTask.$el).modal("show");
    },
    showSubTask: function (subId) {
      // this.$router.push({name:"processDetail",query:{subId : subId}});
      this.subId = subId;
      this.initPage();
    },
    showAllChange: function () {
      this.initPage();
    },
    backToTotal: function () {
      this.$router.push({name: "processInit", query: {taskId: this.process.taskid}});
    },
    handleUploadChange: function (ret) {
      util.commonHandleUploadChange(ret);
    },
    uploadHeader: function (record) {
      return {token: this.$cookies.get('token'), detailId: record.id}
    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        libIds : JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/task/process/downloadLibs", "文库制备.xls");
    },
    isStop: function (record) {
      if (record.currentstatu == "09") {
        return true;
      }
      return false;
    },
    showFileList: function (detailId) {
      this.detailId = detailId;
      // this.$("#showFileList").modal("show");
      this.$(this.$refs.showFilelist.$el).modal("show");
    },
    showReason: function (makeId) {
      var _this = this;
      this.$axios.post("/task/process/showStopReason", {detailId: makeId}).then(function (res) {
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$error({
            title: _this.$t("reason"),
            content: res.data.retMap.reason
          });
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showStopAlert: function (libId) {
      this.stopId = libId;
      // this.$("#refuseAlert").modal("show");
      this.$(this.$refs.refuse.$el).modal("show");
    },
    stopProcess: function (reason, remark) {
      // this.$("#refuseAlert").modal("hide");
      this.$(this.$refs.refuse.$el).modal("hide");
      var postData = {
        libId: this.stopId,
        reason: reason,
        remark: remark
      }
      var _this = this;
      // this.$("#submitting").modal("show");
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/stopLib", postData).then(function (res) {
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res) {
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    databaseTypes: function (type) {
      return util.databaseTypes(type);
    },
    submitData: function (type) {
      var _this = this;
      var postData = {
        processId: this.process.id,
        subId: this.subId,
        datas: JSON.stringify(this.data),
        type: type,
        subProcessName : this.subProcessName,
        remarks: this.remarks
      }
      if (type != "tmp") {
        postData.datas = JSON.stringify(this.selectedRows);
      }
      // this.$("#submitting").modal("show");
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/tempSaveLib", postData).then(function (res) {
        _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          console.log(res);
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
          // window.location.reload();
        }
      }).catch(function (res) {
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initPage: function () {
      this.initColumns();
      var _this = this;
      var postData = {
        processId: this.process.id,
        subId: this.subId,
      }
      this.tableLoad = true;
      this.$axios.post("/task/process/libInit", postData).then(function (res) {
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.data = new Array();
          if (res.data.retMap.libs.length != 0) {
            for (var ind in res.data.retMap.libs) {
              var lib = res.data.retMap.libs[ind];
              if (!util.isNull(lib.createdbtime)) {
                lib.createdbtime = formatDate(new Date(lib.createdbtime), "yyyy-MM-dd");
              }
              lib.key = lib.id;
              _this.data.push(lib);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
          _this.subs = res.data.retMap.subs;
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
          // _this.subtask = res.data.retMap.subtask;
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initColumns: function () {
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
      /**建库时间*/
      clom.push({
        title: this.$t("createdbtime"),
        dataIndex: 'createdbtime',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createdbtime'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.createdbtime)){
            return false;
          }
          return record.createdbtime
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
        onFilter: (value, record) =>{
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
      /**中间产物编号*/
      clom.push({
        title: this.$t("middleIndex"),
        dataIndex: 'middleindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'middleindex'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.middleindex)){
            return false;
          }
          return record.middleindex
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
        onFilter: (value, record) =>{
          if (util.isNull(record.samplename)){
            return false;
          }
          return record.samplename
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
      /** 浓度(ng/ul)/（细胞个数/μl) */
      clom.push({
        title: this.concentrationName,
        dataIndex: 'concentration',
        width: '150px',
        scopedSlots: {customRender: 'concentration'},
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
      /** 细胞活性 */
      clom.push({
        title: this.$t("cellLife"),
        dataIndex: 'celllife',
        width: '150px',
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
      scorllLength += 150;
      /** 样本使用量(ug)/细胞使用量（细胞个数） */
      clom.push({
        title: this.$t("useNumber"),
        dataIndex: 'usenumber',
        width: '150px',
        scopedSlots: {customRender: 'usenumber'},
      });
      scorllLength += 150;
      /** 片段大小（bp） */
      clom.push({
        title: this.$t("partsize"),
        dataIndex: 'partsize',
        width: '150px',
        scopedSlots: {customRender: 'partsize'},

      });
      scorllLength += 150;
      /** index */
      clom.push({
        title: "index",
        dataIndex: 'libindex',
        width: '100px',
        scopedSlots: {customRender: 'libindex'},
      });
      scorllLength += 100;
      /** barcode */
      clom.push({
        title: "barcode",
        dataIndex: 'libbarcode',
        width: '100px',
        scopedSlots: {customRender: 'libbarcode'},
      });
      scorllLength += 100;
      /** 常规PCR循环数 */
      clom.push({
        title: this.$t("cyclenumber"),
        dataIndex: 'cyclenumber',
        width: '100px',
        scopedSlots: {customRender: 'cyclenumber'},
      });
      scorllLength += 100;
      /** 文库类型 */
      clom.push({
        title: this.$t("databasetype2"),
        dataIndex: 'databasetype',
        width: '200px',
        scopedSlots: {customRender: 'databasetype'},
      });
      scorllLength += 200;
      /** 文库编号 */
      clom.push({
        title: this.$t("databaseindex"),
        dataIndex: 'databaseindex',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'databaseindex'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.databaseindex)){
            return false;
          }
          return record.databaseindex
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
      scorllLength += 200;
      /** 建库人 */
      clom.push({
        title: this.$t("createdbuser"),
        dataIndex: 'createdbuser',
        width: '150px',
        scopedSlots: {customRender: 'createdbuser'},
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
      /** Qubit浓度 */
      clom.push({
        title: this.$t("qbit"),
        dataIndex: 'qbit',
        width: '150px',
        scopedSlots: {customRender: 'qbit'},
      });
      scorllLength += 150;
      /** 文库体积（ul） */
      clom.push({
        title: this.$t("libsize"),
        dataIndex: 'libsize',
        width: '150px',
        scopedSlots: {customRender: 'libsize'},
      });
      scorllLength += 150;
      /** 文库体积（ul） */
      clom.push({
        title: this.$t("seqmethods"),
        dataIndex: 'seqmethods',
        width: '150px',
        scopedSlots: {customRender: 'seqmethods'},
      });
      scorllLength += 150;
      /** 上机数据量 */
      clom.push({
        title: this.$t("uploadsize"),
        dataIndex: 'uploadsize',
        width: '150px',
        scopedSlots: {customRender: 'uploadsize'},
      });
      scorllLength += 150;
      /** 数据量单位 */
      clom.push({
        title: this.$t("databaseunit"),
        dataIndex: 'databaseunit',
        width: '150px',
        scopedSlots: {customRender: 'databaseunit'},
      });
      scorllLength += 150;
      /** 建库备注 */
      clom.push({
        title: this.$t("libremark"),
        dataIndex: 'libremark',
        width: '150px',
        scopedSlots: {customRender: 'libremark'},
      });
      scorllLength += 150;
      /** 上机备注 */
      clom.push({
        title: this.$t("uploadremark"),
        dataIndex: 'uploadremark',
        width: '150px',
        scopedSlots: {customRender: 'uploadremark'},
      });
      scorllLength += 150;
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
      // if (!this.checkRowData(target)){
      //   return;
      // }
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
    checkRowData: function (rowData, rowIndex) {
      var prefix = "第【" + rowIndex + "】行，";
      if (util.isNull(rowData.createdbtime)) {
        this.$message.error(prefix + this.$t("createdbtime") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.selfnumber)) {
        this.$message.error(prefix + this.$t("sampleIndex") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.samplename)) {
        this.$message.error(prefix + this.$t("sampleName") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.species)) {
        this.$message.error(prefix + this.$t("species") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.concentration)) {
        this.$message.error(prefix + this.$t("concentration") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.totalnumber)) {
        this.$message.error(prefix + this.$t("totalNumber") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.celllife)) {
        this.$message.error(prefix + this.$t("cellLife") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.usenumber)) {
        this.$message.error(prefix + this.$t("useNumber") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.partsize)) {
        this.$message.error(prefix + this.$t("partsize") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.libindex)) {
        this.$message.error(prefix + "index" + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.libbarcode)) {
        this.$message.error(prefix + "libbarcode" + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.cyclenumber)) {
        this.$message.error(prefix + this.$t("cyclenumber") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.databasetype)) {
        this.$message.error(prefix + this.$t("databaseType") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.databaseindex)) {
        this.$message.error(prefix + this.$t("databaseindex") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.createdbuser)) {
        this.$message.error(prefix + this.$t("createdbuser") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.reviewer)) {
        this.$message.error(prefix + this.$t("reviewer") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.qbit)) {
        this.$message.error(prefix + this.$t("qbit") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.libsize)) {
        this.$message.error(prefix + this.$t("libsize") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.seqmethods)) {
        this.$message.error(prefix + this.$t("seqmethods") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.uploadsize)) {
        this.$message.error(prefix + this.$t("uploadsize") + this.$t("not_null"));
        return false;
      }
      return true;
    },
    showText: function (clo, text, ind) {
      if (clo == "index") {
        return ind + 1;
      }
      if (clo == "createdbtime") {
        if (util.isNull(text)) {
          return "";
        }
        return formatDate(new Date(text), "yyyy-MM-dd");
      }
      if (clo == "createdbuser" || clo == "reviewer") {
        for (var userIndex in this.allUsers) {
          var user = this.allUsers[userIndex];
          if (user.id == text) {
            return user.name;
          }
        }
      }
      return text;
    },
  },
  computed: {
    uploadUrl: function () {
      return util.commonUploadUrl();
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
    canOperating: function () {
      if (this.process.taskstatu != "30") {
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.process.sampleinput)
          && !this.isAdmin
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
        if (this.selectedRows[item].currentstatu != '03'){
          return true;
        }
      }
      return false;
    },
    canDivide(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (!util.isNull(this.selectedRows[item].subid)
            || this.selectedRows[item].currentstatu == "02" || this.selectedRows[item].currentstatu == '03'){
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
        if (this.selectedRows[item].currentstatu == '02' || this.selectedRows[item].currentstatu == '03'){
          return true;
        }
      }
      return false;
    },
    isEnd : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.process.librarypreparation == this.$store.getters.getUser.id
      ){
        return true;
      }
      return false;
    },
    rowSelection() {
      const {selectedRowKeys, selectedRows} = this;
      return {
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows,
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
    canPase : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.process.creater == this.$store.getters.getUser.id
      ){
        return true
      }
      return false;
    },
    disabledPass(){
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
  },
  watch: {
    process: {
      handler: function () {
        // console.log(newVal)
        this.initPage();
      },
      deep: true
    },
  }

}
</script>

<style scoped>

</style>