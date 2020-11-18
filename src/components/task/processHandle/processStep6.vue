<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :sub-title="process.projectname"
    >
      <template slot="title">
          {{$t('uploadConfirm')}}
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
          {{ $t("dismountData") }}
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
            :action="this.$axios.defaults.baseURL + '/file/import/confirmsImport'"
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
            {{ $t("allAllow")  + "(" + operators.creater.name + ")"}}
          </a-tag>
          <a-tag class="pointer" color="#108ee9" @click="showSubTask('02')">
            {{ $t("submitted")  + "(" + operators.creater.name + ")"}}
          </a-tag>
          <a-tag class="pointer" color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
            {{ sub.name }}
          </a-tag>
          <a-tag class="pointer" color="#f50" @click="showSubTask('00')">
            {{ $t("init")  + "(" + operators.lib.name + ")"}}
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
      <!--   自定义列名 开始   -->
      <template slot="qpcrTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{"QPCR摩尔浓度(nmol/L)"}}
      </template>

      <template slot="peakDescTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{"峰图描述"}}
      </template>

      <template slot="checkResultTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{"库检综合结果"}}
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
          <!-- 建库时间 -->
          <a-date-picker v-if="col == 'createdbtime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisabled(col,record)"
                         v-model="record.createdbtime"/>
          <!-- 建库类型 -->
          <a-select style="width: 100%" v-else-if="col == 'libtype'"
                    :disabled="isDisabled(col,record)"
                    v-model="record.libtype"
          >
            <a-select-option v-for="item in databaseTypes(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>

          <!-- 测序平台 -->
          <a-select style="width: 100%" v-else-if="col == 'seqmethod'"
                    v-model="record.seqmethod"
                    :disabled="isDisabled(col,record)"
          >
            <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 序号 -->
          <a-input
              v-else-if="col != 'index'"
              style="margin: -5px 0"
              v-model="record[col]"
              :value="text"
              :disabled="isDisabled(col,record)"
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
            <a-badge :count="record.disNum">
            <a @click="() => submitItem(record,'real')" :disabled="!canPase">{{ $t("dismountData") }}</a>
            </a-badge>
            &nbsp;
          </span>
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <refuse-alert :modal-title="$t('unPass')" ref="unPassAlert" @confirmFun="confirmFun"></refuse-alert>
    <sub-task-info @subTaskInfo="startProcess" ref="subTask"></sub-task-info>
  </div>
</template>

<script>
// import {Icon} from 'ant-design-vue';
// import util from "@/components/publib/util";

// const IconFont = Icon.createFromIconfontCN({
//   scriptUrl: util.alicdnIcon,
// });
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";
import RefuseAlert from "@/components/publib/refuseAlert";
import {formatDate} from "@/components/publib/date";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";
import {Icon} from "ant-design-vue";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});

