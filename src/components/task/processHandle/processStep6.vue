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
                      :disabled="canComplete"
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
            {{ $t("allAllow")  + "(" + createrName + ")"}}
            <a-icon type="check-circle" v-if="subId == '03'" />
          </a-tag>
          <a-tag class="pointer" color="#108ee9" @click="showSubTask('02')">
            {{ $t("notAllow")  + "(" + createrName + ")"}}
            <a-icon type="check-circle" v-if="subId == '02'" />
          </a-tag>
          <a-tag class="pointer" color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
            {{ sub.name }}
            <a-icon type="check-circle" v-if="subId == sub.id" />
          </a-tag>
          <a-tag class="pointer" color="#f50" @click="showSubTask('00')">
            {{ $t("init")  + "(" + operatorName + ")"}}
            <a-icon type="check-circle" v-if="subId == '00'" />
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
<!--        <icon-font style="font-size: 20px" type="icon-bitian" />-->
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

      <template slot="sequenceTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{$t("sequencePlant")}}
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

          <!-- 上机平台 -->
          <a-select style="width: 100%" v-else-if="col == 'seqplant'"
                    v-model="record.seqplant"
                    :disabled="isDisabled(col,record)"
          >
            <a-select-option v-for="item in sequencePlant" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>

          <a-switch v-else-if="col == 'candivide'"
                    :checked-children="$t('yes')"
                    :un-checked-children="$t('no')"
                    :disabled="isDisabled(col,record)"
                    v-model="record.candivide"
          />

          <!-- 测序平台 -->
          <a-select style="width: 100%" v-else-if="col == 'seqmethod'"
                    v-model="record.seqmethod"
                    :disabled="isDisabled(col,record)"
          >
            <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>

          <div v-else-if="col == 'upload'">
            <a-upload
                name="file"
                :multiple="true"
                :disabled="isDisabled(col,record)"
                :headers="uploadHeader(record)"
                :action="uploadUrl"
                :showUploadList="false"
                @change="handleUploadChange"
            >
              <a-button :disabled="isDisabled(col,record)">
                <a-icon type="upload"/>
                {{ $t("upload") }}
              </a-button>
            </a-upload>
          </div>
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
              <a-popconfirm
                  :title="$t('suretosubmit')"
                  @confirm="submitItem(record,'real')"
                  :disabled="!canPase"
                  :okText="$t('yes')"
                  :cancelText="$t('no')"
              >
                <a :disabled="!canPase">{{ $t("dismountData") }}</a>
              </a-popconfirm>
            </a-badge>
            &nbsp;
          </span>
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
    <refuse-alert :modal-title="$t('unPass')" ref="unPassAlert" @confirmFun="confirmFun"></refuse-alert>
    <sub-task-info @subTaskInfo="startProcess" ref="subTask"></sub-task-info>
    <show-filelist :detail-id="detailId" ref="showFilelist"></show-filelist>
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
import ShowFilelist from "@/components/publib/showFilelist";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});

export default {
  name: "processStep6",
  components: {ShowFilelist, SubTaskInfo, RefuseAlert, Submitting,IconFont},
  props: {
    process: Object,
    statu : String,
  },
  data() {
    return {
      tableLoad: false,
      data: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500, y: 600},
      selectedRowKeys : [],
      selectedRows :[],
      subId : "00",
      allUsers : [],
      subs : [],
      subProcessName : "",
      remarks : "",
      operators : undefined,
      detailId : "",
      fileCounts : {}
    };
  },
  beforeMount() {
    this.subId = this.statu;
    this.initPage();
  },
  methods : {
    getFileCount: function (ids) {
      if (ids.length === 0){
        return;
      }
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
    showFileList: function (detailId) {
      this.detailId = detailId;
      // this.$("#showFileList").modal("show");
      this.$(this.$refs.showFilelist.$el).modal("show");
    },
    handleUploadChange : function (ret){
      if (ret.file.status == "done"){
        this.$message.success(this.$t("upload") + this.$t("save_success"));
        this.initPage();
      }else if (ret.file.status == "error"){
        this.$message.error(this.$t("systemErr"));
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
      if ((col == "seqmethod" || col== "uploadsize"|| col== "uploadunit" || col== "seqplant"
          || col == "uploadremark" || col== "candivide")
          && record.currentstatu == "02" && this.canPase){
        return false;
      }
      if (!this.isEnd){
        return true;
      }
      if (col == "sampleindex" || col == "samplename"
          || col == "libindex"|| col == "species"|| col == "tissue"
          ||col == "seqmethod" || col== "uploadsize"|| col== "uploadunit"
          || col== "seqplant" || col== "candivide"
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
    uploadHeader: function (record) {
      return {token: this.$cookies.get('token'), detailId: record.id}
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
        if (util.isNull(item.seqplant)){
          this.$message.error(this.$t("sequencePlant") + this.$t("not_null"));
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
        // if (util.isNull(item.qpcr)){
        //   this.$message.error("QPCR摩尔浓度(nmol/L)" + this.$t("not_null"));
        //   return false;
        // }
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
      if (type == "pass"){
        if (!this.checkPassData(this.selectedRows)){
          return ;
        }
      }else if (type == "complete"){
        if (!this.checkCompleteData(this.selectedRows)){
          return ;
        }
      }

      var confirms = this.data;
      if (type != "tmp"){
        confirms = this.selectedRows
      }
      confirms.map(con => {
        if (con.candivide){
          con.candivide = "0"
        }else {
          con.candivide = "1"
        }
      })
      var postData = {
        processId: this.process.id,
        datas: JSON.stringify(confirms),
        type: type,
        subProcessName : this.subProcessName,
        remarks : this.remarks,
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
        _this.$emit("changeStatu","04");
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
            var ids = new Array();
            for (var ind in res.data.retMap.datas) {
              var d = res.data.retMap.datas[ind];
              d.key = d.id;
              if (!util.isNull(d.createdbtime)) {
                d.createdbtime = formatDate(new Date(d.createdbtime), "yyyy-MM-dd");
                if (d.candivide === "1"){
                  d.candivide = false;
                }else {
                  d.candivide = true;
                }
              }
              ids.push(d.id);
              _this.data.push(d);
            }
            _this.getFileCount(ids);
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
      var initConfrimClom = util.initConfrimClom();
      this.scroll.x = initConfrimClom.scorllLength;
      var clom = initConfrimClom.clom;
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
    },
    statu(newVal){
      this.subId = newVal;
      this.initPage();
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
    sequencePlant : function (){
      return util.sequencePlant();
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
    uploadUrl: function () {
      return util.commonUploadUrl();
    },
    allUploadHeader : function (){
      return {token: this.$cookies.get('token'), idsStr: JSON.stringify(this.selectedRowKeys)}
    },
    uploadAllUrl: function () {
      return this.$axios.defaults.baseURL + 'file/import/uploadAll';
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
  }
}
</script>

<style scoped>

</style>