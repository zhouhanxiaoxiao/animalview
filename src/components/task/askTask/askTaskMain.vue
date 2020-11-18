<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-tabs>
        <a-tab-pane key="1" :tab="$t('orderDetail') + $t('confirm')">
          <ask-step1 :task-id="getTaskId"></ask-step1>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('expectionObject') + $t('prepare')">
          <ask-step2 :task-id="getTaskId"></ask-step2>
        </a-tab-pane>
        <a-tab-pane key="3" tab="实验员确认">
          <ask-step3 :task-id="getTaskId"></ask-step3>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import AskStep1 from "@/components/task/askTask/askStep1";
import AskStep2 from "@/components/task/askTask/askStep2";
import AskStep3 from "@/components/task/askTask/askStep3";

export default {
  name: "askTaskMain",
  components: {AskStep3, AskStep2, AskStep1, TopNav},
  data : function (){
    return {

    }
  },
  mounted() {
    this.taskId = this.$route.query.taskId;
    this.initPage();
  },
  methods : {
    initPage : function (){

    },
  },
  watch : {
    getTaskId(){
      this.initPage();
    },
  },
  computed : {
    getTaskId : function (){
      return this.$route.query.taskId;
    },
  }
}
</script>

<style scoped>

</style>