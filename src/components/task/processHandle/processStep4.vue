<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('dismountData')"
        @back="backToTotal"
    >
      <template slot="extra">
        <a-button @click="submitData('tmp')">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button type="primary" @click="SubTaskInfo" :disabled="this.selectedRows.length == 0">
          {{ $t("submit") }}
        </a-button>
        <a-button icon="download" @click="downLoad">
          {{ $t("outPut") }}
        </a-button>
        <a-upload
            name="file"
            accept=".xls,.xlsx"
            :show-upload-list="false"
            :headers="{token:this.$cookies.get('token'), subId : subId}"
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
        <a-tag color="pink" @click="showSubTask('01')">
          {{ $t("showAll") }}
        </a-tag>
        <a-tag color="blue" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
          {{ sub.name }}
        </a-tag>
        <a-tag color="#108ee9" @click="showSubTask('00')">
          {{ $t("reset") }}
        </a-tag>
      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="data" bordered
             :loading="tableLoad"
             :row-selection="rowSelection"
             :scroll="scroll"
             :pagination="{ pageSize: 20 }"
             size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record, index"
      >
        <div :key="col">
          <!-- 测序平台 -->
          <a-select style="width: 100%" v-if="col == 'sequencingplatform'"
                    v-model="record.sequencingplatform"
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
              :disabled="isDisabled(col)"
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
      subId : ""
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    showSubTask: function (subId) {
      // this.$router.push({name:"processDetail",query:{subId : subId}});
      this.subId = subId;
      this.initPage();
    },
    SubTaskInfo : function (){
      this.$(this.$refs.subTask.$el).modal("show");
    },
    startProcess : function (subProcessName,remarks){
      this.$(this.$refs.subTask.$el).modal("hide");
      this.subProcessName = subProcessName;
      this.remarks = remarks;
      this.submitData("real");
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
    isDisabled: function (col) {
      if (col == "sampleindex" || col == "samplename") {
        return true;
      }
      return false;
    },
    downLoad: function () {
      var postData = {
        subId: this.subId
      }
      util.downLoad(postData, "/task/process/downloadDismount", this.subtask.name + "-测序分析.xls");
    },
    initPage: function () {
      this.initCols();
      var _this = this;
      var postData = {
        processId: this.process.id,
        showAll : this.showAll
      }
      this.tableLoad = true;
      this.$axios.post("/task/process/dismountInit", postData).then(function (res) {
        _this.tableLoad = false;
        if (res.data.code != "200") {
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
          _this.subtask = res.data.retMap.subtask;
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
        scopedSlots: {customRender: 'sampleindex'},
      });
      scorllLength += 150;
      /**样本名称*/
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: {customRender: 'samplename'},
      });
      scorllLength += 150;
      /**数据账号*/
      clom.push({
        title: this.$t("dateaccount"),
        dataIndex: 'dateaccount',
        width: '150px',
        scopedSlots: {customRender: 'dateaccount'},
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
        scopedSlots: {customRender: 'datepath'},
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
      if (type === "real"){
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
          window.location.reload();
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
            disabled: record.currentstatu === '02' || record.currentstatu == "09",
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