export default {
  name: "processStep6",
  components: {SubTaskInfo, RefuseAlert, Submitting,IconFont},
  props: {
    process: Object
  },
  data() {
    return {
      tableLoad: false,
      data: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      selectedRowKeys : [],
      selectedRows :[],
      subId : "00",
      allUsers : [],
      subs : [],
      subProcessName : "",
      remarks : "",
      operators : {}
    };
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    handleUploadChange : function (ret){
      if (ret.file.status == "done"){
        this.$message.success(this.$t("upload") + this.$t("save_success"));
      }else if (ret.file.status == "error"){
        this.$message.success(this.$t("systemErr"));
      }
    },
    databaseTypes: function (type) {
      return util.databaseTypes(type);
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
    confirmFun: function (reason, remark) {
      this.$(this.$refs.unPassAlert.$el).modal("hide");
      var postData = {
        processId: this.process.id,
        datas: JSON.stringify(this.selectedRows),
        type: "unPass",
        subProcessName : this.subProcessName,
        remarks : this.remarks,
        reason : reason,
        remark : remark
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/unPassConfirms", postData).then(function (res) {
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
    passItem: function (record, flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      if (!this.checkPassData(this.selectedRows)){
        return ;
      }
      if (flag) {
        this.submitData("pass");
      } else {
        this.$(this.$refs.unPassAlert.$el).modal("show");
      }
    },
    deleteItem : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.deleteByIds();
    },
    submitItem: function (record,flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.submitData(flag);
    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        confirmIds: JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/task/process/downloadConfirms", "上机确认.xls");
    },
    startProcess: function (subProcessName, remarks) {
      this.$(this.$refs.subTask.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("divide");
    },
    isDisabled: function (col,record) {
      if (record == undefined){
        return true;
      }
      if ((col == "seqmethod" || col== "uploadsize"|| col== "uploadunit"
          || col == "uploadremark")
          && record.currentstatu == "02" && this.canPase){
        return false;
      }

      if (!this.isEnd){
        return true;
      }
      if (col == "sampleindex" || col == "samplename" || col == "libindex"
      ||col == "seqmethod" || col== "uploadsize"|| col== "uploadunit"
          || col == "uploadremark") {
        return true;
      }
      if (record.currentstatu == "02"
          || record.currentstatu == "03"
          || record.currentstatu == "07"
      ){
        return true;
      }
      return false;
    },
    subTaskInfo: function () {
      this.$(this.$refs.subTask.$el).modal("show");
    },
    showSubTask: function (subId) {
      // this.$router.push({name:"processDetail",query:{subId : subId}});
      this.subId = subId;
      this.initPage();
    },
    checkPassData : function (list){
      for (var i = 0;i < list.length; i++){
        var item = list[i];
        if (util.isNull(item.seqmethod)){
          this.$message.error(this.$t("SequencingPlatform") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(item.uploadsize)){
          this.$message.error(this.$t("uploadsize") + this.$t("not_null"));
          return false;
        }
        if (util.isNull(item.uploadunit)){
          this.$message.error(this.$t("databaseunit") + this.$t("not_null"));
          return false;
        }
        // if (util.isNull(item.uploadremark)){
        //   this.$message.error(this.$t("uploadremark") + this.$t("not_null"));
        //   return false;
        // }
      }
      return true;
    },
    checkCompleteData : function (list){
      for (var i = 0;i < list.length; i++){
        var item = list[i];
        if (util.isNull(item.qpcr)){
          this.$message.error("QPCR摩尔浓度(nmol/L)" + this.$t("not_null"));
          return false;
        }
        if (util.isNull(item.peakdesc)){
          this.$message.error("峰图描述" + this.$t("not_null"));
          return false;
        }
        if (util.isNull(item.libcheckresult)){
          this.$message.error("库检综合结果" + this.$t("not_null"));
          return false;
        }
      }
      return true;
    },
    submitData: function (type) {
      // console.log(type);
      if (type == "pass"){
        if (!this.checkPassData(this.selectedRows)){
          return ;
        }
      }else if (type == "complete"){
        if (!this.checkCompleteData(this.selectedRows)){
          return ;
        }
      }

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
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/saveConfirms", postData).then(function (res) {
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          if (type == "pass"){
            _this.$confirm({
              title: _this.$t("process.passTip") + _this.$t("dismountData") + "?",
              content: _this.$t("process.passContextTip") + _this.$t("dismountData"),
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
      }).catch(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    deleteByIds : function (){
      var _this = this;
      var postData = {
        ids : this.selectedRowKeys,
        type : "06"
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
    batchUnPass : function (){
      if (!this.checkPassData(this.selectedRows)){
        return ;
      }
      this.$(this.$refs.unPassAlert.$el).modal("show");
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
    showText: function (col, text, index) {
      console.log(col, text, index);
      if (col == "index") {
        return index + 1;
      }
      return text;
    },
    initPage : function (){
      this.initCols();
      var postData = {
        processId : this.process.id,
        subId : this.subId
      }
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/task/process/initConfirm",postData).then(function (res){
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.data = new Array();
          if (res.data.retMap.datas.length != 0) {
            for (var ind in res.data.retMap.datas) {
              var d = res.data.retMap.datas[ind];
              d.key = d.id;
              if (!util.isNull(d.createdbtime)) {
                d.createdbtime = formatDate(new Date(d.createdbtime), "yyyy-MM-dd");
              }
              _this.data.push(d);
            }
          }
          _this.operators = res.data.retMap.operators;
          _this.allUsers = res.data.retMap.allUsers;
          _this.subs = res.data.retMap.subs;
          _this.selectedRowKeys = [];
          _this.selectedRows = [];
        }
      }).catch(function (res){
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols : function (){
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
        onFilter: (value, record) => {
          if (util.isNull(record.createdbtime)) {
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
        dataIndex: 'sampleindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sampleindex'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.sampleindex)) {
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
      /** 文库编号 */
      clom.push({
        title: this.$t("databaseindex"),
        dataIndex: 'libindex',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'libindex'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.libindex)) {
            return false;
          }
          return record.libindex
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

      /** 文库类型 */
      clom.push({
        title: this.$t("databasetype2"),
        dataIndex: 'libtype',
        width: '200px',
        scopedSlots: {customRender: 'libtype'},
      });
      scorllLength += 200;

      /** Index序列 */
      clom.push({
        title: "index序列",
        dataIndex: 'confirmindex',
        width: '200px',
        scopedSlots: {customRender: 'confirmindex'},
      });
      scorllLength += 200;

      /** Peak size(bp) */
      clom.push({
        title: "Peak size(bp)",
        dataIndex: 'peaksize',
        width: '200px',
        scopedSlots: {customRender: 'peaksize'},
      });
      scorllLength += 200;

      /** QPCR摩尔浓度(nmol/L) */
      clom.push({
        // title: "QPCR摩尔浓度(nmol/L)",
        slots : {title : "qpcrTitle"},
        dataIndex: 'qpcr',
        width: '200px',
        scopedSlots: {customRender: 'qpcr'},
      });
      scorllLength += 200;

      /** 峰图描述 */
      clom.push({
        // title: "峰图描述",
        slots : {title : "peakDescTitle"},
        dataIndex: 'peakdesc',
        width: '200px',
        scopedSlots: {customRender: 'peakdesc'},
      });
      scorllLength += 200;

      /** 库检综合结果 */
      clom.push({
        // title: "库检综合结果",
        slots : {title : "checkResultTitle"},
        dataIndex: 'libcheckresult',
        width: '200px',
        scopedSlots: {customRender: 'libcheckresult'},
      });
      scorllLength += 200;

      /** 测序策略 */
      clom.push({
        // title: this.$t("seqmethods"),
        slots : {title : "seqmethodsTitle"},
        dataIndex: 'seqmethod',
        width: '200px',
        scopedSlots: {customRender: 'seqmethod'},
      });
      scorllLength += 200;

      /** 上机数据量 */
      clom.push({
        // title: this.$t("uploadsize"),
        slots : {title : "uploadsizeTitle"},
        dataIndex: 'uploadsize',
        width: '150px',
        scopedSlots: {customRender: 'uploadsize'},
      });
      scorllLength += 150;
      /** 数据量单位 */
      clom.push({
        // title: this.$t("databaseunit"),
        slots : {title : "databaseunitTitle"},
        dataIndex: 'uploadunit',
        width: '150px',
        scopedSlots: {customRender: 'uploadunit'},
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
    }
  },
  watch : {
    process:{
      handler(){
        this.initPage();
      },
      deep : true
    }
  },
  computed : {
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
    seqPlants: function () {
      return util.seqPlants();
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
            disabled: record.currentstatu == "08" || record.currentstatu == "07",
          },
        }),
      };
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
    isEnd : function (){
      if (!this.process.taskstatu.startsWith("7")
          && (this.$store.getters.isCurrentUser(this.process.librarypreparation)
          )
      ){
        return true;
      }
      return false;
    },
  }
}
</script>

<style scoped>

</style>