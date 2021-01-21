<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('bioinformaticsAnalysis')"
        :sub-title="process.projectname"
    >
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
                      :disabled="canComplete"
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
        <a-button @click="submitData('tmp')" v-if="isEnd">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button type="primary" @click="submitData('complete')" v-if="isEnd"
                  :disabled="canComplete">
          {{ $t("submit") }}
        </a-button>
        <a-button icon="download" @click="downLoad" :disabled="this.selectedRowKeys == 0">
          {{ $t("outPut") }}
        </a-button>
        <a-upload
            name="file"
            v-if="isEnd"
            accept=".xls,.xlsx"
            :show-upload-list="false"
            :headers="{token:this.$cookies.get('token'), processId : this.process.id}"
            @change="handleUploadChange"
            :action="this.$axios.defaults.baseURL + '/file/import/analysisImport'"
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
             :pagination="false"
             :row-selection="rowSelection"
             :scroll="scroll"
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
          <a-select style="width: 100%" v-if="col == 'analyst'"
                    v-model="record.analyst"
                    :disabled="isDisabled(col,record)"
                    @change="e => handleChange(e.target.value, record.key, col)"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>

          <a-tag style="cursor: pointer" @click="gotoPath(record.reportpath)"
                 v-else-if="col == 'reportpath' && record.currentstatu != '01' && record.currentstatu != '00'"
          >
            {{ record.reportpath }}
          </a-tag>

          <a-input
              v-else-if="col != 'index'"
              style="margin: -5px 0"
              v-model="record[col]"
              :value="text"
              :disabled="isDisabled(col,record)"
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
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <sub-task-info @subTaskInfo="startProcess" ref="subTask"></sub-task-info>
    <refuse-alert :modal-title="$t('unPass')" ref="unPassAlert" @confirmFun="confirmFun"></refuse-alert>
  </div>
</template>

<script>
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";
import RefuseAlert from "@/components/publib/refuseAlert";

export default {
  name: "processStep5",
  components: {RefuseAlert, SubTaskInfo, Submitting},
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
      selectedRowKeys : [],
      selectedRows : [],
      columnNames: [],
      scroll: {x: 1500, y: 600},
      editingKey: '',
      allUsers: [],
      subtask: {},
      subProcessName : "",
      remarks : "",
      subId : "00",
      subs : [],
      operators : undefined
    }
  },
  beforeMount() {
    this.subId = this.statu;
    this.initPage();
  },
  methods: {
    gotoPath : function (path){
      window.open(path,"_blank");
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
    confirmFun : function (reason,remark){
      this.$(this.$refs.unPassAlert.$el).modal("hide");
      var _this = this;
      var post = {
        processId: this.process.id,
        subId : this.subId,
        datas: JSON.stringify(this.selectedRows),
        type: 'unPass',
        subProcessName : this.subProcessName,
        remarks : this.remarks,
        reason : reason,
        remark : remark,
      }
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/refuseAnalysis", post).then(function (res) {
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
    submitItem: function (record,flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.submitData(flag);
    },
    batchUnPass : function (){
      this.$(this.$refs.unPassAlert.$el).modal("show");
    },
    deleteItem : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.deleteByIds();
    },
    deleteByIds : function (){
      var _this = this;
      var postData = {
        ids : this.selectedRowKeys,
        type : "05"
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
    startProcess : function (subProcessName,remarks){
      this.$(this.$refs.subTask.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("real");
    },
    subTaskInfo : function (){
      this.$(this.$refs.subTask.$el).modal("show");
    },
    backToTotal : function (){
      this.$router.push({name:"processInit",query:{taskId:this.process.taskid}});
    },
    handleUploadChange: function (ret) {
      util.commonHandleUploadChange(ret);

    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        ids : JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/task/process/downloadAnalysis", "生信分析.xls");
    },
    isDisabled: function (col,record) {
      if (!this.isEnd){
        return true;
      }
      if (col == "sampleindex" || col == "samplename"
          || col == "species"|| col == "tissue") {
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
    initPage: function () {
      this.initCols();
      var _this = this;
      var postData = {
        processId: this.process.id,
        subId: this.subId
      }
      this.$axios.post("/task/process/analyseInit", postData).then(function (res) {
        _this.data = new Array();
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          if (res.data.retMap.datas.length != 0) {
            _this.data = new Array();
            for (var ind in res.data.retMap.datas) {
              var d = res.data.retMap.datas[ind];
              d.key = d.id;
              _this.data.push(d);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
          // _this.subtask = res.data.retMap.subtask;
          _this.subs = res.data.retMap.subs;
          _this.operators = res.data.retMap.operators;
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols: function () {
      var initBioClom = util.initBioClom();
      this.scroll.x = initBioClom.scorllLength;
      var clom = initBioClom.clom;
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
    showText: function (col, text, index) {
      console.log(col, text, index);
      if (col == "index") {
        return index + 1;
      }
      return text;
    },
    submitData: function (type) {
      var _this = this;
      var post = {
        processId: this.process.id,
        subId : this.subId,
        datas: JSON.stringify(this.data),
        type: type,
        subProcessName : this.subProcessName,
        remarks : this.remarks,
      }
      if (type != "tmp"){
        post.datas = JSON.stringify(this.selectedRows);
      }
      // _this.$("#submitting").modal("show");
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/saveAnalyse", post).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
        _this.$emit("changeStatu","06");
      }).catch(function (res) {
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  computed: {
    canOperating: function () {
      if (this.process.taskstatu != "50") {
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.process.bioinformaticsanalysis)
          && !this.isAdmin
      ) {
        return false;
      }
      return true;
    },
    isEnd : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.bioinformaticsanalysis)
      ){
        return true;
      }
      return false;
    },
    canComplete(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (this.selectedRows[item].currentstatu == '02'
            || this.selectedRows[item].currentstatu == '03' ){
          return true;
        }
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
      return this.operators.bio.name;
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
  },
}
</script>

<style scoped>

</style>