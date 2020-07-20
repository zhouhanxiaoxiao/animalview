<template>
    <div class="modal fade"
         id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{{$t('orderDetail')}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-row">
                        <!--  实验负责人  -->
                        <div class="form-group-sm col-md-3 was-validated">
                            <label for="studyDirector">{{$t("studyDirector")}}</label>
                            <multiselect id="studyDirector"
                                         v-model="selectedStudyDirector"
                                         :options="studyDirectors"
                                         :searchable="true"
                                         :close-on-select="true"
                                         :allow-empty="false"
                                         :show-labels="false"
                                         track-by="name"
                                         label="name"
                                         required
                                         :multiple="true"
                                         :taggable="true"
                                         placeholder="例：曲素素">
                                <span slot="noResult">{{$t('noUser')}}</span>
                            </multiselect>
                        </div>
                        <!--  实验目的  -->
                        <div class="form-group-sm col-md-3 was-validated">
                            <label for="Purpose">{{$t("purpose")}}</label>
                            <input type="text" class="form-control" id="Purpose" v-model="purpose"
                                   required
                                   placeholder="例：药物实验-control-001">
                        </div>
                        <!--  预计实验时间  -->
                        <div class="form-group-sm col-md-4">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <div id="expectedTime" >
                                <date-picker v-model="expectedTime" value-type="format" format="YYYY-MM-DD" :disabled-date="disabledDate"></date-picker>
                            </div>
                        </div>
                        <!--  加急  -->
                        <div class="form-group col-md-2 form-check">
                            <label for="urgent"></label>
                            <switchbox-cont :text="$t('urgent')" @getValue="getValue" id="urgent"></switchbox-cont>
                        </div>
                    </div>
                    <div>
                        实验材料：
                    </div>
                    <order-item-detail v-for="row in rows" :key="row.stock.id" :row="row" :all-drosophila="allDrosophila"
                                       @updateData="updateDetailData"></order-item-detail>
                    <!--  操作流程  -->
                    <div class="form-group-sm col-md-12">
                        <label for="operationProcess">{{$t("operationProcess")}}</label>
                        <textarea class="form-control" id="operationProcess" v-model="operationProcess" placeholder="例：转管，喂食：先CO2麻醉，转移到新的管子，喂食含有染料的蔗糖水" rows="3"></textarea>
                    </div>
                    <!--  备注  -->
                    <div class="form-group-sm col-md-12">
                        <label for="remarks">{{$t("remarks")}}</label>
                        <textarea class="form-control" id="remarks" v-model="remarks" placeholder="例：我很着急" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t('cancel')}}</button>
                    <button type="button" class="btn btn-primary" :disabled="!canSubmit" @click="submitTask">{{$t('confirm')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import OrderItemDetail from "@/components/stockcenter/OrderItemDetail";
    import SwitchboxCont from "@/components/publib/SwitchboxCont";
    export default {
        name: "AppointmentDialog",
        components: {
            SwitchboxCont,
            OrderItemDetail
        },
        props : {
            stockIds : Array
        },
        data:function(){
          return{
              rows : [],
              orderList:{},
              selectedStudyDirector : [],
              purpose : "",
              expectedTime : "",
              operationProcess : "",
              remarks : "",
              studyDirectors : [],
              allDrosophila : [],
              detailData : {},
              urgent : false
          }
        },
        methods : {
            disabledDate : function (time) {
                var now = Date.now();
                var before = now + (1000*60*60*24) * 14;
                return time.getTime() < new Date(before);
            },
            updateDetailData : function (data) {
                this.$set(this.detailData,data.pkid,data.data);
            },
            submitTask : function () {
                var postData = {
                    selectedStudyDirector : this.selectedStudyDirector,
                    purpose : this.purpose,
                    expectedTime : this.expectedTime,
                    operationProcess : this.operationProcess,
                    remarks : this.remarks,
                    urgent : this.urgent,
                    detailData : this.detailData
                }
                this.$emit('submitData',{postData:postData});
                this.$("#exampleModal").modal('hide');
            },
            getValue : function (data) {
                this.urgent = data;
            }
        },
        watch:{
            stockIds(newValue){
                var postData = {
                    stockIds : newValue
                }
                var _this = this;
                this.$axios.post("/orderTask/init",postData).then(function (res) {
                    if (res.data.code != '200'){
                        _this.$toast(_this.$t(res.data.code));
                    }else {
                        _this.rows = res.data.retMap.stockTable;
                        _this.studyDirectors = res.data.retMap.researchers;
                        _this.allDrosophila = res.data.retMap.allDrosophila;
                        for (var item in _this.detailData){
                            _this.$delete(_this.detailData,item);
                        }
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$toast(_this.$t("systemErr"));
                });
            },
        },

        computed : {
            canSubmit : function () {
                var count = 0;
                // eslint-disable-next-line no-unused-vars
                for(var item in this.detailData){
                    if(!this.detailData[item].allReady){
                        return false;
                    }
                    count = count + 1;
                }
                if (count != this.rows.length){
                    return false
                }
                if (this.selectedStudyDirector.length == 0){
                    return false;
                }
                if (this.purpose == ""){
                    return false;
                }
                if (this.expectedTime == ""){
                    return false;
                }
                return true;
            }
        }
    }
</script>

<style scoped>
    .task-item-container{
        font-size: 14px;
    }
    .stock-item-detail{
        margin-top: 10px;
        width: 90%;
        margin-left: 5%;
    }
</style>
