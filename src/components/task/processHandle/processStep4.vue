<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :sub-title="process.projectname"
    >
      <template slot="title">
        <a-tooltip>
          <template slot="title">
            {{$t("process.beforeBioTip") + bioAnalysis.name + "(" + bioAnalysis.email + ")"}}
          </template>
          {{$t('dismountData')}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>
      <template slot="extra">
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
                      v-if="this.isEnd"
                      @confirm="deleteByIds">
          <template slot="title">
            <p>{{ $t("areyousureDelete") }}</p>
          </template>
          <a-button :disabled="canComplete" type="danger">
            {{$t("delete")}}
          </a-button>
        </a-popconfirm>
        <a-button @click="subTaskInfo" v-if="this.isEnd"
                  :disabled="canDivide" type="primary">
          {{$t("divide")}}
        </a-button>
        <a-button type="primary" @click="submitData('complete')" v-if="this.isEnd"
                  :disabled="canComplete">
          {{ $t("submit") }}
        </a-button>
        <a-button type="primary" @click="submitData('real')" v-if="canPase"
                  :disabled="cansubmit">
          {{ $t("bioinformaticsAnalysis") }}
        </a-button>
        <a-button @click="submitData('tmp')" v-if="this.isEnd">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button icon="download" @click="downLoad" :disabled="this.selectedRowKeys.length == 0">
          {{ $t("outPut") }}
        </a-button>
        <a-upload
            v-if="this.isEnd"
            name="file"
            accept=".xls,.xlsx"
            :show-upload-list="false"
            :headers="{token:this.$cookies.get('token'), processId : this.process.id}"
            @change="handleUploadChange"
            :action="this.$axios.defaults.baseURL + '/file/import/dismountImport'"
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
             :row-selection="rowSelection"
             :scroll="scroll"
             :pagination="false"
             size="middle">

      <template slot="operationTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.operationTip")}}
          </template>
          {{$t("operation")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <template slot="overDateTip">
        <a-tooltip>
          <template slot="title">
            {{$t("process.overDateTip")}}
          </template>
          {{$t("overDate")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

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
          <!-- 测序平台 -->
          <a-select style="width: 100%" v-if="col == 'sequencingplatform'"
                    v-model="record.sequencingplatform"
                    :disabled="isDisabled(col,record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>

          <!-- 过期时间 -->
          <a-date-picker v-else-if="col == 'lasttime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisabled(col,record)"
                         v-model="record.lasttime"/>
          <div v-else-if="col == 'datepath' && record.currentstatu != '01'">
            <a-tag @click="gotoDatapath(record.datepath)">
              {{ record.datepath }}
            </a-tag>
          </div>
          <!-- 序号 -->
          <a-input
              v-else-if="col != 'index'"
              style="margin: -5px 0"
              v-model="record[col]"
              :disabled="isDisabled(col,record)"
              :value="text"
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
          <span v-if="record.currentstatu == '01' || record.currentstatu == '00'">
            <a @click="submitItem(record,'complete')" :disabled="!isEnd">{{ $t("submit") }}</a>
            &nbsp;
            <a-popconfirm
                v-if="data.length>1"
                title="Sure to delete?"
                @confirm="deleteItem(record)"
                :disabled="!isEnd"
            >
              <a :disabled="!isEnd">{{ $t("delete") }}</a>
            </a-popconfirm>
          </span>
          <span v-if="record.currentstatu == '02'">
            <a @click="passItem(record,true)" :disabled="!canPase">{{ $t("pass") }}</a>
            &nbsp;
            <a @click="passItem(record,false)" :disabled="!canPase">{{ $t("unPass") }}</a>
          </span>
          <span v-if="record.currentstatu == '07'">
            &nbsp;
            <a @click="showReason(record.id)">{{ $t("showReason") }}</a>
            &nbsp;
          </span>
          <span v-if="record.currentstatu == '03'">
            &nbsp;
            <a-badge :count="record.bioNum">
            <a @click="() => submitItem(record,'real')" :disabled="!isEnd">{{ $t("bioinformaticsAnalysis") }}</a>
            </a-badge>
            &nbsp;
          </span>
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <sub-task-info ref="subTask" @subTaskInfo="startProcess"></sub-task-info>
    <refuse-alert :modal-title="$t('unPass')" ref="unPassAlert" @confirmFun="confirmFun"></refuse-alert>
  </div>
</template>

<script>
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";
import RefuseAlert from "@/components/publib/refuseAlert";
import {formatDate} from "@/components/publib/date";

export default {
  name: "processStep4",
  components: {RefuseAlert, SubTaskInfo, Submitting},
  props: {
    process: Object,
    statu :String,
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
      selectedRowKeys : [],
      selectedRows : [],
      subs :[],
      subtask: {},
      showAll : false,
      subProcessName : "",
      remarks : "",
      subId : "00",
      bioAnalysis : "",
      operators : undefined
    }
  },
  beforeMount() {
    this.subId = this.statu;
    this.initPage();
  },
  methods: {
    gotoDatapath : function (url){
      window.open(url);
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
    deleteItem : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.deleteByIds();
    },
    passItem : function (record,flag){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      if (flag){
        this.submitData("pass");
      }else {
        this.$(this.$refs.unPassAlert.$el).modal("show");
      }
    },
    submitItem: function (record,flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.submitData(flag);
    },
    confirmFun : function (reason,remark){
      this.$(this.$refs.unPassAlert.$el).modal("hide");
      var postData = {
        processId: this.process.id,
        datas: JSON.stringify(this.selectedRows),
        type: 'unPass',
        subProcessName : this.subProcessName,
        remarks : this.remarks,
        reason : reason,
        remark : remark
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/refuseDis", postData).then(function (res) {
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != 200) {
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
    batchUnPass : function (){
      this.$(this.$refs.unPassAlert.$el).modal("show");
    },
    deleteByIds : function (){
      var _this = this;
      var postData = {
        ids : this.selectedRowKeys,
        type : "04"
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
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    showSubTask: function (subId) {
      // this.$router.push({name:"processDetail",query:{subId : subId}});
      this.subId = subId;
      this.initPage();
    },
    subTaskInfo : function (){
      this.$(this.$refs.subTask.$el).modal("show");
    },
    startProcess : function (subProcessName,remarks){
      this.$(this.$refs.subTask.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("divide");
    },
    showAllChange : function (){
      this.initPage();
    },
    backToTotal : function (){
      this.$router.push({name:"processInit",query:{taskId:this.process.taskid}});
    },
    handleUploadChange: function (ret) {
      util.commonHandleUploadChange(ret);
    },
    isDisabled: function (col,record) {
      if (!this.isEnd){
        return true;
      }
      if (col == "sampleindex" || col == "samplename") {
        return true;
      }
      if (record == null){
        return false;
      }
      if (record.currentstatu == "02"
          || record.currentstatu == "03"
          || record.currentstatu == "07"
      ){
        return true;
      }
      return false;
    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        disIds : JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/task/process/downloadDismount", "数据交付.xls");
    },
    initPage: function () {
      this.initCols();
      var _this = this;
      var postData = {
        processId: this.process.id,
        subId : this.subId
      }
      this.tableLoad = true;
      this.$axios.post("/task/process/dismountInit", postData).then(function (res) {
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.data = new Array();
          if (res.data.retMap.datas.length != 0) {
            for (var ind in res.data.retMap.datas) {
              var d = res.data.retMap.datas[ind];
              d.key = d.id;
              if (!util.isNull(d.lasttime)) {
                d.lasttime = formatDate(new Date(d.lasttime), "yyyy-MM-dd");
              }
              _this.data.push(d);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
          // _this.subtask = res.data.retMap.subtask;
          _this.subs = res.data.retMap.subs;
          _this.operators = res.data.retMap.operators;
          _this.bioAnalysis = res.data.retMap.bioAnalysis;
          _this.selectedRowKeys = [];
          _this.selectedRows = [];
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols: function () {
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
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'sampleindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sampleindex'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.sampleindex)){
            return false;
          }
          return record.sampleindex
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

      // if (this.isJYZXZZ){
      //   /**供应商数据账号*/
      //   clom.push({
      //     title: this.$t("support") + this.$t("dateaccount"),
      //     dataIndex: 'superaccount',
      //     width: '150px',
      //     scopedSlots: {
      //       filterDropdown: 'filterDropdown',
      //       filterIcon: 'filterIcon',
      //       customRender: 'superaccount'
      //     },
      //     onFilter: (value, record) =>{
      //       if (util.isNull(record.superaccount)){
      //         return false;
      //       }
      //       return record.superaccount
      //           .toString()
      //           .toLowerCase()
      //           .includes(value.toLowerCase());
      //     },
      //     onFilterDropdownVisibleChange: visible => {
      //       if (visible) {
      //         setTimeout(() => {
      //           this.searchInput.focus();
      //         }, 0);
      //       }
      //     },
      //   });
      //   scorllLength += 150;
      //   /**供应商数据密码*/
      //   clom.push({
      //     title:this.$t("support") + this.$t("datepassword"),
      //     dataIndex: 'superpwd',
      //     width: '150px',
      //     scopedSlots: {customRender: 'superpwd'},
      //   });
      //   scorllLength += 150;
      //   /**供应商数据目录*/
      //   clom.push({
      //     title: this.$t("support") +this.$t("datepath"),
      //     dataIndex: 'superpath',
      //     width: '300px',
      //     scopedSlots: {
      //       filterDropdown: 'filterDropdown',
      //       filterIcon: 'filterIcon',
      //       customRender: 'superpath'
      //     },
      //     onFilter: (value, record) =>{
      //       if (util.isNull(record.superpath)){
      //         return false;
      //       }
      //       return record.superpath
      //           .toString()
      //           .toLowerCase()
      //           .includes(value.toLowerCase());
      //     },
      //     onFilterDropdownVisibleChange: visible => {
      //       if (visible) {
      //         setTimeout(() => {
      //           this.searchInput.focus();
      //         }, 0);
      //       }
      //     },
      //   });
      //   scorllLength += 300;
      // }

      /**数据账号*/
      clom.push({
        title: this.$t("dateaccount"),
        dataIndex: 'dateaccount',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dateaccount'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.dateaccount)){
            return false;
          }
          return record.dateaccount
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
      /**数据密码*/
      clom.push({
        title: this.$t("datepassword"),
        dataIndex: 'datepassword',
        width: '150px',
        scopedSlots: {customRender: 'datepassword'},
      });
      scorllLength += 150;
      /**数据目录*/
      clom.push({
        title: this.$t("datepath"),
        dataIndex: 'datepath',
        width: '400px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'datepath'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.datepath)){
            return false;
          }
          return record.datepath
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
      scorllLength += 400;
      /**测序平台*/
      clom.push({
        title: this.$t("SequencingPlatform"),
        dataIndex: 'sequencingplatform',
        width: '200px',
        scopedSlots: {customRender: 'sequencingplatform'},
      });
      scorllLength += 200;

      /**备注*/
      clom.push({
        // title: this.$t("overDate"),
        slots : {title : "overDateTip"},
        dataIndex: 'lasttime',
        width: '200px',
        scopedSlots: {customRender: 'lasttime'},
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

      /**操作*/
      clom.push({
        // title: this.$t("operation"),
        slots : {title : "operationTitle"},
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
    submitData: function (type) {
      // console.log(type);
      var postData = {
        processId: this.process.id,
        datas: JSON.stringify(this.data),
        type: type,
        subProcessName : this.subProcessName,
        remarks : this.remarks,
      }
      if (type != "tmp"){
        postData.datas = JSON.stringify(this.selectedRows)
      }
      var _this = this;
      // _this.$("#submitting").modal('show');
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/saveDismountData", postData).then(function (res) {
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        // _this.$("#submitting").modal('hide');
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          if (type == "pass"){
            _this.$confirm({
              title: _this.$t("process.passTip") + _this.$t("bioinformaticsAnalysis") + "?",
              content: _this.$t("process.passContextTip") + _this.$t("bioinformaticsAnalysis") + ";"
                  + _this.$t("process.beforeBioTip") + _this.bioAnalysis.name + "(" + _this.bioAnalysis.email + ")",
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
        _this.$emit("changeStatu","05");
      }).catch(function (res) {
        // _this.$("#submitting").modal('hide');
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showText: function (col, text, index) {
      console.log(col, text, index);
      if (col == "index") {
        return index + 1;
      }
      return text;
    }
  },
  computed: {
    seqPlants: function () {
      return util.seqPlants();
    },
    canDivide(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (!util.isNull(this.selectedRows[item].subid)
            || this.selectedRows[item].currentstatu == "02"
            || this.selectedRows[item].currentstatu == '03'
        ){
          return true;
        }
      }
      return false;
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
    canComplete(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (this.selectedRows[item].currentstatu == '02'
            || this.selectedRows[item].currentstatu == '03'
            || this.selectedRows[item].currentstatu == '07'
        ){
          return true;
        }
      }
      return false;
    },
    isEnd : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.dismountdata)
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
            disabled: record.currentstatu == "09" || record.currentstatu == "07",
          },
        }),
      };
    },
    canPase : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.creater)
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
    isJYZXZZ : function (){
      if (this.$store.getters.getUser.group.groupname == "基因组学中心"){
        return true;
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
      return this.operators.dis.name;
    }
  },
  watch: {
    process: {
      handler: function () {
        // console.log(newVal)
        this.initPage();
      },
      deep: true
    },
    statu(newVal){
      this.subId = newVal;
      this.initPage();
    }
  }
}
</script>

<style scoped>

</style>