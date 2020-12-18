<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('libraryPreparation')"
        :sub-title="process.projectname"
    >
      <template slot="extra">
        <a-upload
            name="file"
            v-if="isEnd"
            :action="uploadAllUrl"
            :multiple="true"
            :headers="allUploadHeader"
            :showUploadList="false"
            @change="handleUploadChange"
            :disabled="disabledUpload"
        >
          <a-button :disabled="disabledUpload">
            <a-icon type="upload"/>
            {{ $t("upload") }}
          </a-button>
        </a-upload>
        <a-button type="danger" @click="batchUnPass()" v-if="canPase" :disabled="disabledPass">
          {{ $t("unPass") }}
        </a-button>
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
            {{ $t("delete") }}
          </a-button>
        </a-popconfirm>
        <a-button type="primary" @click="submitData('complete')"
                  v-if="isEnd"
                  :disabled="canComplete">
          {{ $t("submit") }}
        </a-button>

        <a-button @click="subTaskInfo" v-if="isEnd"
                  :disabled="canDivide" type="primary">
          {{ $t("divide") }}
        </a-button>

        <a-button type="primary" @click="submitData('real')" v-if="canPase"
                  :disabled="cansubmit">
          {{ $t("uploadConfirm") }}
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
        <a-tooltip>
          <a-tag class="pointer" color="#87d068" @click="showSubTask('03')">
            {{ $t("allAllow") + "(" + createrName + ")"}}
          </a-tag>
          <a-tag class="pointer" color="#108ee9" @click="showSubTask('02')">
            {{ $t("notAllow") + "(" + createrName + ")"}}
          </a-tag>
          <a-tag class="pointer" color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
            {{ sub.name }}
          </a-tag>
          <a-tag class="pointer" color="#f50" @click="showSubTask('00')">
            {{ $t("init") + "(" + operatorName + ")"}}
          </a-tag>
          <template slot="title">
            {{$t("process.tagListTip")}}
          </template>
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll"
             :row-selection="rowSelection"
             :pagination="false"
             size="middle">
      <!--   自定义列名 开始   -->
      <template slot="createdbtimeTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("createdbtime")}}
      </template>

      <template slot="useNumberTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("useNumber")}}
      </template>

      <template slot="partsizeTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("partsize")}}
      </template>

      <template slot="indexTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{"index"}}
      </template>

      <template slot="cyclenumberTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("cyclenumber")}}
      </template>

      <template slot="databasetype2Title">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("databasetype2")}}
      </template>

      <template slot="databaseindexTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("databaseindex")}}
      </template>

      <template slot="createdbuserTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("createdbuser")}}
      </template>

      <template slot="reviewerTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("reviewer")}}
      </template>

      <template slot="qbitTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("qbit") + "(ng/ul)"}}
      </template>

      <template slot="libsizeTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("libsize")}}
      </template>

      <template slot="seqmethodsTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("SequencingPlatform")}}
      </template>

      <template slot="uploadsizeTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("uploadsize")}}
      </template>

      <template slot="databaseunitTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("databaseunit")}}
      </template>

      <template slot="operationTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.operationTip")}}
          </template>
          {{$t("operation")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <!--   自定义列名 结束   -->
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
                         :disabled="isStop(record) || isDisabled(col,record)"
                         @change="e => handleChange(e.target.value, record.key, col)"
                         v-model="record.createdbtime"/>

          <a-input v-else-if="col == 'concentration'"
                   :disabled="isStop(record)|| isDisabled(col,record)"
                   v-model="record.concentration"
          >
            <a-select slot="addonAfter" default-value="ng/ul"
                      v-model="record.concentrationunit"
                      :disabled="isStop(record)|| isDisabled(col,record)"
                      style="width:130px">
              <a-select-option value="ng/ul">
                ng/ul
              </a-select-option>
              <a-select-option value="细胞个数/μl">
                细胞个数/μl
              </a-select-option>
            </a-select>
          </a-input>
<!--          &lt;!&ndash; 浓度(ng/ul)/（细胞个数/μl) &ndash;&gt;-->
<!--          <a-input-number-->
<!--              v-else-if="col == 'concentration'"-->
<!--              style="width: 100%"-->
<!--              :disabled="isStop(record)|| isDisabled(col,record)"-->
<!--              v-model="record.concentration"-->
<!--              :min="0"-->
<!--              @change="e => handleChange(e.target.value, record.key, col)"-->
<!--          />-->
          <!-- 核酸/细胞总量（ug/细胞个数） -->
          <a-input-number
              v-else-if="col == 'totalnumber'"
              :disabled="isStop(record)|| isDisabled(col,record)"
              style="width: 100%"
              v-model="record.totalnumber"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 样本使用量(ug)/细胞使用量（细胞个数） -->
          <a-input-number
              v-else-if="col == 'usenumber'"
              :disabled="isStop(record)|| isDisabled(col,record)"
              style="width: 100%"
              v-model="record.usenumber"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
<!--          &lt;!&ndash; 片段大小（bp） &ndash;&gt;-->
<!--          <a-input-number-->
<!--              v-else-if="col == 'partsize'"-->
<!--              :disabled="isStop(record)|| isDisabled(col,record)"-->
<!--              style="width: 100%"-->
<!--              v-model="record.partsize"-->
<!--              :min="0"-->
<!--              @change="e => handleChange(e.target.value, record.key, col)"-->
<!--          />-->
          <!-- 常规PCR循环数 -->
          <a-input-number
              v-else-if="col == 'cyclenumber'"
              :disabled="isStop(record)|| isDisabled(col,record)"
              style="width: 100%"
              v-model="record.cyclenumber"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 测序平台 -->
          <a-select style="width: 100%" v-else-if="col == 'seqmethods'"
                    v-model="record.seqmethods"
                    :disabled="isStop(record)|| isDisabled(col,record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 上机数据量 -->
          <a-input-number
              v-else-if="col == 'uploadsize'"
              :disabled="isStop(record) || isDisabled(col,record)"
              style="width: 100%"
              v-model="record.uploadsize"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 文库体积（ul） -->
          <a-input-number
              v-else-if="col == 'libsize'"
              :disabled="isStop(record)|| isDisabled(col,record)"
              style="width: 100%"
              v-model="record.libsize"
              :min="0"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <!-- 建库人 -->
          <a-select style="width: 100%" v-else-if="col == 'createdbuser'"
                    :disabled="isStop(record)|| isDisabled(col,record)"
                    v-model="record.createdbuser"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <!-- 审核人 -->
          <a-select style="width: 100%" v-else-if="col == 'reviewer'"
                    :disabled="isStop(record)|| isDisabled(col,record)"
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
                :disabled="isStop(record)|| isDisabled(col,record)"
                :headers="uploadHeader(record)"
                :action="uploadUrl"
                :showUploadList="false"
                @change="handleUploadChange"
            >
              <a-button :disabled="isStop(record)|| isDisabled(col,record)">
                <a-icon type="upload"/>
                {{ $t("upload") }}
              </a-button>
            </a-upload>
          </div>
          <!-- 建库类型 -->
          <a-select style="width: 100%" v-else-if="col == 'databasetype'"
                    :disabled="isStop(record)|| isDisabled(col,record)"
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
              :disabled="isStop(record) || isDisabled(col,record)"
              v-model="record[col]"
              @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ showText(col, text, index) }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">

        <div class="editable-row-operations">
          <span>
            <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" v-if="record.currentstatu == '03'"/>
            <a-icon type="clock-circle" theme="twoTone" two-tone-color="#FFCC00" v-if="record.currentstatu == '02'"/>
            <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" v-if="record.currentstatu == '07'"/>
            <a-icon type="stop" theme="twoTone" two-tone-color="#CC0000" v-if="record.currentstatu == '09'"/>
          </span>
          <span v-if="record.currentstatu == '03'">
            &nbsp;
            <a-badge :count="record.libNum">
              <a @click="() => submitItem(record,'real')" :disabled="!canPase">{{ $t("uploadConfirm") }}</a>
            </a-badge>
            &nbsp;
          </span>
          <span v-if="record.currentstatu == '02'">
            &nbsp;
            <a @click="passItem(record,true)" :disabled="!canPase">{{ $t("pass") }}</a>
            &nbsp;
            <a @click="passItem(record,false)" :disabled="!canPase">{{ $t("unPass") }}</a>
            &nbsp;
          </span>
          <a @click="() => showReason(record.id)" v-if="isStop(record)">{{ $t("showReason") }}</a>
          <a @click="() => showStopAlert(record.id)" v-if="!isStop(record) && !isDisabled('operator',record)">{{ $t("stop") }}</a>
          &nbsp;
          <a-badge
              :count="showFileCount(record.id)"
              :number-style="{
                  backgroundColor: '#fff',
                  color: '#999',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                }"
          >
            <a @click="() => showFileList(record.id)">{{ "附件" }}</a>
          </a-badge>
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <refuse-alert :modal-title="$t('reason')" @confirmFun="stopProcess" ref="refuse"></refuse-alert>
    <show-filelist :detail-id="detailId" ref="showFilelist"></show-filelist>
    <sub-task-info @subTaskInfo="startProcess" ref="subTask"></sub-task-info>
    <refuse-alert :modal-title="$t('unPass')"
                  @confirmFun="unPassItem" ref="unPassAlert"></refuse-alert>
  </div>
