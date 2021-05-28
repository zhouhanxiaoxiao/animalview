<template>
  <div style="width: 100%">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="'项目列表'"
    >
    </a-page-header>
    <a-table :data-source="taskList"
             :pagination="pagina"
             :loading="tableLoad"
             size="middle"
             :columns="columns">
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
          slot-scope="text,record"
      >
        <div :key="col" style="font-size: 12px !important;">
          <div v-if="col == 'taskstatu'">
            <div v-if="record.tasktype == '03'">
              <a-tag v-if="record.process.taskstatu == '10'" color="orange">等待部门负责人审批</a-tag>
              <a-tag v-if="record.process.taskstatu == '21'" color="orange">等待基因组学中心审批</a-tag>
              <a-tag v-if="record.process.taskstatu == '20'" color="cyan">进行中</a-tag>
              <a-tag v-if="record.process.taskstatu == '72'" color="red">部门负责人拒绝</a-tag>
              <a-tag v-if="record.process.taskstatu == '71'" color="red">基因组学中心拒绝</a-tag>
              <a-tag v-if="record.process.taskstatu == '70'" color="#87d068">已完成</a-tag>
            </div>
            <a-progress v-else :showInfo="false" :percent="taskPro(record)" size="small" :status="taskstatu(record)"/>
          </div>
          <div v-else-if="col == 'taskdesc'">
            <div  v-if="record.tasktype == '03'">
              <a-tag color="purple" v-if="record.process.isonlybio">
                {{ record.process.projectname }}
              </a-tag>
              <a-tag v-else color="green">
                {{ record.process.projectname }}
              </a-tag>
            </div>
            <div style="width: 300px">{{ record.taskdesc }}</div>
          </div>
          <div v-else-if="col == 'handler'">
            <a-tag v-for="item in record.handler" :key="item.id">
              {{ item.name }}
            </a-tag>
          </div>
          <div v-else-if="col == 'detail'">
            <a-badge
                :count="showTodoCount(record)"
                style="z-index: 3"
                :number-style="{
                  backgroundColor: '#fff',
                  color: '#999',
                  boxShadow: '0 0 0 1px #d9d9d9 inset',
                }"
            >
              <a-button type="primary" @click="showDetail(record)" size="small">
                {{ $t("detail") }}
              </a-button>
            </a-badge>
            &nbsp;
            <a-popconfirm placement="top"
                          v-if="isAdmin"
                          :ok-text="$t('yes')"
                          :cancel-text="$t('no')"
                          :auto-adjust-overflow="true"
                          @confirm="confirmDelete(record.id)"
                          style="z-index: 1"
            >
              <template slot="title">
                <p>{{ $t("confirmDelete") }}</p>
              </template>
              <a-button type="danger" size="small">{{ $t("delete") }}</a-button>
            </a-popconfirm>
            &nbsp;
            <a-popconfirm placement="topLeft"
                          v-if="allowShare(record)"
                          ok-text="Yes"
                          cancel-text="No"
                          @confirm="submitShareUsers(record.id)">
              <template slot="title">
                <p>{{ $t("selectShareUser") }}</p>
                <p>
                  <a-select style="width: 100%" mode="tags" v-model="shareUser">
                    <a-select-option v-for="item in users" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                </p>
                <p>
                  已分享：
                  <a-tag v-for="share in taskShare(record.id)" :key="share.id">
                    {{ share.name }}
                  </a-tag>
                </p>
              </template>
              <a-button size="small" shape="circle" icon="share-alt"/>
            </a-popconfirm>

            <!--            <button type="button" style="font-size: 12px" class="btn btn-primary btn-sm stock-action"-->
            <!--                    @click="showDetail(record)">{{ $t("detail") }}-->
            <!--            </button>-->
          </div>
          <template v-else>
            <a-tooltip placement="topLeft" :title="showText(text,col,record)">
              {{ showText(text, col, record) }}
            </a-tooltip>
          </template>
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";

