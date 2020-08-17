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
                      <!--  材料提供人员  -->
                      <div class="form-group-sm col-md-3 was-validated">
                        <label for="studyDirector">{{$t("supporter")}}</label>
                        <multiselect id="supporter"
                                     v-model="supporter"
                                     :options="supporters"
                                     :searchable="true"
                                     :close-on-select="true"
                                     :allow-empty="false"
                                     :show-labels="false"
                                     track-by="name"
                                     label="name"
                                     required
                                     :taggable="true"
                                     placeholder="例：曲素素">
                          <span slot="noResult">{{$t('noUser')}}</span>
                        </multiselect>
                      </div>
                        <!--  加急  -->
                        <div class="form-group col-md-2 form-check">
                            <label for="urgent"></label>
                            <switchbox-cont :text="$t('urgent')" @getValue="getValue" id="urgent"></switchbox-cont>
                        </div>
                    </div>
                    <div>
                      {{$t("expectionObject")}}：
                    </div>
                    <order-item-detail v-for="row in rows" :key="row.stock.id" :row="row"
                                       :all-drosophila="allDrosophila"
                                       :all-merial="allMerial"
                                       @updateData="updateDetailData"></order-item-detail>

                    <!--  备注  -->
                    <div class="form-group-sm col-md-12">
                        <label for="remarks">{{$t("remarks")}}</label>
                        <textarea class="form-control" id="remarks" v-model="remarks" placeholder="例：我很着急" rows="3"></textarea>
                    </div>
                </div>
                <div class="modal-footer" >
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
              supporter: {},
              remarks : "",
              supporters : [],
              studyDirectors : [],
              allDrosophila : [],
              detailData : {},
              urgent : "",
              allMerial:[]
          }
        },
        methods : {
            updateDetailData : function (data) {
                this.$set(this.detailData,data.pkid,data.data);
            },
            submitTask : function () {
                var selectedStudyId = new Array();
                for (var i=0;i<this.selectedStudyDirector.length;i++){
                    selectedStudyId.push(this.selectedStudyDirector[i].id);
                }
                var postData = {
                    selectedStudyId : selectedStudyId,
                    remarks : this.remarks,
                    urgent : this.urgent,
                  supporter : this.supporter.id,
                    detailData : this.detailData
                }
                this.$emit('submitData',{postData:postData});
                this.$("#exampleModal").modal('hide');
            },
            getValue : function (data) {
                if (data){
                    this.urgent = "1";
                }else {
                    this.urgent = "0";
                }
            }
        },
        watch:{
            stockIds(newValue,oldValue){
                var boolean = true;
                if (newValue.length == oldValue.length){
                    for (var i = 0;i<newValue.length;i++){
                        for (var j = 0;j<oldValue.length;j++){
                            if (newValue[i] != oldValue[j]){
                                boolean = false;
                            }
                        }
                    }
                }else {
                    boolean = false;
                }
                /*如果预约的果蝇相同，则不更新页面*/
                if (boolean){
                    return;
                }
                var postData = {
                    stockIds : newValue
                }
                var _this = this;
                this.$axios.post("/orderTask/init",postData).then(function (res) {
                    if (res.data.code != '200'){
                        _this.$message.error(_this.$t(res.data.code));
                    }else {
                        console.log(res);
                        _this.rows = res.data.retMap.stockTable;
                        _this.studyDirectors = res.data.retMap.researchers;
                        _this.allDrosophila = res.data.retMap.allDrosophila;
                        _this.supporters = res.data.retMap.supporters;
                        _this.allMerial = res.data.retMap.allMerial;
                        for (var item in _this.detailData){
                            _this.$delete(_this.detailData,item);
                        }
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$message.error(_this.$t("systemErr"));
                });
            }
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
