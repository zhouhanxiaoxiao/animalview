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
                    <div class="stock-item-detail" v-for="row in rows" :key="row.stock.id">
                        <p>
                            <button class="btn btn-outline-primary btn-sm btn-block" type="button" data-toggle="collapse" :data-target="'#' + row.stock.id" aria-expanded="false" :aria-controls="row.stock.id">
                                {{row.animal.genotype}}
                            </button>
                        </p>
                        <div class="collapse" :id="row.stock.id">
                            <div class="card card-body">
                                <div class="form-row task-item-container">
                                    <!--  实验负责人  -->
                                    <div class="form-group-sm col-md-3">
                                        <label for="studyDirector">{{$t("studyDirector")}}</label>
                                        <input type="text" class="form-control" id="studyDirector" placeholder="例：曲素素">
                                    </div>
                                    <!--  实验目的  -->
                                    <div class="form-group-sm col-md-3">
                                        <label for="Purpose">{{$t("purpose")}}</label>
                                        <input type="text" class="form-control" id="Purpose" placeholder="例：药物实验-control-001">
                                    </div>
                                    <!--  物种  -->
                                    <div class="form-group-sm col-md-3">
                                        <label for="species">{{$t("species")}}</label>
                                        <input type="text" class="form-control" id="species" :value="row.animal.name" disabled placeholder="例：果蝇">
                                    </div>
                                    <!--  品系（编号）  -->
                                    <div class="form-group col-md-3">
                                        <label for="strain">{{$t("strain")}}</label>
                                        <input type="text" class="form-control" id="strain" :value="row.animal.stockId" disabled placeholder="例：w1118">
                                    </div>
                                    <!--  处女蝇  -->
                                    <div class="form-group col-md-4">
                                        <label for="virginFly">{{$t("virginFly")}}</label>
                                        <div id="virginFly">
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="virginFly" id="yes" checked value="Y">
                                                <label class="form-check-label" for="yes">{{$t('yes')}}</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="virginFly" id="no" value="N">
                                                <label class="form-check-label" for="no">{{$t('no')}}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <!--  性别  -->
                                    <div class="form-group col-md-4">
                                        <label for="gender">{{$t("gender")}}</label>
                                        <div id="gender">
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="gender" id="male" checked value="male">
                                                <label class="form-check-label" for="male">{{$t('male')}}</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="gender" id="female" value="female">
                                                <label class="form-check-label" for="female">{{$t('female')}}</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="gender" id="empty" value="empty">
                                                <label class="form-check-label" for="empty">{{$t('empty')}}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <!--  是否需要杂交  -->
                                    <div class="form-group col-md-4">
                                        <label for="isHybridizationNecessary">{{$t("isHybridizationNecessary")}}</label>
                                        <div id="isHybridizationNecessary">
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="isHybridizationNecessary" id="yes2" value="Y">
                                                <label class="form-check-label" for="yes2">{{$t('yes')}}</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="isHybridizationNecessary" id="no2" checked value="N">
                                                <label class="form-check-label" for="no2">{{$t('no')}}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <!--  对应的杂交品系  -->
                                    <div class="form-group-sm col-md-4">
                                        <label for="hybridStrain">{{$t("hybridStrain")}}</label>
                                        <input type="text" class="form-control" id="hybridStrain" disabled placeholder="例：">
                                    </div>
                                    <!--  特殊饲养条件  -->
                                    <div class="form-group-sm col-md-4">
                                        <label for="specialFeeding">{{$t("specialFeeding")}}</label>
                                        <input type="text" class="form-control" id="specialFeeding" placeholder="例：常规">
                                    </div>
                                    <!--  具体饲养条件  -->
                                    <div class="form-group-sm col-md-4">
                                        <label for="specificFeeding">{{$t("specificFeeding")}}</label>
                                        <input type="text" class="form-control" id="specificFeeding" placeholder="例：无">
                                    </div>
                                    <!--  年龄 day(羽化当天记为0天)  -->
                                    <div class="form-group-sm col-md-4">
                                        <label for="age">{{$t("age")}}</label>
                                        <input type="text" class="form-control" id="age" placeholder="例：2">
                                    </div>
                                    <!--  拟用数量  -->
                                    <div class="form-group-sm col-md-4">
                                        <label for="orderNumber">{{$t("orderNumber")}}</label>
                                        <input type="number" class="form-control" id="orderNumber" :max="row.stock.number" placeholder="例：36">
                                    </div>
                                    <!--  预计实验时间  -->
                                    <div class="form-group-sm col-md-3">
                                        <label for="expectedTime">{{$t("expectedTime")}}</label>
                                        <date-picker id="expectedTime"></date-picker>
                                    </div>
                                    <!--  操作流程  -->
                                    <div class="form-group-sm col-md-12">
                                        <label for="operationProcess">{{$t("operationProcess")}}</label>
                                        <textarea class="form-control" id="operationProcess" placeholder="例：转管，喂食：先CO2麻醉，转移到新的管子，喂食含有染料的蔗糖水" rows="3"></textarea>
                                    </div>

                                    <!--  备注  -->
                                    <div class="form-group-sm col-md-12">
                                        <label for="remarks">{{$t("remarks")}}</label>
                                        <textarea class="form-control" id="remarks" placeholder="例：我很着急" rows="3"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t('cancel')}}</button>
                    <button type="button" class="btn btn-primary">{{$t('confirm')}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AppointmentDialog",
        components: {
        },
        props : {
            stockIds : Array
        },
        data:function(){
          return{
              time1 : "",
              rows : []
          }
        },
        watch:{
            stockIds(newValue){
                var postData = {
                    stockIds : newValue
                }
                var _this = this;
                this.$axios.post("/orderTask/init",postData).then(function (res) {
                    console.log(res);
                    _this.rows = res.data.retMap.stockTable;
                })
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