export default {
  name: "taskTableNew",
  components: {Submitting},
  props: {
    pageLocation: String
  },
  data: function () {
    return {
      taskList: [],
      columns: [],
      tableLoad: false,
      selectedRowKeys: [],
      selectedRows: [],
      columnNames: [],
      users: [],
      searchInput: "",
      shareUser: [],
      shares: [],
      todoCount : {}
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    showTodoCount : function (record){
      if (record.tasktype == "03"){
        console.log(this.todoCount[record.process.id]);
        return this.todoCount[record.process.id];
      }
      return 0;
    },
    allowShare: function (record) {
      if (record.tasktype == "03") {
        if (this.$store.getters.isCurrentUser(record.process.creater)) {
          return true;
        }
      }
      return false;
    },
    taskShare: function (taskId) {
      var sharers = new Array();
      for (var i = 0; i < this.shares.length; i++) {
        var share = this.shares[i];
        if (share.taskid == taskId) {
          for (var j = 0; j < this.users.length; j++) {
            var curuser = this.users[j];
            if (share.shareuser == curuser.id) {
              sharers.push(curuser);
            }
          }
        }
      }
      return sharers;
    },
    submitShareUsers: function (taskId) {
      if (this.shareUser.length == 0) {
        this.$message.error(this.$t("请选择能够查看此项目的用户"));
        return;
      }
      var postData = {
        taskId: taskId,
        shares: JSON.stringify(this.shareUser)
      }
      util.commonPost("/task/submitShare", postData, this.initPage, this.$refs.submitting.$el)
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    confirmDelete: function (taskId) {
      var postData = {
        taskId: taskId
      }
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("/task/deleteTask", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.initPage();
        }
      }).catch(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showDetail: function (task) {
      if (task.tasktype == "02") {
        // this.$router.push({name:"askDetail",query:{taskId:task.id}});
        this.$router.push({name: "askTaskMain", query: {taskId: task.id}});
      } else if (task.tasktype == "01") {
        this.$router.push({name: "userAllow", query: {taskId: task.id}});
      } else if (task.tasktype == "03") {
        // this.$router.push({name:"processDetail",query:{taskId:task.task.id}});
        // this.$router.push({name:"processInit",query:{taskId:task.task.id}});
        this.$router.push({name: "processDetailNew", query: {taskId: task.id}});
      } else if (task.tasktype == "04") {
        this.$router.push({name: "partnerDetail", query: {taskId: task.id}});
      }
    },
    taskstatu: function (task) {
      if (task.taskstatu == "01") {
        return "active";
      } else if (task.taskstatu == "02") {
        return "success";
      } else if (task.taskstatu == "03") {
        return "exception";
      }
    },
    taskPro: function (task) {
      console.log(task);
      if (task.tasktype == "01") {
        if (task.taskstatu == "01") {
          return 50;
        } else {
          return 100;
        }
      } else if (task.tasktype == "02") {
        var ask = task.ask;
        if (ask.currentstatu == "00") {
          return 10;
        }
        if (ask.currentstatu == "01") {
          return 30;
        }
        if (ask.currentstatu == "02" || ask.currentstatu == "03") {
          return 50;
        }
        if (ask.currentstatu == "04") {
          return 75;
        } else {
          return 100;
        }
      } else if (task.tasktype == "03") {
        return 100;
      } else if (task.tasktype == "04") {
        var partner = task.partner;
        if (partner.taskstatu == "00") {
          return 50;
        } else if (partner.taskstatu == "01") {
          return 100;
        } else {
          return 100;
        }
      }
    },
    showTaskType: function (text) {
      var ret = "";
      if (text == "01") {
        ret = "账号申请";
      } else if (text == "02") {
        ret = "使用申请";
      } else if (text == "03") {
        ret = "流程管理" + "";
      } else if (text == "04") {
        ret = "协助申请";
      }
      return ret;
    },
    showText(text, column, record) {
      // console.log(text,column,record);
      if (column == "tasktype") {
        return this.showTaskType(text);
      } else if (column == "createtime") {
        return formatDate(new Date(record.createtime), "yyyy-MM-dd");
      } else if (column == "createuser") {
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].id == text) {
            return this.users[i].name;
          }
        }
      }
      return text;
    },
    getTodoCount: function (ids) {
      var postData = {
        idsStr: JSON.stringify(ids)
      }
      var _this = this;
      this.$axios.post("/task/getTodoCount", postData).then(function (res) {
        if (res.data.code == "200") {
          _this.todoCount = res.data.retMap.todoCount;
        }
      })
    },
    initPage: function () {
      this.initColumns();
      var _this = this;
      var postData = {
        currentPage: _this.currentPage - 1,
        pageSize: _this.pageSize,
        pageLocation: this.pageLocation,
      }
      this.tableLoad = true;
      _this.$axios.post("/task/gatAllTask", postData).then(function (res) {
        _this.tableLoad = false;
        console.log("111")
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.taskList = res.data.retMap.alltask;
          var ids = new Array();
          _this.taskList.map(task => {
            task.key = task.id
            if (task.tasktype == "03") {
              ids.push(task.process.id);
            }
          });
          if (ids.length > 0) {
            _this.getTodoCount(ids);
          }
          _this.users = res.data.retMap.users;
          _this.shares = res.data.retMap.shares;
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initColumns: function () {
      var cols = new Array();

      cols.push({
        title: this.$t("tasktype"),
        dataIndex: 'tasktype',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'tasktype',
        },
        onFilter: (value, record) =>
            this.showTaskType(record.tasktype)
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

      cols.push({
        title: this.$t("currentstatu"),
        dataIndex: 'taskstatu',
        scopedSlots: {
          customRender: 'taskstatu',
        },
      });

      cols.push({
        title: this.$t("creater"),
        dataIndex: 'createuser',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createuser',
        },
        onFilter: (value, record) => {
          var user = undefined;
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == record.createuser) {
              user = this.users[i].name;
            }
          }
          if (util.isNull(record.createuser)) {
            return false;
          }
          return user
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
        sorter: (a, b) => {
          var auser = undefined;
          var buser = undefined;
          for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == a.createuser) {
              auser = this.users[i].name;
            }
            if (this.users[i].id == b.createuser) {
              buser = this.users[i].name;
            }
          }
          return util.sorter(auser,buser);
        },
      });

      cols.push({
        title: this.$t("handler"),
        dataIndex: 'handler',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'handler',
        },
        onFilter: (value, record) => {
          for (var i = 0; i < record.handler; i++) {
            var usr = record.handler[i];
            if (usr.name.toString()
                .toLowerCase()
                .includes(value.toLowerCase())) {
              return true;
            }
          }
          return false;
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      cols.push({
        title: this.$t("createTime"),
        dataIndex: 'createtime',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createtime',
        },
        onFilter: (value, record) => {
          if (util.isNull(record.createtime)) {
            return false;
          }
          return formatDate(new Date(record.createtime), "yyyy-MM-dd")
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

      cols.push({
        title: this.$t("remarks"),
        dataIndex: 'taskdesc',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'taskdesc',
        },
        onFilter: (value, record) => {
          if (util.isNull(record.taskdesc)) {
            return false;
          }
          return record.taskdesc
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
        sorter: (a, b) => {
          if (a.tasktype == "03" && b.tasktype == "03"){
            return util.sorter(a.process.projectname,b.process.projectname);
          }else {
            return a.taskdesc.length - b.taskdesc.length;
          }
        }
      });

      cols.push({
        title: this.$t("detail"),
        dataIndex: 'detail',
        scopedSlots: {
          customRender: 'detail',
        },
      });
      this.columns = cols;
      this.columnNames = new Array();
      for (var item in cols) {
        this.columnNames.push(cols[item].dataIndex);
      }
    }
  },
  watch: {
    userName() {
      this.initPage();
    },
  },
  computed: {
    pagina() {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        total: this.taskList.length,
        showTotal: function (total) {
          return `共 ${total} 条`
        }
      }
    },
    userName: function () {
      return this.$store.getters.getUser.name;
    },
    isAdmin: function () {
      return this.$store.getters.isAdmin;
    }
  }
}
</script>

<style scoped>

</style>