<template>
    <div class="stock-item-detail">
        <p>
            <button class="btn btn-sm btn-block" :class="allReady ?'btn-primary' : 'btn-outline-danger'"
                    type="button" data-toggle="collapse" :data-target="'#' + row.stock.id" aria-expanded="false"
                    :aria-controls="row.stock.id">
                {{btnText}}
            </button>
        </p>
        <div class="collapse" :id="row.stock.id">
            <div class="card card-body">
                <div class="form-row task-item-container ">
                    <!--  物种  -->
                    <div class="form-group-sm col-md-6">
                        <label for="species">{{$t("species")}}</label>
                        <input type="text" class="form-control" id="species" :value="row.animal.name" disabled placeholder="例：果蝇">
                    </div>
                    <!--  品系（编号）  -->
                    <div class="form-group col-md-6">
                        <label for="strain">{{$t("strain")}}</label>
                        <input type="text" class="form-control" id="strain" :value="row.animal.stockId" disabled placeholder="例：w1118">
                    </div>
                    <!--  处女蝇  -->
                    <div class="form-group col-md-3">
                        <label for="virginFly">{{$t("virginFly")}}</label>
                        <div id="virginFly">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'virginFly' + row.stock.id " id="yes" v-model="virginFly" checked value="Y">
                                <label class="form-check-label" for="yes">{{$t('yes')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'virginFly' + row.stock.id " id="no" v-model="virginFly" value="N">
                                <label class="form-check-label" for="no">{{$t('no')}}</label>
                            </div>
                        </div>
                    </div>
                    <!--  性别  -->
                    <div class="form-group col-md-3">
                        <label for="gender">{{$t("gender")}}</label>
                        <div id="gender">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'gender'+ row.stock.id" id="male" v-model="gender" checked value="male">
                                <label class="form-check-label" for="male">{{$t('male')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'gender'+ row.stock.id" id="female" v-model="gender" value="female">
                                <label class="form-check-label" for="female">{{$t('female')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'gender'+ row.stock.id" id="empty" v-model="gender" value="empty">
                                <label class="form-check-label" for="empty">{{$t('empty')}}</label>
                            </div>
                        </div>
                    </div>
                    <!--  是否需要杂交  -->
                    <div class="form-group col-md-3">
                        <label for="isHybridizationNecessary">{{$t("isHybridizationNecessary")}}</label>
                        <div id="isHybridizationNecessary">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'isHybridizationNecessary'+ row.stock.id"
                                       v-model="isHybridizationNecessary"
                                       id="yes2" value="Y">
                                <label class="form-check-label" for="yes2">{{$t('yes')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'isHybridizationNecessary'+ row.stock.id"
                                       v-model="isHybridizationNecessary"
                                       id="no2" checked value="N">
                                <label class="form-check-label" for="no2">{{$t('no')}}</label>
                            </div>
                        </div>
                    </div>
                    <!--  对应的杂交品系  -->
                    <div class="form-group-sm col-md-3" :class=" isHybridizationNecessary == 'Y' ? 'was-validated':''">
                        <label for="hybridStrain">{{$t("hybridStrain")}}</label>
                        <multiselect id="hybridStrain"
                                     v-model="hybridStrain"
                                     :options="allDrosophila"
                                     :searchable="true"
                                     :close-on-select="true"
                                     :allow-empty="isHybridizationNecessary == 'N'"
                                     :disabled="isHybridizationNecessary == 'N'"
                                     :show-labels="false"
                                     track-by="genotype"
                                     label="genotype">
                            <span slot="noResult"></span>
                        </multiselect>
<!--                        <input type="text" class="form-control" id="hybridStrain" v-model="hybridStrain"-->
<!--                               :disabled="isHybridizationNecessary == 'N'"-->
<!--                               :required="isHybridizationNecessary == 'Y'"-->
<!--                               placeholder="例：">-->
                    </div>
                    <!--  特殊饲养条件  -->
                    <div class="form-group-sm col-md-3">
                        <label for="specialFeeding">{{$t("specialFeeding")}}</label>
                        <div id="specialFeeding">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'specialFeeding'+ row.stock.id"
                                       v-model="specialFeeding"
                                       id="yes3" value="N">
                                <label class="form-check-label" for="yes3">{{$t('normal')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'specialFeeding'+ row.stock.id"
                                       v-model="specialFeeding"
                                       id="no3" checked value="Y">
                                <label class="form-check-label" for="no3">{{$t('special')}}</label>
                            </div>
                        </div>
                    </div>
                    <!--  具体饲养条件  -->
                    <div class="form-group-sm col-md-3" :class="specialFeeding == 'Y' ? 'was-validated':''">
                        <label for="specificFeeding">{{$t("specificFeeding")}}</label>
                        <input type="text" class="form-control" id="specificFeeding"
                               :disabled="specialFeeding == 'N'"
                               :required="specialFeeding == 'Y'"
                               v-model="specificFeeding" placeholder="例：无">
                    </div>
                    <!--  年龄 day(羽化当天记为0天)  -->
                    <div class="form-group-sm col-md-3">
                        <label for="age">{{$t("age")}}</label>
                        <input type="number" class="form-control"
                               :class="age >= 0 ? 'is-valid' : 'is-invalid'"
                               id="age" v-model="age" placeholder="例：2">
                    </div>
                    <!--  拟用数量  -->
                    <div class="form-group-sm col-md-3">
                        <label for="orderNumber">{{$t("orderNumber")}}</label>
                        <input type="number" class="form-control"
                               :class="orderNumber > 0 ? 'is-valid' : 'is-invalid'"
                               id="orderNumber"  v-model="orderNumber"
                               placeholder="例：36">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "OrderItemDetail",
        props : {
            row : Object,
            allDrosophila : Array
        },
        data:function () {
            return{
                virginFly: "Y",
                gender : "male",
                isHybridizationNecessary : "N",
                hybridStrain : "",
                specialFeeding : "N",
                specificFeeding : "",
                age : 0,
                orderNumber : 0,
                allReady : false,
            }
        },
        methods : {
            handleData(){
                this.allReady = this.checkData();
                var hybridStrainId = "";
                if (this.isHybridizationNecessary == "Y"){
                    hybridStrainId = this.hybridStrain.id;
                }
                var retData = {
                    virginFly : this.virginFly,
                    gender : this.gender,
                    isHybridizationNecessary : this.isHybridizationNecessary,
                    hybridStrainId : hybridStrainId,
                    specialFeeding : this.specialFeeding,
                    specificFeeding : this.specificFeeding,
                    age : this.age,
                    orderNumber : this.orderNumber,
                    allReady : this.allReady
                }
                this.$emit("updateData",{pkid : this.row.stock.id, data : retData});
            },
            checkData : function () {
                if (this.isHybridizationNecessary == "Y"
                && this.hybridStrain == ""){
                    return false;
                }
                if (this.specialFeeding == "Y"
                && this.specificFeeding == ""){
                    return false;
                }
                if (this.age <0){
                    return false;
                }
                if (this.orderNumber<=0){
                    return false;
                }
                return true;
            }
        },
        watch : {
            species(){
                this.handleData();
            },
            strain(){
                this.handleData();
            },
            virginFly(){
                this.handleData();
            },
            gender(){
                this.handleData();
            },
            isHybridizationNecessary(newValue){
                if (newValue == 'N'){
                    this.hybridStrain = "";
                }
                this.handleData();
            },
            hybridStrain(newValue){
                console.log(newValue);
                this.handleData();
            },
            specialFeeding(newVal){
                if (newVal == "N"){
                    this.specificFeeding = "";
                }
                this.handleData();
            },
            specificFeeding(){
                this.handleData();
            },
            age(){
                this.handleData();
            },
            orderNumber(){
                this.handleData();
            },
        },
        computed : {
            btnText : function () {
                var text = this.row.animal.genotype;
                if(!this.allReady){
                    text +="(" + this.$t('incompleteInformation') + ")";
                }else {
                    text +="(" + this.$t('completeInformation') + ")";
                }
                return text;
            }
        }
    }
</script>

<style scoped>

</style>