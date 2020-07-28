<template>
    <div class="ask-item">
        <p>
            <button class="btn btn-sm btn-block btn-primary"
                    type="button" data-toggle="collapse" data-target="#xasdf" aria-expanded="false" aria-controls="xasdf">
                xxxxx
            </button>
        </p>
        <div class="collapse" id="xasdf">
            <div class="card card-body" style="text-align: left">
                <div class="form-row task-item-container ">
                    <!--  物种  -->
                    <div class="form-group-sm col-md-3">
                        <label for="species">{{$t("species")}}</label>
                        <input type="text" class="form-control" id="species" :value="row.animal.name" disabled>
                    </div>
                    <!--  品系（编号）  -->
                    <div class="form-group col-md-3">
                        <label for="strain">{{$t("strain")}}</label>
                        <input type="text" class="form-control" id="strain" :value="row.animal.stockId" disabled>
                    </div>
                    <!--  处女蝇  -->
                    <div class="form-group col-md-3">
                        <label for="virginFly">{{$t("virginFly")}}</label>
                        <input type="text" class="form-control" id="virginFly" :value="yesOrNo(row.detail.virginfly)" disabled>
                    </div>
                    <!--  性别  -->
                    <div class="form-group col-md-3">
                        <label for="gender">{{$t("gender")}}</label>
                        <input type="text" class="form-control" id="gender" disabled>
                    </div>
                    <!--  是否需要杂交  -->
                    <div class="form-group col-md-3">
                        <label for="isHybridizationNecessary">{{$t("isHybridizationNecessary")}}</label>
                        <input type="text" class="form-control" id="isHybridizationNecessary" disabled>
                    </div>

                    <!--  对应的杂交品系  -->
                    <div class="form-group col-md-3">
                        <label for="hybridStrain">{{$t("hybridStrain")}}</label>
                        <input type="text" class="form-control" id="hybridStrain" disabled>
                    </div>

                    <!--  特殊饲养条件  -->
                    <div class="form-group col-md-3">
                        <label for="specialFeeding">{{$t("specialFeeding")}}</label>
                        <input type="text" class="form-control" id="specialFeeding" disabled>
                    </div>

                    <!--  具体饲养条件  -->
                    <div class="form-group col-md-3">
                        <label for="specificFeeding">{{$t("specificFeeding")}}</label>
                        <input type="text" class="form-control" id="specificFeeding" disabled>
                    </div>

                    <!--  年龄 day(羽化当天记为0天)  -->
                    <div class="form-group col-md-3">
                        <label for="age">{{$t("age")}}</label>
                        <input type="text" class="form-control" id="age" disabled>
                    </div>

                    <!--  拟用数量  -->
                    <div class="form-group col-md-3">
                        <label for="orderNumber">{{$t("orderNumber")}}</label>
                        <input type="text" class="form-control" id="orderNumber" disabled>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AskTaskDetailItem",
        props : {
            row : Object
        },
        methods : {
            yesOrNo : function(flag) {
                return flag == "Y" ? "是" : "否";
            }
        }
    }
</script>

<style scoped>
.ask-item{
    margin-top: 10px;
}
</style>