<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('dismountData')"
        :sub-title="process.projectname"
    >
      <template slot="extra">
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
          {{ $t("complete") }}
        </a-button>
        <a-button type="primary" @click="submitData('real')" v-if="this.isEnd"
                  :disabled="cansubmit">
          {{ $t("submit") }}
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
<!--        <a-tag color="pink" @click="showSubTask('01')">-->
<!--          {{ $t("showAll") }}-->
<!--        </a-tag>-->
        <a-tag class="pointer" color="pink" @click="showSubTask('02')">
          {{ $t("allcomplete") }}
        </a-tag>
        <a-tag class="pointer" color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
          {{ sub.name }}
        </a-tag>
        <a-tag class="pointer" color="#108ee9" @click="showSubTask('00')">
          {{ $t("init") }}
        </a-tag>
      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="data" bordered
             :loading="tableLoad"
             :row-selection="rowSelection"
             :scroll="scroll"
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
          <!--          <template v-if="record.editable">-->
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
          <!--          </template>-->

          <!--          <template v-else>-->
          <!--            {{ showText(col,text,index) }}-->
          <!--          </template>-->
        </div>
      </template>
<!--      <template slot="operation" slot-scope="text, record">-->
<!--        <div class="editable-row-operations">-->
<!--        <span v-if="record.editable">-->
<!--          <a @click="() => save(record.key)">{{ $t("save") }}</a>-->
<!--           &nbsp;-->
<!--          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">-->
<!--            <a>{{ $t("cancel") }}</a>-->
<!--          </a-popconfirm>-->
<!--        </span>-->
<!--          <span v-else>-->
<!--          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{ $t("edit") }}</a>-->
<!--          &nbsp;-->
<!--            <a-popconfirm-->
<!--                v-if="data.length>1"-->
<!--                title="Sure to delete?"-->
<!--                @confirm="() => onDelete(record.key)"-->
<!--            >-->
<!--          <a :disabled="editingKey !== ''">{{ $t("delete") }}</a>-->
<!--        </a-popconfirm>-->
<!--        </span>-->
<!--        </div>-->
<!--      </template>-->
    </a-table>
    <!--    <div class="modal-footer" v-if="this.canOperating">-->
    <!--      <button type="button" class="btn btn-warning"-->
    <!--              :disabled="editingKey !== ''" @click="submitData('tmp')">{{$t("tmpSave")}}</button>-->
    <!--      <button type="button" class="btn btn-primary"-->
    <!--              :disabled="editingKey !== ''" @click="submitData('real')">{{$t("submit")}}</button>-->
    <!--    </div>-->
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <sub-task-info ref="subTask" @subTaskInfo="startProcess"></sub-task-info>
  </div>
</template>

<script>
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";

export default {
  name: "processStep4",
  components: {SubTaskInfo, Submitting},
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
      selectedRowKeys : [],
      selectedRows : [],
      subtask: {},
      showAll : false,
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
      if (record.currentstatu == "02"){
        return true;
      }
      return false;
    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        disIds : JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/task/process/downloadDismount", "测序分析.xls");
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
              _this.data.push(d);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
          // _this.subtask = res.data.retMap.subtask;
          _this.subs = res.data.retMap.subs;
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
        width: '300px',
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
      scorllLength += 300;
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
        title: this.$t("remarks"),
        dataIndex: 'remarks',
        width: '200px',
        scopedSlots: {customRender: 'remarks'},
      });
      scorllLength += 200;
      // if (this.canOperating) {
      //   /**操作*/
      //   clom.push({
      //     title: this.$t("operation"),
      //     dataIndex: 'operation',
      //     width: '100px',
      //     fixed: 'right',
      //     scopedSlots: {customRender: 'operation'},
      //   });
      //   scorllLength += 100;
      // }

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
          _this.initPage();
        }
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
    canOperating: function () {
      if (this.process.taskstatu != "40") {
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.process.dismountdata)
          && !this.isAdmin
      ) {
        return false;
      }
      return true;
    },
    seqPlants: function () {
      return util.seqPlants();
    },
    canDivide(){
      if (this.selectedRowKeys.length == 0){
        return true;
      }
      for (var item in this.selectedRows){
        if (!util.isNull(this.selectedRows[item].subid)
            || this.selectedRows[item].currentstatu == "02"){
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
    isEnd : function (){
      if (this.process.taskstatu != "70"
          && this.process.dismountdata == this.$store.getters.getUser.id
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