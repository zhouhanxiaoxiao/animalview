<template>
  <div class="task-container">
    <table class="table table-striped table-hover">
      <thead class="task-head">
      <tr>
        <th scope="col" width="5%">#</th>
        <th scope="col" width="15%">{{ $t("tasktype") }}</th>
        <th scope="col" width="15%">{{ $t("currentstatu") }}</th>
        <th scope="col" width="15%">{{ $t("creater") }}</th>
        <th scope="col" width="15%">{{ $t("createTime") }}</th>
        <th scope="col" width="20%">{{ $t("remarks") }}</th>
        <th scope="col" width="15%">{{ $t("detail") }}</th>
      </tr>
      </thead>
      <tbody class="task-body">
      <tr v-for="(task,index) in taskList" :key="task.id">
        <th scope="row">{{ index + 1 + currentPage * pageSize }}</th>
        <td>{{ taskType(task.task) }}</td>
        <td>
          <div>
<!--            <div class="progress-bar"-->
<!--                 :class="taskstatu(task.task)"-->
<!--                 role="progressbar"-->
<!--                 :style="taskPro(task)"-->
<!--                 aria-valuenow="25" aria-valuemin="0"-->
<!--                 aria-valuemax="100">{{ tastStatu(task.task) }}-->
<!--            </div>-->
            <a-progress :percent="taskPro(task)" size="small" :status="taskstatu(task.task)" />
          </div>
        </td>
        <td>{{ task.creater.name }}</td>
        <td>{{ format(task.task.createtime) }}</td>
        <td>{{ task.task.taskdesc }}</td>
        <td>
          <button type="button" style="font-size: 12px" class="btn btn-primary btn-sm stock-action"
                  @click="showDetail(task)">{{ $t("detail") }}
          </button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="page-div">
      <limit-index v-if="total > 0" :total="total" :page-size="pageSize" :current-page="currentPage"
                   :update-table-date="updateTable"></limit-index>
    </div>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import LimitIndex from "@/components/publib/LimitIndex";
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";

export default {
  name: "TaskTable",
  components: {Submitting, LimitIndex},
  data: function () {
    return {
      currentPage: 0,
      pageSize: 20,
      total: 0,
      taskList: [],
      taskId: "",
    }
  },
  beforeMount: function () {
    this.initPage();
  },
  methods: {
    initPage: function () {
      var _this = this;
      var postData = {
        currentPage: _this.currentPage,
        pageSize: _this.pageSize,
      }
      _this.$axios.post("/task/gatAllTask", postData).then(function (res) {
        console.log(res);
        if (res.data.code != "200") {
          console.log(res);
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.total = res.data.retMap.total;
          _this.taskList = res.data.retMap.alltask;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    updateTable: function (pageNumber) {
      this.currentPage = pageNumber;
      this.initPage();
    },
    taskType: function (task) {
      var ret = "";
      if (task.tasktype == "01") {
        ret = "账号申请";
      } else if (task.tasktype == "02") {
        ret = "使用申请";
      } else if (task.tasktype == "03"){
        ret = "流程管理";
      }
      return ret;
    },
    tastStatu: function (task) {
      var statu = "";
      if (task.taskstatu == "01") {
        statu = "进行中";
      } else if (task.taskstatu == "02") {
        statu = "任务完成";
      } else if (task.taskstatu == "03") {
        statu = "任务失败";
      }
      return statu;
    },
    taskPro: function (task) {
      if (task.task.tasktype == "01"){
        if (task.task.taskstatu == "01"){
          return 50;
        }else {
          return 100;
        }
      }else if (task.task.tasktype == "02"){
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
        }else {
          return 100;
        }
      }else if (task.task.tasktype == "03"){
        var process = task.process;
        if (process.taskstatu == "10"){
          return 10;
        }else
        if (process.taskstatu == "20"){
          return 25;
        }else
        if (process.taskstatu == "30"){
          return 40;
        }else
        if (process.taskstatu == "40"){
          return 55;
        }else
        if (process.taskstatu == "50"){
          return 75;
        }else
        if (process.taskstatu == "60"){
          return 90;
        }
        else {
          return 100;
        }
      }
    },
    taskstatu : function(task){
      if (task.taskstatu == "01") {
        return "active";
      } else if (task.taskstatu == "02") {
        return "";
      } else if (task.taskstatu == "03") {
        return "exception";
      }
    },
    askremarks : function (task){
      if (task.task.tasktype == "02"){
        return task.ask.remarks;
      }
      return ""
    },
    format: function (date) {
      var forDate = new Date(date);
      return formatDate(forDate, "yyyy年MM月dd日");
    },
    showDetail: function (task) {
      if (task.task.tasktype == "02"){
        this.$router.push({name:"askDetail",query:{taskId:task.task.id}});
      }else if (task.task.tasktype == "01"){
        this.$router.push({name:"userAllow",query:{taskId:task.task.id}});
      }else if (task.task.tasktype == "03"){
        // this.$router.push({name:"processDetail",query:{taskId:task.task.id}});
        this.$router.push({name:"processInit",query:{taskId:task.task.id}});
      }
    },
  },
  computed : {
    userName:function () {
      return this.$store.getters.getUser.name;
    },
  },
  watch : {
    userName(){
      this.currentPage = 0;
      this.pageSize = 20;
      this.initPage();
    }
  }
}
</script>

<style scoped>
.task-container {
  width: 90%;
  margin-left: 5%;
  margin-top: 20px;
}

.task-head {
  font-size: 14px;
}

.task-body {
  font-size: 12px;
}

.task-handle {
  width: 100%;
  text-align: right;
  margin: 20px 0px;
  font-size: 14px;
}

.display-none {
  display: none;
}

.page-div {
  width: 100%;
  text-align: center;
}
</style>