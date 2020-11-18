<template>
  <div class="modal fade" id="processTipAlertModal" role="dialog" aria-labelledby="processTipAlertLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="processTipAlertLabel">{{ $t("process.processTip") }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
<!--          <img src="../../../assets/processTip.jpg"/>-->
          <process-tip></process-tip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProcessTip from "@/components/task/processHandle/processTip";
export default {
  name: "processTipAlert",
  components: {ProcessTip},
  beforeMount() {
    console.log("ddd");
  }
}
</script>

<style scoped>

</style>