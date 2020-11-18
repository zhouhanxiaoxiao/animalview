<template>
  <div style="width: 90%;margin-left: 5%">
    <a-table :data-source="taskList"
             :pagination="pagina"
             :loading="tableLoad"
             size="middle"
             :columns="columns">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text,record"
      >
        <div :key="col" style="font-size: 12px !important;">
          <div v-if="col == 'taskstatu'">
            <a-progress :showInfo="false" :percent="taskPro(record)" size="small" :status="taskstatu(record)" />
          </div>
          <div v-else-if="col == 'taskdesc'">
            <a-tag color="green" v-if="record.tasktype == '03'">
              {{record.process.projectname}}
            </a-tag>
            {{ record.taskdesc }}
          </div>
          <div v-else-if="col == 'detail'">
            <a-button type="primary" @click="showDetail(record)" size="small">
              {{ $t("detail") }}
            </a-button>
            &nbsp;
            <a-popconfirm placement="top"
                          v-if="isAdmin"
                          :ok-text="$t('yes')"
                          :cancel-text="$t('no')"
                          :auto-adjust-overflow="true"
                          @confirm="confirmDelete(record.id)">
              <template slot="title">
                <p>{{ $t("confirmDelete") }}</p>
              </template>
              <a-button type="danger" size="small">{{$t("delete")}}</a-button>
            </a-popconfirm>
<!--            <button type="button" style="font-size: 12px" class="btn btn-primary btn-sm stock-action"-->
<!--                    @click="showDetail(record)">{{ $t("detail") }}-->
<!--            </button>-->
          </div>
          <template v-else>
            <a-tooltip placement="topLeft" :title="showText(text,col,record)">
              {{ showText(text,col,record) }}
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

export default {
  name: "taskTableNew",
  components: {Submitting},
  props :{
    pageLocation : String
  },
  data : function (){
    return {
      taskList : [],
      columns : [],
      tableLoad : false,
      selectedRowKeys : [],
      selectedRows : [],
      columnNames : [],
      users : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    confirmDelete : function (taskId){
      var postData = {
        taskId : taskId
      }
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("/task/deleteTask",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showDetail: function (task) {
      if (task.tasktype == "02"){
        // this.$router.push({name:"askDetail",query:{taskId:task.id}});
        this.$router.push({name:"askTaskMain",query:{taskId:task.id}});
      }else if (task.tasktype == "01"){
        this.$router.push({name:"userAllow",query:{taskId:task.id}});
      }else if (task.tasktype == "03"){
        // this.$router.push({name:"processDetail",query:{taskId:task.task.id}});
        // this.$router.push({name:"processInit",query:{taskId:task.task.id}});
        this.$router.push({name:"processDetailNew",query:{taskId:task.id}});
      }else if (task.tasktype == "04"){
        this.$router.push({name:"partnerDetail",query:{taskId:task.id}});
      }
    },
    taskstatu : function(task){
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
      if (task.tasktype == "01"){
        if (task.taskstatu == "01"){
          return 50;
        }else {
          return 100;
        }
      }else if (task.tasktype == "02"){
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
      }else if (task.tasktype == "03"){
        return 100;
      }else if (task.tasktype == "04"){
        var partner = task.partner;
        if (partner.taskstatu == "00"){
          return 50;
        }else if (partner.taskstatu == "01"){
          return 100;
        }else {
          return 100;
        }
      }
    },
    showText(text,column,record){
      // console.log(text,column,record);
      if (column == "tasktype"){
        var ret = "";
        if (text == "01") {
          ret = "账号申请";
        } else if (text == "02") {
          ret = "使用申请";
        } else if (text == "03"){
          ret = "流程管理" + "";
        }else if (text == "04"){
          ret = "协助申请";
        }
        return ret;
      }else if(column == "createtime"){
        return  formatDate(new Date(record.createtime),"yyyy-MM-dd");
      }else if(column == "createuser"){
        for (var i = 0;i<this.users.length;i++){
          if (this.users[i].id == text){
            return this.users[i].name;
          }
        }
      }
      return text;
    },
    initPage : function (){
      this.initColumns();
      var _this = this;
      var postData = {
        currentPage: _this.currentPage - 1,
        pageSize: _this.pageSize,
        pageLocation : this.pageLocation,
      }
      _this.$axios.post("/task/gatAllTask", postData).then(function (res) {
        // console.log(res);
        if (res.data.code != "200") {
          // console.log(res);
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.taskList = res.data.retMap.alltask;
          _this.taskList.map(task => task.key=task.id);
          _this.users = res.data.retMap.users;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initColumns : function (){
      var cols = new Array();

      cols.push({
        title: this.$t("tasktype"),
        dataIndex: 'tasktype',
        scopedSlots: {
          customRender: 'tasktype',
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
          customRender: 'createuser',
        },
      });

      cols.push({
        title: this.$t("createTime"),
        dataIndex: 'createtime',
        scopedSlots: {
          customRender: 'createtime',
        },
      });

      cols.push({
        title: this.$t("remarks"),
        dataIndex: 'taskdesc',
        scopedSlots: {
          customRender: 'taskdesc',
        },
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
      for (var item in cols){
        this.columnNames.push(cols[item].dataIndex);
      }
    }
  },
  watch : {
    userName(){
      this.initPage();
    },
  },
  computed : {
    pagina(){
      return{
        showSizeChanger : true,
        showQuickJumper : true,
        pageSizeOptions:['10','20','50','100'],
        total : this.taskList.length,
        showTotal : function (total){
          return `共 ${total} 条`
        }
      }
    },
    userName:function () {
      return this.$store.getters.getUser.name;
    },
    isAdmin: function (){
      return this.$store.getters.isAdmin;
    }
  }
}
</script>

<style scoped>

</style>