<template>
  <div class="modal fade" id="confirmPrepared" tabindex="-1" role="dialog" aria-labelledby="confirmPreparedLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmPreparedLabel">{{$t("confirm")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
<!--            <a-switch checked-children="开" un-checked-children="关" default-checked />-->
            <div class="form-group col-md-12">
              <label for="isComplete">{{$t("isComplete")}}</label>
              <div id="isComplete">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="isComplete" id="inlineRadio1"
                         v-model="isComplete" value="Y">
                  <label class="form-check-label" for="inlineRadio1">{{ $t("yes") }}</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="isComplete" id="inlineRadio2"
                         v-model="isComplete" value="N">
                  <label class="form-check-label" for="inlineRadio2">{{ $t("no") }}</label>
                </div>
              </div>
            </div>
            <div class="form-group col-md-12">
              <label for="remarks">{{$t("remarks")}}</label>
              <textarea class="form-control" id="remarks" rows="3" v-model="remarks"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ $t("cancel") }}</button>
          <button type="button" class="btn btn-primary" @click="confirmTask">{{$t("confirm")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comfirmPrepared",
  props :{
    prepareId : String
  },
  data : function (){
    return {
      isComplete : "Y",
      remarks : ""
    }
  },
  methods : {
    confirmTask : function (){
      var postData = {
        id : this.prepareId,
        isComplete : this.isComplete,
        remarks : this.remarks
      }
      this.$emit("submitData",postData);
    }
  }
}
</script>

<style scoped>

</style>