</template>

<script>

import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";
import RefuseAlert from "@/components/publib/refuseAlert";
import ShowFilelist from "@/components/publib/showFilelist";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";
import {Icon} from "ant-design-vue";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});

export default {
  name: "processStep3",
  components: {SubTaskInfo, ShowFilelist, RefuseAlert, Submitting,IconFont},
  props: {
    process: Object,
    statu : String
  },
  data: function () {
    this.cacheData = [];
    return {
      tableLoad: false,
      data: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500, y: 600},
      editingKey: '',
      allUsers: [],
      selectedRowKeys: [],
      selectedRows: [],
      subtask: {},
      subs: [],
      detailId: "",
      stopId: "",
      curFlag: "",
      subId: "00",
      subProcessName: "",
      remarks: "",
      operators : undefined,
      fileCounts : {}
    }
  },
  beforeMount() {
    this.subId = this.statu;
    this.initPage();
  },
  methods: {
    getFileCount: function (ids) {
      var postData = {
        idsStr: JSON.stringify(ids)
      }
      var _this = this;
      this.$axios.post("/file/getFileCount", postData).then(function (res) {
        if (res.data.code == "200") {
          _this.fileCounts = res.data.retMap.fileCounts;
        }
      });
    },
    showFileCount :function (id){
      return this.fileCounts[id];
    },
    submitItem: function (record,flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.submitData(flag);
    },
    unPassItem: function (reason, remark) {
      var _this = this;
      var postData = {
        processId: this.process.id,
        subId: this.subId,
        datas: JSON.stringify(this.selectedRows),
        type: "unPass",
        subProcessName: this.subProcessName,
        remarks: this.remarks,
        reason: reason,
        remark: remark
      }
      this.$(this.$refs.unPassAlert.$el).modal("hide");
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/unPassLibs", postData).then(function (res) {
        _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          console.log(res);
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    passItem: function (record, flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      if (flag) {
        this.submitData("pass");
      } else {
        this.$(this.$refs.unPassAlert.$el).modal("show");
      }
    },
    batchUnPass: function () {
      this.$(this.$refs.unPassAlert.$el).modal("show");
    },
    deleteByIds: function () {
      var _this = this;
      var postData = {
        ids: this.selectedRowKeys,
        type: "03"
      };
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/deleteByIds", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    isDisabled: function (col,record) {
      if (record.currentstatu == "02" && this.canPase &&
          (col == "seqmethods" || col == "uploadsize" || col == "databaseunit" || col == "uploadremark")
      ){
        return false;
      }
      if (!this.isEnd) {
        return true;
      }
      if (col == "samplename"
          || col == "selfnumber"
          || col == "species"
          || col == "tissue"){
        return true;
      }
      if (record.currentstatu == "01" &&
          (col == "seqmethods" || col == "uploadsize" || col == "databaseunit" || col == "uploadremark")
      ){
        return true;
      }
      if (record.currentstatu == "02"
          || record.currentstatu == "03"
          || record.currentstatu == "07"
      ) {
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
    startProcess: function (subProcessName, remarks) {
      this.$(this.$refs.subTask.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("divide");
    },
    subTaskInfo: function () {
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
      if (ret.file.status == "uploading") {
        this.$(this.$refs.submitting.$el).modal("show");
      } else {
        this.$(this.$refs.submitting.$el).modal("hide");
        if (ret.file.status == "error") {
          this.$message.error(this.$t("systemErr"));
        } else if (ret.file.status == "done") {
          this.initPage();
        }
      }
    },
    uploadHeader: function (record) {
      return {token: this.$cookies.get('token'), detailId: record.id}
    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        libIds: JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/task/process/downloadLibs", "文库制备.xls");
    },
    isStop: function (record) {
      if (record.currentstatu == "09"
          || record.currentstatu == "07"
      ) {
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
      this.$(this.$refs.refuse.$el).modal("show");
    },
    stopProcess: function (reason, remark) {
      this.$(this.$refs.refuse.$el).modal("hide");
      var postData = {
        libId: this.stopId,
        reason: reason,
        remark: remark
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/stopLib", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res) {
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
        subProcessName: this.subProcessName,
        remarks: this.remarks
      }
      if (type != "tmp") {
        postData.datas = JSON.stringify(this.selectedRows);
      }
      if (type == "complete"){
        if (!this.checkSubmitData(this.selectedRows)){
          return ;
        }
      }
      if (type == "pass"){
        if (!this.checkComfirmData(this.selectedRows)){
          return ;
        }
      }
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/tempSaveLib", postData).then(function (res) {
        _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          console.log(res);
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          if (type == "pass"){
            _this.$confirm({
              title: _this.$t("process.passTip") + _this.$t("uploadConfirm") + "?",
              content: _this.$t("process.passContextTip") + _this.$t("uploadConfirm"),
              onOk() {
                _this.submitData("real");
              },
              onCancel() {
                _this.initPage();
              },
              class: 'test',
            });
          }else {
            _this.initPage();
          }
        }
        _this.$emit("changeStatu","03");
      }).catch(function (res) {
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
            var ids = new Array();
            for (var ind in res.data.retMap.libs) {
              var lib = res.data.retMap.libs[ind];
              if (!util.isNull(lib.createdbtime)) {
                lib.createdbtime = formatDate(new Date(lib.createdbtime), "yyyy-MM-dd");
              }
              lib.key = lib.id;
              ids.push(lib.id);
              _this.data.push(lib);
            }
            _this.getFileCount(ids);
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
          _this.subs = res.data.retMap.subs;
          _this.operators = res.data.retMap.operators;
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initColumns: function () {
      var initLibsClom = util.initLibsClom();
      this.scroll.x = initLibsClom.scorllLength;
      var clom = initLibsClom.clom;
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
    checkComfirmData : function (list){
      for (var i = 0; i< list.length; i++){
        var rowData = list[i];
        if (util.isNull(rowData.seqmethods)) {
          this.$message.error( this.$t("seqmethods") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.uploadsize)) {
          this.$message.error( this.$t("uploadsize") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.databaseunit)) {
          this.$message.error( this.$t("databaseunit") + this.$t("not_null"));
          return false;
        }
      }
      return true;
    },
    checkSubmitData : function (list){
      for (var i = 0; i< list.length; i++){
        var rowData = list[i];
        if (util.isNull(rowData.createdbtime)) {
          this.$message.error( this.$t("createdbtime") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.usenumber)) {
          this.$message.error( this.$t("useNumber") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.partsize)) {
          this.$message.error( this.$t("partsize") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.libindex)) {
          this.$message.error( "index" + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.cyclenumber)) {
          this.$message.error( this.$t("cyclenumber") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.databasetype)) {
          this.$message.error( this.$t("databaseType") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.databaseindex)) {
          this.$message.error( this.$t("databaseindex") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.createdbuser)) {
          this.$message.error( this.$t("createdbuser") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.reviewer)) {
          this.$message.error( this.$t("reviewer") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.qbit)) {
          this.$message.error( this.$t("qbit") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(rowData.libsize)) {
          this.$message.error( this.$t("libsize") + this.$t("not_null"));
          return false;
        }
      }
      return true;
    },
    checkRowData: function (rowData) {
      if (util.isNull(rowData.createdbtime)) {
        this.$message.error( this.$t("createdbtime") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.selfnumber)) {
        this.$message.error( this.$t("sampleIndex") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.samplename)) {
        this.$message.error( this.$t("sampleName") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.species)) {
        this.$message.error( this.$t("species") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.concentration)) {
        this.$message.error( this.$t("concentration") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.totalnumber)) {
        this.$message.error( this.$t("totalNumber") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.celllife)) {
        this.$message.error( this.$t("cellLife") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.usenumber)) {
        this.$message.error( this.$t("useNumber") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.partsize)) {
        this.$message.error( this.$t("partsize") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.libindex)) {
        this.$message.error( "index" + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.libbarcode)) {
        this.$message.error( "libbarcode" + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.cyclenumber)) {
        this.$message.error( this.$t("cyclenumber") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.databasetype)) {
        this.$message.error( this.$t("databaseType") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.databaseindex)) {
        this.$message.error( this.$t("databaseindex") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.createdbuser)) {
        this.$message.error( this.$t("createdbuser") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.reviewer)) {
        this.$message.error( this.$t("reviewer") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.qbit)) {
        this.$message.error( this.$t("qbit") + this.$t("not_null"));
        return false;
      }
      if (util.isNull(rowData.libsize)) {
        this.$message.error( this.$t("libsize") + this.$t("not_null"));
        return false;
      }
      // if (util.isNull(rowData.seqmethods)) {
      //   this.$message.error( this.$t("seqmethods") + this.$t("not_null"));
      //   return false;
      // }
      // if (util.isNull(rowData.uploadsize)) {
      //   this.$message.error( this.$t("uploadsize") + this.$t("not_null"));
      //   return false;
      // }
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
    seqPlants: function () {
      return util.seqPlants();
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
    cansubmit() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu != '03') {
          return true;
        }
      }
      return false;
    },
    canDivide() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (!util.isNull(this.selectedRows[item].subid)
            || this.selectedRows[item].currentstatu == "02" || this.selectedRows[item].currentstatu == '03') {
          return true;
        }
      }
      return false;
    },
    canComplete() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu == '02'
            || this.selectedRows[item].currentstatu == '03'
            || this.selectedRows[item].currentstatu == '07'
            || this.selectedRows[item].currentstatu == '09'
        ) {
          return true;
        }
      }
      return false;
    },
    isEnd: function () {
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.librarypreparation)
      ) {
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
            disabled: record.currentstatu == "09" || record.currentstatu == "07",
          },
        }),
      };
    },
    canPase: function () {
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.creater)
      ) {
        return true
      }
      return false;
    },
    disabledPass() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu != '02') {
          return true;
        }
      }
      return false;
    },
    createrName : function (){
      if (this.operators === undefined){
        return '';
      }
      return this.operators.creater.name;
    },
    operatorName : function (){
      if (this.operators === undefined){
        return '';
      }
      return this.operators.lib.name;
    },
    disabledUpload() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu != '01') {
          return true;
        }
      }
      return false;
    },
    allUploadHeader : function (){
      return {token: this.$cookies.get('token'), idsStr: JSON.stringify(this.selectedRowKeys)}
    },
    uploadAllUrl: function () {
      return this.$axios.defaults.baseURL + 'file/import/uploadAll';
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
    statu (newVal){
      this.subId = newVal;
      this.initPage();
    }

  }

}
</script>

<style scoped>

</style>