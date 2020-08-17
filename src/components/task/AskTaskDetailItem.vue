<template>
    <div class="ask-item">
        <p>
            <button class="btn btn-sm btn-block"
                    :class="detailStatClass"
                    type="button"
                    data-toggle="collapse"
                    :data-target="'#aa'+ row.detail.id"
                    aria-expanded="false"
                    :aria-controls="'aa' + row.detail.id">
                {{row.animal.genotype + detailStatText}}
            </button>
        </p>
        <div class="collapse" :id=" 'aa' + row.detail.id">
            <div class="card card-body" style="text-align: left">
                <div class="form-row">
                    <div class="form-group col-md-3">
                      <label :for="'expectedTime' + row.detail.id">{{$t("expectedTime")}}</label>
                      <input type="text" class="form-control" disabled="disabled"
                             :id="'expectedTime' + row.detail.id" :value="longToStr(row.detail.expectedtime)">
                    </div>
                    <div class="form-group-sm col-md-3 was-validated">
                      <label :for="'Purpose' + row.detail.id">{{$t("purpose")}}</label>
                      <input type="text" class="form-control" :id="'Purpose' + row.detail.id" :value="row.detail.purpose" disabled>
                    </div>
                    <!--  物种  -->
                    <div class="form-group-sm col-md-3">
                        <label :for="'species' + row.detail.id">{{$t("species")}}</label>
                        <input type="text" class="form-control" :id="'species' + row.detail.id" :value="row.animal.name" disabled>
                    </div>
                    <!--  品系（编号）  -->
                    <div class="form-group col-md-3">
                        <label :for="'strain'+ row.detail.id">{{$t("strain")}}</label>
                        <input type="text" class="form-control" :id="'strain' + row.detail.id" :value="row.animal.stockId" disabled>
                    </div>
                    <!--  处女蝇  -->
                    <div class="form-group col-md-3">
                        <label :for="'virginFly' + row.detail.id">{{$t("virginFly")}}</label>
                        <input type="text" class="form-control" :id="'virginFly' + row.detail.id" :value="yesOrNo(row.detail.virginfly)" disabled>
                    </div>
                    <!--  性别  -->
                    <div class="form-group col-md-3">
                        <label :for="'gender'+row.detail.id">{{$t("gender")}}</label>
                        <input type="text" class="form-control" :id="'gender'+row.detail.id" disabled :value="gender(row.detail.gender)">
                    </div>
                    <!--  是否需要杂交  -->
                    <div class="form-group col-md-3">
                        <label :for="'isHybridizationNecessary'+row.detail.id">{{$t("isHybridizationNecessary")}}</label>
                        <input type="text" class="form-control" :id="'isHybridizationNecessary'+row.detail.id" disabled :value="yesOrNo(row.detail.ishybridizationnecessary)">
                    </div>

                    <!--  对应的杂交品系  -->
                    <div class="form-group col-md-3">
                        <label :for="'hybridStrain'+row.detail.id">{{$t("hybridStrain")}}</label>
                        <input type="text" class="form-control" :id="'hybridStrain'+row.detail.id" disabled :value="row.detail.hybridstrain">
                    </div>

                    <!--  特殊饲养条件  -->
                    <div class="form-group col-md-3">
                        <label :for="'specialFeeding'+row.detail.id">{{$t("specialFeeding")}}</label>
                        <input type="text" class="form-control" :id="'specialFeeding'+row.detail.id" disabled :value="specialFeeding(row.detail.specialfeeding)">
                    </div>

                    <!--  具体饲养条件  -->
                    <div class="form-group col-md-3">
                        <label :for="'specificFeeding'+row.detail.id">{{$t("specificFeeding")}}</label>
                        <input type="text" class="form-control" :id="'specificFeeding'+row.detail.id" disabled :value="row.detail.specificfeeding">
                    </div>
                    <!--  年龄 day(羽化当天记为0天)  -->
                    <div class="form-group col-md-3">
                        <label :for="'age'+row.detail.id">{{$t("age")}}</label>
                        <input type="text" class="form-control" :id="'age'+row.detail.id" disabled :value="row.detail.age">
                    </div>
                    <!--  拟用数量  -->
                    <div class="form-group col-md-3">
                        <label :for="'orderNumber'+row.detail.id">{{$t("orderNumber")}}</label>
                        <input type="text" class="form-control" :id="'orderNumber'+row.detail.id" disabled :value="row.detail.ordernumber">
                    </div>
                  <!--  操作流程  -->
                  <div class="form-group-sm col-md-12">
                    <label :for="'operationProcess'+row.detail.id">{{$t("operationProcess")}}</label>
                    <textarea class="form-control" :id="'operationProcess'+row.detail.id" rows="1" disabled="disabled" :value="row.detail.operationprocess"></textarea>
                  </div>
                  <!--  拒绝原因  -->
                  <div class="form-group-sm col-md-12" v-if="hasReason != null">
                    <label :for="'refuseReason'+row.detail.id">{{$t("refuse") + $t("reason")}}</label>
                    <textarea class="form-control" :id="'refuseReason'+row.detail.id" rows="1" disabled="disabled" :value="row.fail.reason"></textarea>
                  </div>
                </div>
                <div class="modal-footer" style="margin-top: 10px" v-if="row.detail.confirmstatu == '00' && this.$store.getters.isCurrentUser(task.currentuser)">
                  <button type="button" class="btn btn-danger" @click="handleState('refuse')">{{$t("refuse")}}</button>
                  <button type="button" class="btn btn-primary" @click="handleState('confirm')">{{$t("confirm")}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {formatDate} from "@/components/publib/date";

    export default {
      name: "AskTaskDetailItem",
      props : {
            row : Object,
        task:Object,
        },
        methods : {
            handleState(stat){
              this.$emit("handler",stat,this.row.detail.id);
            },
            longToStr : function (date) {
              var d = new Date(date)
              return formatDate(d,"yyyy-MM-dd");
            },
            yesOrNo : function(flag) {
                return flag == "Y" ? this.$t("yes") : this.$t("no");
            },
            gender : function (f) {
                if (f == "male"){
                    return this.$t("male");
                }else if(f == "female"){
                    return this.$t("female");
                }else {
                    return this.$t("empty");
                }
            },
            specialFeeding : function (s) {
                if (s == "N"){
                    return this.$t('normal');
                }else {
                    return this.$t('special');
                }
            }
        },
      watch:{
        row : {
          handler:function (newVal){
            console.log(newVal);
          },
          deep : true
        }
      },
      computed : {
        detailStatClass : function (){
          if (this.row.detail.confirmstatu == "00"){
            return "btn-outline-danger";
          }else if (this.row.detail.confirmstatu == "01"){
            return "btn-success";
          }else if (this.row.detail.confirmstatu == "02"){
            return "btn-danger";
          }
          return "";
        },
        detailStatText : function (){
          if (this.row.detail.confirmstatu == "00"){
            return "(未确认)";
          }else if (this.row.detail.confirmstatu == "01"){
            return "(已确认)";
          }else if (this.row.detail.confirmstatu == "02"){
            return "(已拒绝)";
          }
          return "";
        },
        hasReason:function (){
          if (this.row.detail.confirmstatu == "02"){
            return this.row.fail.reason;
          }else{
            return null;
          }
        }
      }
    }
</script>

<style scoped>
.ask-item{
    margin-top: 10px;
}
</style>