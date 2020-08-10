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
        <div class="form-row">
          <div class="form-group col-md-3">
            <label for="needmore">{{$t("needmore")}}</label>
            <input type="text" class="form-control" id="needmore" disabled :value="needMore">
          </div>
          <div class="form-group col-md-3">
            <label for="startmore">{{$t("startmore")}}</label>
            <input type="text" class="form-control" id="startmore" disabled :value="longToStr(row.prepare.starttime)">
          </div>
          <div class="form-group col-md-3">
            <label for="endmore">{{$t("endmore")}}</label>
            <input type="text" class="form-control" id="endmore" disabled :value="longToStr(row.prepare.endtime)">
          </div>
          <div class="form-group col-md-3">
            <label for="confirmTime">{{$t("confirmTime")}}</label>
            <input type="text" class="form-control" id="confirmTime" disabled :value="longToStrHMS(row.prepare.createtime)">
          </div>
          <div class="form-group col-md-12" >
            <label for="remarks">{{$t("remarks")}}</label>
            <textarea class="form-control" id="remarks" rows="2" disabled :value="row.prepare.remarks1"></textarea>
          </div>
        </div>
        <hr  class="my-4" v-if="row.prepare.prestatu == '02'">
        <div class="form-row" v-if="row.prepare.prestatu == '02'">
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
        <div class="modal-footer">
<!--          <button type="button" class="btn btn-danger" @click="handleState('refuse')">{{$t("refuse")}}</button>-->
          <button type="button" v-if="row.prepare.prestatu == '01'" class="btn btn-primary"  @click="handleState('confirm')">{{$t("confirm")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";
export default {
  name: "PrepareDetail",
  props:{
    row : Object
  },
  data : function (){
    return {
    }
  },
  watch : {

  },
  methods : {
    longToStr : function (date) {
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd");
    },
    longToStrHMS : function (date){
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd hh:mm:ss");
    },
    handleState : function (stat){
      if (stat == "confirm"){
        this.$emit("confirm",this.row.prepare.id);
      }else {
        this.$("#refuseAlert").modal("show");
      }
    },
  },
  computed : {
    needMore : function (){
      if (this.row.prepare.needmore == "Y"){
        return "是";
      }else {
        return "否";
      }
    },
    isCompelet : function (){
      if (this.row.prepare.prestatu == "01"){
        return "btn-outline-danger";
      }else {
        return "btn-success";
      }
    },
    btnText:function (){
      if (this.row.prepare.prestatu == "01"){
        return "(准备中)";
      }else {
        return "(已完成)";
      }
    },
  }
}
</script>

<style scoped>

</style>