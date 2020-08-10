<template>
    <div class="animal-stock-container">
        <top-nav></top-nav>
        <div class="enter-animal-stock">
            <div class="alert alert-danger" role="alert" v-if="this.$.trim(errall) != ''">
                {{errall}}
            </div>
            <form>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="stockID">{{$t("animal_stock_stockID")}}</label>
                        <input type="text" class="form-control" :class="stockIDValid" id="stockID" v-model="stockID">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="genotype">{{$t("animal_stock_genotype")}}</label>
                        <div class="input-group">
                            <input type="text" class="form-control" :class="genotypeValid" id="genotype" v-model="genotype"
                                   aria-describedby="checkExist">
                            <div class="input-group-append">
                                <button class="btn btn-outline-primary" type="button" id="checkExist"
                                        @click="checkExist" :disabled="checkExistFlag">{{$t("checkExist")}}</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group col-md-3">
                        <label for="resource">{{$t("animal_stock_resource")}}</label>
                        <input type="text" class="form-control" :class="resourceValid" id="resource" v-model="resource">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <label for="container">{{$t("animal_stock_container")}}</label>
                        <input type="text" class="form-control" :class="containerValid" id="container" v-model="container">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="number">{{$t("animal_stock_number")}}</label>
                        <input type="number" class="form-control" :class="numberValid" id="number" v-model="number">
                    </div>
                    <div class="form-group col-md-3">
                        <label for="environment">{{$t("animal_stock_environment")}}</label>
                        <select id="environment" class="form-control" :class="environmentValid" v-model="environmentId">
                            <option selected value="">{{$t("choose")}}</option>
                            <option :value="evn.id" v-for="evn in environment" v-bind:key="evn">{{evn.displayname}}</option>
                        </select>
                    </div>
                </div>
                <br/>
                <br/>
                <div class="animal-stock-btn">
                    <button type="button" class="btn btn-primary" :disabled="!submitOk" @click="submitData">{{$t("submit")}}</button>
                    &nbsp;
                    <button type="button" class="btn btn-outline-primary" @click="reset">{{$t("reset")}}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import TopNav from "@/components/publib/TopNav";
    export default {
        name: "EnterAnimalStock",
        components: {TopNav},
        data:function () {
            return{
                stockerr : {},
                errall : "",
                stockID : "",
                stockIDValid : "",
                genotype : "",
                genotypeValid : "",
                resource : "",
                resourceValid : "",
                container : "",
                containerValid : "",
                number : 0,
                numberValid : "",
                environmentId: "",
                environmentValid : "",
                environment : [],
                checkExistFlag : true
            }
        },
        methods : {
            submitData : function () {
                var postData = {
                    stockID : this.stockID,
                    genotype : this.genotype,
                    resource : this.resource,
                    container : this.container,
                    number : this.number,
                    environmentId : this.environmentId
                }
                var _this = this;
                this.$axios.post( "/stock/add",
                    postData
                ).then(function (res) {
                    if (res.data.code != "200"){
                        _this.$message.error(_this.$t(res.data.code));
                    }else {
                        _this.$message.success(_this.$t("save_success"));
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$message.error(_this.$t("systemErr"));
                })
            },
            setErrObject : function (name,value) {
                this.$set(this.stockerr,name,value);
            },
            delErrObject : function (name) {
                this.$delete(this.stockerr,name);
            },
            reset : function () {
                this.stockerr = {};
                this.errall = "";
                this.stockID = "";
                this.stockIDValid = "";
                this.genotype = "";
                this.genotypeValid = "";
                this.resource = "";
                this.resourceValid = "";
                this.container = "";
                this.containerValid = "";
                this.number = 0;
                this.numberValid = "";
                this.environmentId= "";
                this.environment = [];
                this.environmentValid = "";
                this.checkExistFlag = true;
                this.initEvn();
            },
            initEvn : function () {
                var _this = this;
                this.$axios({
                    method : "post",
                    url:"/personal/environment"
                }).then(function (res) {
                    if (res.data.code != "200"){
                        _this.$message.error(_this.$t(res.data.code));
                    }else {
                        _this.environment = res.data.retMap.envs;
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$message.error(_this.$t("systemErr"));
                })
            },
            checkExist : function () {
                var _this = this;
                var postData = {
                    "gentype" : _this.genotype
                };
                this.$axios.post(
                    "/personal/checkGenTypeExist",
                     postData
                ).then(function (res) {
                    if (res.data.code != "200"){
                        _this.$message.error(_this.$t(res.data.code));
                    }else {
                        if (res.data.retMap.hasExist){
                            _this.$message.success(_this.$t("animal_stock_genotype") + _this.$t("hasExist"));
                        }else {
                            _this.$message.success(_this.$t("animal_stock_genotype") + _this.$t("hasNotExist"));
                        }
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$message.error(_this.$t("systemErr"));
                })
            }
        },
        beforeMount : function(){
            this.initEvn();
        },
        computed: {
            submitOk: function () {
                return this.numberValid == "is-valid"
                    && this.stockIDValid == "is-valid"
                    && this.genotypeValid == "is-valid"
                    && this.resourceValid == "is-valid"
                    && this.containerValid == "is-valid"
                    && this.environmentId != ""
            },
        },
        watch:{
            stockID(newValue){
                if (this.$.trim(newValue) == ""){
                    this.stockIDValid = "is-invalid";
                    this.setErrObject("stockID",this.$t("animal_stock_stockID") + this.$t("not_null"));
                }else {
                    this.stockIDValid = "is-valid";
                    this.delErrObject("stockID");
                }
            },
            genotype(newValue){
                if (this.$.trim(newValue) == ""){
                    this.genotypeValid = "is-invalid";
                    this.setErrObject("genotype",this.$t("animal_stock_genotype") + this.$t("not_null"));
                    this.checkExistFlag = true;
                }else {
                    this.genotypeValid = "is-valid";
                    this.delErrObject("genotype");
                    this.checkExistFlag = false;
                }
            },
            resource(newValue){
                if (this.$.trim(newValue) == ""){
                    this.resourceValid = "is-invalid";
                    this.setErrObject("resource",this.$t("animal_stock_resource") + this.$t("not_null"));
                }else {
                    this.resourceValid = "is-valid";
                    this.delErrObject("resource");
                }
            },
            container(newValue){
                if (this.$.trim(newValue) == ""){
                    this.containerValid = "is-invalid";
                    this.setErrObject("container",this.$t("animal_stock_container") + this.$t("not_null"));
                }else {
                    this.containerValid = "is-valid";
                    this.delErrObject("container");
                }
            },
            number(newValue){
                if (this.$.trim(newValue) == ""){
                    this.numberValid = "is-invalid";
                    this.setErrObject("number",this.$t("animal_stock_number") + this.$t("not_null"));
                }else {
                    this.numberValid = "is-valid";
                    this.delErrObject("number");
                }
            },
            environmentId(newValue){
                if (this.$.trim(newValue) == ""){
                    this.environmentValid = "is-invalid";
                    this.setErrObject("environment",this.$t("animal_stock_environment") + this.$t("not_null"));
                }else {
                    this.environmentValid = "is-valid";
                    this.delErrObject("environment");
                }
            },
            stockerr : {
                handler(newVlue) {
                    var errall = "";
                    for (var errName in newVlue){
                        errall += this.stockerr[errName];
                    }
                    this.errall = errall;
                },
                deep:true
            }
        }
    }
</script>

<style scoped>
    .animal-stock-btn{
        width: 75%;
        text-align: center;
    }
    .animal-stock-container{
        padding-top: 50px;
        text-align: left;
    }
    .enter-animal-stock{
        padding: 20px 20px;
        background-color: white;
        margin-top: 20px;
        width: 90%;
        margin-left: 5%;
        border-radius: 5px;
        min-height: 500px;
    }
</style>