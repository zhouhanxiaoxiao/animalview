<template>
    <div class="task-container">
        <table class="table table-striped table-hover">
            <thead class="task-head">
            <tr>
                <th scope="col" width="5%">#</th>
                <th scope="col" width="15%">{{$t("tasktype")}}</th>
                <th scope="col" width="15%">{{$t("currentstatu")}}</th>
                <th scope="col" width="15%">{{$t("creater")}}</th>
                <th scope="col" width="15%">{{$t("createTime")}}</th>
                <th scope="col" width="20%">{{$t("remarks")}}</th>
                <th scope="col" width="15%">{{$t("detail")}}</th>
            </tr>
            </thead>
            <tbody class="task-body">
            <tr v-for="(task,index) in taskList" :key="task.id">
                <th scope="row">{{index + 1 + currentPage*pageSize}}</th>
                <td>{{taskType(task.task)}}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar" role="progressbar" :style="taskPro(task.ask)" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{{tastStatu(task.task)}}</div>
                    </div>
                </td>
                <td>{{task.creater.name}}</td>
                <td>{{format(task.task.createtime)}}</td>
                <td>{{task.ask.remarks}}</td>
                <td>
                    <button type="button" style="font-size: 12px" class="btn btn-primary btn-sm stock-action"
                    @click="showDetail(task.task.id)">{{$t("detail")}}</button>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="page-div">
            <limit-index v-if="total > 0" :total="total" :page-size="pageSize" :current-page="currentPage"
                         :update-table-date="updateTable"></limit-index>
        </div>
        <ask-task-detail :task-id="taskId"></ask-task-detail>
    </div>
</template>

<script>
    import LimitIndex from "@/components/publib/LimitIndex";
    import {formatDate} from "@/components/publib/date";
    import AskTaskDetail from "@/components/task/askTaskDetail";
    export default {
        name: "TaskTable",
        components: {AskTaskDetail, LimitIndex},
        data : function(){
            return{
                currentPage : 0,
                pageSize : 20,
                total : 0,
                taskList : [],
                taskId : "",
            }
        },
        beforeMount : function () {
            this.initPage();
        },
        methods : {
            initPage : function () {
              var _this = this;
              var postData = {
                  currentPage : _this.currentPage,
                  pageSize: _this.pageSize,
              }
              _this.$axios.post("/task/gatAllTask", postData).then(function (res) {
                  console.log(res);
                  if (res.data.code != "200"){
                      console.log(res);
                      _this.$toast(_this.$t(res.data.code));
                  }else {
                      _this.total = res.data.retMap.total;
                      _this.taskList = res.data.retMap.alltask;
                  }
              }).catch(function (res) {
                  console.log(res);
                  _this.$toast(_this.$t("systemErr"));
              })
            },
            updateTable : function (pageNumber) {
                this.currentPage = pageNumber;
                this.initPage();
            },
            taskType : function (task) {
                var ret = "";
                if (task.tasktype == "01"){
                    ret = "账号申请";
                }else if (task.tasktype == "02"){
                    ret = "使用申请";
                }
                return ret;
            },
            tastStatu : function (task) {
                var statu = "";
                if (task.taskstatu == "01"){
                    statu = "进行中";
                }else if (task.taskstatu == "02"){
                    statu = "任务完成";
                }else if (task.taskstatu == "03"){
                    statu = "任务失败";
                }
                return statu;
            },
            taskPro : function (ask) {
                if (ask.currentstatu == "00"){
                    return "width: 25%";
                }
                if (ask.currentstatu == "01"){
                    return "width:50%";
                }
                if (ask.currentstatu == "02"){
                    return "width:75%";
                }
                if (ask.currentstatu == "04"){
                    return "width:100%";
                }
            },
            format : function (date) {
                var forDate = new Date(date);
                return formatDate(forDate,"yyyy年MM月dd日");
            },
            showDetail : function (taskId) {
                this.taskId = taskId;
                this.$("#askTaskDetail").modal("show");
            }
        },
        computed:{

        }
    }
</script>

<style scoped>
    .task-container{
        width: 90%;
        margin-left: 5%;
        margin-top: 20px;
    }
    .task-head{
        font-size: 14px;
    }
    .task-body{
        font-size: 12px;
    }
    .task-handle{
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