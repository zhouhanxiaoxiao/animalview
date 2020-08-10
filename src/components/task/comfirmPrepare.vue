<template>
  <div class="modal fade" id="confirmPrepare" tabindex="-1" role="dialog" aria-labelledby="confirmPrepareLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmPrepareLabel">{{$t("confirm")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <!-- 样本准备日期ready -->
            <div class="form-group col-md-12">
              <label for="readyTime">{{$t("readyTime")}}</label>
              <div id="readyTime" >
                <date-picker value-type="format" format="YYYY-MM-DD"
                             :disabled-date="disabledBeforeToday"
                             v-model="readyTime"></date-picker>
              </div>
            </div>
            <!-- 可以实验时间 -->
            <div class="form-group col-md-12">
              <label for="allowTime">{{$t("allowTime")}}</label>
              <div id="allowTime" >
                <date-picker value-type="format" format="YYYY-MM-DD"
                             :disabled-date="disabledBeforeToday"
                             v-model="allowTime"></date-picker>
              </div>
            </div>
            <!-- 实际果蝇年龄 -->
            <div class="form-group col-md-12" >
              <label for="realAge">{{$t("realAge")}}</label>
              <input type="number" min="0" class="form-control" :class="ageisValid" id="realAge" v-model="realAge">
            </div>
            <!-- 实际果蝇数量 -->
            <div class="form-group col-md-12" >
              <label for="realNumber">{{$t("realNumber")}}</label>
              <input type="number" min="0" class="form-control" :class="isValid" id="realNumber" v-model="realNumber">
            </div>

            <div class="form-group col-md-12" >
              <label for="remarks2">{{$t("remarks")}}</label>
              <textarea class="form-control" id="remarks2" rows="2" v-model="remarks"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
          <button type="button" class="btn btn-primary" :disabled="canClick" @click="completePrep">{{$t("confirm")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "comfirmPrepare",
  props : {
    preid : String
  },
  data : function (){
    return{
      readyTime : "",
      allowTime : "",
      remarks : "",
      realAge : 0,
      realNumber : 1,
      isValid : "",
      ageisValid : ""
    }
  },
  methods:{
    disabledBeforeToday : function (time) {
      return time.getTime() < Date.now() - (1000*60*60*24);
    },
    completePrep : function (){
      if (this.checkDate()){
        return;
      }
      var postData = {
        id : this.preid,
        readyTime : this.readyTime,
        allowTime : this.allowTime,
        remarks : this.remarks,
        realAge : this.realAge,
        realNumber : this.realNumber
      }
      this.$emit("comfirmPrep",postData);
    },
    checkDate : function (){
      if (this.readyTime == ""){
        return true;
      }
      if (this.allowTime == ""){
        return true;
      }
      if (this.realAge < 0){
        return true;
      }
      if (this.realNumber < 1){
        return true;
      }
      return false;
    }
  },
  watch:{
    realNumber(newVal){
      this.checkDate();
      if (newVal<1){
        this.isValid = "is-invalid";
      }else {
        this.isValid = "is-valid";
      }
    },
    realAge(newVal){
      this.checkDate();
      if (newVal>=0){
        this.ageisValid = "is-valid";
      }else {
        this.ageisValid = "is-invalid";
      }
    },
    readyTime(){
      this.checkDate();
    },
    allowTime(){
      this.checkDate();
    }
  },
  computed : {
    canClick : function (){
      return this.checkDate();
    }
  }
}
</script>

<style scoped>

</style>