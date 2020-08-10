<template>
    <div class="modal fade" id="confirmAskTask" tabindex="-1" role="dialog" aria-labelledby="confirmAskTaskLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmAskTaskLabel">{{$t("confirm")}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="text-align: left">
                    <div class="form-group">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="needmore" id="exampleRadios1"
                                   value="Y" v-model="isNeedMore">
                            <label class="form-check-label" for="exampleRadios1">
                                {{$t("needmore")}}
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="needmore" id="exampleRadios2"
                                   value="N" v-model="isNeedMore">
                            <label class="form-check-label" for="exampleRadios2">
                                {{$t("noneedmore")}}
                            </label>
                        </div>
                        <!--  开始扩繁日期  -->
                        <div class="form-group-sm col-md-12" style="margin-top: 10px">
                            <label for="expectedTime">{{$t("startmore")}}</label>
                            <div id="expectedTime" >
                                <date-picker value-type="format" format="YYYY-MM-DD"
                                             :disabled="timeCanNull"
                                             :disabled-date="disabledBeforeToday"
                                             v-model="startDate"></date-picker>
                            </div>
                        </div>
                      <!--  预计可扩繁好的日期  -->
                      <div class="form-group-sm col-md-12" style="margin-top: 10px">
                        <label for="endmore">{{$t("endmore")}}</label>
                        <div id="endmore" >
                          <date-picker value-type="format" format="YYYY-MM-DD"
                                       :disabled="timeCanNull"
                                       :disabled-date="disabledBeforeToday"
                                       v-model="endDate"></date-picker>
                        </div>
                      </div>
                        <div class="form-group" style="margin-top: 20px">
                          <label for="remarks">{{$t("remarks")}}</label>
                          <textarea class="form-control" id="remarks" rows="3" v-model="remarks"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
                    <button type="button" class="btn btn-primary"
                    :disabled="canConfirm" @click="confirmReadyData">{{$t("confirm")}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "confirmAskTask",
        props : {
          detailId : String,
        },
        data : function () {
            return {
              isNeedMore : "Y",
              startDate : "",
              endDate : "",
              remarks:""
            }
        },
        methods : {
            disabledBeforeToday : function (time) {
                return time.getTime() < Date.now() - (1000*60*60*24);
            },
          confirmReadyData : function (){
              var retDate  = {
                isNeedMore : this.isNeedMore,
                startDate : this.startDate,
                endDate : this.endDate,
                remarks : this.remarks
              }
              this.$emit("confirmData",retDate)
          }
        },
      computed : {
        canConfirm : function (){
          if (this.isNeedMore == "Y"){
            if (this.startDate == ""){
              return true;
            }else {
              return false;
            }
          }else {
            return false;
          }
        },
        timeCanNull : function (){
          if (this.isNeedMore == "Y"){
            return false;
          }else {
            return true;
          }
        }
      }
    }
</script>

<style scoped>

</style>