<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container process-detailAll">
      <a-tabs type="card" @change="callback" v-model="tabVal">
        <a-tab-pane key="9" :tab="$t('processAllConfirm')">
          <process-all-confirm :process="process" @changeTab="changeTab"></process-all-confirm>
        </a-tab-pane>
        <a-tab-pane key="7" :tab="$t('baseInfo')">
          <process-base-info :process="process"></process-base-info>
        </a-tab-pane>
        <template v-if="process.taskstatu != 10 && process.taskstatu != 21 && process.taskstatu != 22">
          <a-tab-pane key="1" :tab="$t('sampleInput')">
            <process-step1-new :process="process"></process-step1-new>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('samplePreparation')">
            <process-step2 :process="process" :task-id="taskId"></process-step2>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="$t('libraryPreparation')">
            <process-step3 :process="process"></process-step3>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="$t('uploadConfirm')">
            <process-step6 :process="process"></process-step6>
          </a-tab-pane>
          <a-tab-pane key="5" :tab="$t('dismountData')">
            <process-step4 :process="process"></process-step4>
          </a-tab-pane>
          <a-tab-pane key="6" :tab="$t('bioinformaticsAnalysis')">
            <process-step5 :process="process"></process-step5>
          </a-tab-pane>
        </template>
        <a-tab-pane key="8" :tab="$t('process.processTip')">
          <process-tip></process-tip>
        </a-tab-pane>
        <div slot="tabBarExtraContent">
          <a-tag class="pointer" color="#f50" v-if="this.process.taskstatu == '71'">
            {{ "基因组学中心已拒绝：" + this.fail.reason }}
          </a-tag>
          <a-tag class="pointer" color="#f50" v-else-if="this.process.taskstatu == '72'">
            {{ "部门负责人已拒绝：" + this.fail.reason }}
          </a-tag>
          <a-popconfirm placement="topLeft"
                        :ok-text="$t('yes')"
                        v-else-if="!isStop"
                        :cancel-text="$t('no')"
                        @confirm="completeTask">
            <template slot="title">
              <p>{{ $t("areyousureCompleteProject") }}</p>
            </template>
            <a-button type="danger">
              {{ $t("projectComplete") }}
            </a-button>
          </a-popconfirm>
          <a-tag v-else-if="this.process.taskstatu == '70'" color="#87d068">
            {{ $t("allcomplete") }}
          </a-tag>
        </div>
        <!--        <a-tag color="purple" slot="tabBarExtraContent">-->
        <!--          {{process.projectname}}-->
        <!--        </a-tag>-->
      </a-tabs>
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/publib/TopNav";
import ProcessStep1New from "@/components/task/processHandle/processStep1New";
import ProcessStep2 from "@/components/task/processHandle/processStep2";
import ProcessStep3 from "@/components/task/processHandle/processStep3";
import ProcessStep4 from "@/components/task/processHandle/processStep4";
import ProcessStep5 from "@/components/task/processHandle/processStep5";
import ProcessBaseInfo from "@/components/task/processHandle/processBaseInfo";
import ProcessStep6 from "@/components/task/processHandle/processStep6";
import ProcessTip from "@/components/task/processHandle/processTip";
import ProcessAllConfirm from "@/components/task/processHandle/processAllConfirm";

export default {
  name: "processDetailNew",
  components: {
    ProcessAllConfirm,
    ProcessTip,
    ProcessStep6,
    ProcessBaseInfo, ProcessStep5, ProcessStep4, ProcessStep3, ProcessStep2, ProcessStep1New, TopNav
  },
  data: function () {
    return {
      taskId: "",
      process: {taskstatu: ""},
      fail: {},
      group: {},
      tabVal : "7"
    }
  },
  beforeMount() {
    this.taskId = this.$route.query.taskId;
    console.log(this.taskId)
    this.initPage();
  },
  methods: {
    changeTab : function (val){
      this.tabVal = val
    },
    completeTask: function () {
      var post = {
        processId: this.process.id
      }
      var _this = this;
      this.$axios.post("/task/process/completeProject", post).catch(function (res) {
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("save_success"));
          window.location.reload();
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    callback: function (key) {
      console.log(key);
    },
    initPage: function () {
      var _this = this;
      var postData = {
        taskId: this.taskId
      }
      if (this.taskId == "" || this.taskId == undefined || this.taskId == null) {
        return;
      }
      this.$axios.post("/task/process/init", postData).then(function (res) {
        // console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.process = res.data.retMap.process;
          _this.fail = res.data.retMap.fail;
          _this.group = res.data.retMap.group;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
  },
  watch: {
    getTaskId(newVal) {
      console.log(newVal);
      this.taskId = newVal;
      this.initPage();
    }
  },
  computed: {
    getTaskId: function () {
      return this.$route.query.taskId;
    },
    isStop: function () {
      if (this.process.taskstatu.startsWith("7")
          || !this.$store.getters.isCurrentUser(this.group.groupadmin)
      ) {
        return true;
      }
      return false;
    }
  },
}
</script>

<style scoped>

</style>