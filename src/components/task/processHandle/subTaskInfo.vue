<template>
  <div class="modal fade" id="subTaskInfo" tabindex="-1" role="dialog" ref="subTaskInfo">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="subTaskInfoLabel">{{ $t("subTask") }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="reason">{{$t("subProcessName")}}</label>
            <input type="text" class="form-control" id="reason" v-model="subProcessName">
          </div>
          <div class="form-group">
            <label for="remarks">{{$t("remarks")}}</label>
            <textarea class="form-control" id="remarks" rows="3" v-model="remarks"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary"
                  :disabled="isCanConfirm"
                  @click="subInfoConfirm">{{ $t("confirm") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/components/publib/util';

export default {
  name: "subTaskInfo",
  data : function (){
    return {
      subProcessName : "",
      remarks : ""
    }
  },
  methods : {
    subInfoConfirm : function (){
      this.$("#subTaskInfo").modal("hide");
      this.$emit("subTaskInfo",this.subProcessName, this.remarks);
    }
  },
  computed : {
    isCanConfirm : function (){
      return util.isNull(this.subProcessName);
    }
  }
}
</script>

<style scoped>

</style>