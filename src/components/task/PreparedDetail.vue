<template>
  <div style="">
    <p>
      <button class="btn btn-sm btn-block"
              :class="isCompelet"
              type="button"
              data-toggle="collapse"
              :data-target="'#aa' + row.prepare.id"
              aria-expanded="false"
              :aria-controls="'aa' + row.prepare.id">
        {{row.animal.genotype + btnText}}
      </button>
    </p>
    <div class="collapse" :id="'aa' + row.prepare.id">
      <div class="card card-body">
        <div class="form-row" >
          <div class="form-group col-md-3">
            <label for="readyTime">{{$t("readyTime")}}</label>
            <input type="text" class="form-control" id="readyTime" disabled :value="longToStr(row.prepare.completetime)">
          </div>
          <div class="form-group col-md-3">
            <label for="allowTime">{{$t("allowTime")}}</label>
            <input type="text" class="form-control" id="allowTime" disabled :value="longToStr(row.prepare.realexptime)">
          </div>
          <div class="form-group col-md-3">
            <label for="realAge">{{$t("realAge")}}</label>
            <input type="text" class="form-control" id="realAge" disabled :value="row.prepare.realage">
          </div>
          <div class="form-group col-md-3">
            <label for="realNumber">{{$t("realNumber")}}</label>
            <input type="text" class="form-control" id="realNumber" disabled :value="row.prepare.realnumber">
          </div>
          <div class="form-group col-md-12" >
            <label for="remarks2">{{$t("remarks")}}</label>
            <textarea class="form-control" id="remarks2" rows="2" disabled :value="row.prepare.reamrks2"></textarea>
          </div>
        </div>
        <hr  class="my-4" v-if="row.confirm != null">
        <div class="form-row" v-if="row.confirm != null">
          <div class="form-group col-md-3">
            <label for="isComplete">{{$t("isComplete")}}</label>
            <input type="text" class="form-control" id="isComplete" disabled :value="yesOrNo(row.confirm.iscomplete)">
          </div>
          <div class="form-group col-md-12" >
            <label for="remarks">{{$t("remarks")}}</label>
            <textarea class="form-control" id="remarks" rows="2" disabled :value="row.confirm.remarks"></textarea>
          </div>
        </div>
        <div class="modal-footer" v-if="row.prepare.prestatu == '02' || this.$store.getters.isCurrentUser(this.task.createuser)">
          <button type="button" class="btn btn-primary"  @click="handleState('confirm')">{{$t("confirm")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";

export default {
  name: "PreparedDetail",
  props:{
    row : Object,
    task : Object
  },
  methods: {
    longToStr : function (date) {
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd");
    },
    handleState : function (stat){
      if (stat == "confirm"){
        this.$emit("confirmTask",this.row.prepare.id);
      }else if (stat == "refuse"){
        this.$("#refuseAlert").modal("show");
      }
    },
    refuseFun : function (reason,remarks){
      console.log(reason,remarks);
    },
    yesOrNo : function (flag){
      if (flag == "Y"){
        return this.$t("yes");
      }else {
        return this.$t("no");
      }
    }
  },
  computed:{
    btnText:function (){
      if (this.row.prepare.prestatu == "02"){
        return "(未确认)";
      }else if (this.row.prepare.prestatu == "03"){
        return "(已完成)";
      }else {
        return "(未完成)"
      }
    },
    isCompelet : function (){
      if (this.row.prepare.prestatu == "02"){
        return "btn-outline-danger";
      }else if (this.row.prepare.prestatu == "03"){
        return "btn-success";
      }else {
        return "btn-danger";
      }
    },

  }
}
</script>

<style scoped>

</style>