<template>
    <div class="stock-item-detail">
        <p>
            <button class="btn btn-sm btn-block "
                    :class="allReady ?'btn-success' : 'btn-outline-danger'"
                    type="button"
                    data-toggle="collapse"
                    :data-target="'#aa' + row.stock.id"
                    aria-expanded="false"
                    :aria-controls="'aa' + row.stock.id">
                {{btnText}}
            </button>
        </p>
        <div class="collapse" :id="'aa' + row.stock.id">
            <div class="card card-body">
                <div class="form-row task-item-container ">
                  <!--  实验目的  -->
                  <div class="form-group-sm col-md-3 was-validated">
                    <label for="Purpose">{{$t("purpose")}}</label>
                    <input type="text" class="form-control" id="Purpose" v-model="purpose"
                           required
                           placeholder="例：药物实验-control-001">
                  </div>
                  <!--  预计实验时间  -->
                  <div class="form-group-sm col-md-3">
                    <label for="expectedTime">{{$t("expectedTime")}}</label>
                    <div id="expectedTime" >
                      <date-picker v-model="expectedTime" value-type="format" format="YYYY-MM-DD" :disabled-date="disabledDate(row.stock.usagetype)"></date-picker>
                    </div>
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
                    <div class="form-group col-md-3">
                        <label for="virginFly">{{$t("virginFly")}}</label>
                        <div id="virginFly">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'virginFly' + row.stock.id"
                                       :id="'yes' + row.stock.id" v-model="virginFly" checked value="Y">
                                <label class="form-check-label" :for="'yes' + row.stock.id">{{$t('yes')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'virginFly' + row.stock.id " :id="'no' + row.stock.id"
                                       v-model="virginFly" value="N">
                                <label class="form-check-label" :for="'no' + row.stock.id">{{$t('no')}}</label>
                            </div>
                        </div>
                    </div>
                    <!--  性别  -->
                    <div class="form-group col-md-3">
                        <label for="gender">{{$t("gender")}}</label>
                        <div id="gender">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'gender'+ row.stock.id" :id="'male' + row.stock.id"
                                       v-model="gender" checked value="male">
                                <label class="form-check-label" :for="'male' + row.stock.id">{{$t('male')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'gender'+ row.stock.id"
                                       :id="'female' + row.stock.id" v-model="gender" value="female">
                                <label class="form-check-label" :for="'female' + row.stock.id">{{$t('female')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'gender'+ row.stock.id"
                                       :id="'empty' +row.stock.id" v-model="gender" value="empty">
                                <label class="form-check-label" :for="'empty' + row.stock.id">{{$t('empty')}}</label>
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
                                       :id="'yes2' + row.stock.id" value="Y">
                                <label class="form-check-label" :for="'yes2' + row.stock.id">{{$t('yes')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'isHybridizationNecessary'+ row.stock.id"
                                       v-model="isHybridizationNecessary"
                                       :id="'no2' + row.stock.id" checked value="N">
                                <label class="form-check-label" :for="'no2' + row.stock.id">{{$t('no')}}</label>
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
                                       :id="'yes3' + row.stock.id" value="N">
                                <label class="form-check-label" :for="'yes3' + row.stock.id">{{$t('normal')}}</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" :name="'specialFeeding'+ row.stock.id"
                                       v-model="specialFeeding"
                                       :id="'no3'+row.stock.id" checked value="Y">
                                <label class="form-check-label" :for="'no3' + row.stock.id">{{$t('special')}}</label>
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
                    <!-- 唯一资源占用-->
                    <div class="form-group-sm col-md-3">
                      <label for="meterial">{{$t("meterial")}}</label>
                      <multiselect id="meterial"
                                   v-model="meterial"
                                   :options="allMerial"
                                   :searchable="true"
                                   :close-on-select="true"
                                   :show-labels="false"
                                   :allow-empty="true"
                                   :multiple="true"
                                   :taggable="true"
                                   track-by="name"
                                   label="name">
                        <span slot="noResult"></span>
                      </multiselect>
                    </div>
                    <div class="form-group-sm col-md-6" v-for="item in meterial" :key="item.id">
                      <label for="timeselect">选择{{item.name}}占用时间</label>
                      <section id="timeselect">
                        <a-range-picker
                            :show-time="{ format: 'HH'}"
                            format="YYYY-MM-DD HH"
                            :disabledTime="disableHour(item.id)"
                            :disabledDate="disabledMeterDate(item.id)"
                            @change="onChange"
                        />
                      </section>
                    </div>
                    <!--  操作流程  -->
                    <div class="form-group-sm col-md-12">
                      <label for="operationProcess">{{$t("operationProcess")}}</label>
                      <textarea class="form-control" id="operationProcess" v-model="operationProcess" placeholder="例：转管，喂食：先CO2麻醉，转移到新的管子，喂食含有染料的蔗糖水" rows="2"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {formatDate} from "@/components/publib/date";
    export default {
        name: "OrderItemDetail",
        props : {
            row : Object,
            allDrosophila : Array,
            allMerial : Array
        },
        data:function () {
            return{
                value2: [],
                showTimeRangePanel: false,
                purpose : "",
                operationProcess : "",
                expectedTime : "",
                virginFly: "Y",
                gender : "male",
                isHybridizationNecessary : "N",
                hybridStrain : "",
                specialFeeding : "N",
                specificFeeding : "",
                age : 0,
                orderNumber : 0,
                singleSource : [],
                allReady : false,
                meterial:[],
                needWy : "N",
                wyTime:[],
                needPhoto:"N",
                photoTime : [],
            }
        },
        methods : {
            moment,
          range(start, end) {
            const result = [];
            for (let i = start; i < end; i++) {
              result.push(i);
            }
            return result;
          },
          disableHour : function (id){
            console.log(id);
            var records = [];
            for (var i in this.allMerial){
              if (this.allMerial[i].id == id){
                records = this.allMerial[i].records;
              }
            }
            console.log(records);
            var _this = this;
            return function(time,type){
              console.log(time,type);
              if (time == undefined || time.length == 0 || time.length == 2 || time.length ==1){
                return  true;
              }
              if (type === "start" || type === "end"){
                return {
                disabledHours : function (){
                  var result = _this.range(0,24);
                  var now = new Date();
                  var now0 = new Date(now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate())
                    for (var j in records){
                      var start = new Date(records[j].starttime);
                      var end = new Date(records[j].endtime);
                      if (formatDate(time.toDate(),"yyyy-MM-dd") == formatDate(start,"yyyy-MM-dd")
                        && formatDate(time.toDate(),"yyyy-MM-dd") == formatDate(end,"yyyy-MM-dd")
                      ){
                        for (var k=start.getHours();k<end.getHours();k++){
                          for(var n=result.length-1;n>-1;n--){
                            if (result[n] == k){
                              result.splice(n,1);
                            }
                          }
                        }
                      }
                    }
                    if (formatDate(time.toDate(),"yyyy-MM-dd") == formatDate(now0,"yyyy-MM-dd")){
                      for (var m=0;m<now.getHours();m++){
                        for(var o=result.length-1;o>-1;o--){
                          if (result[o] == m){
                            result.splice(o,1);
                          }
                        }
                      }
                    }
                  console.log(result);
                  // return result;
                  return _this.range(0, 24).splice(4, 20);
                  }
                }
              }
            };
            // return function (date,type){
            //   console.log(date,type)
            //   if (date == undefined || date.length == 0){
            //     return true;
            //   }
            //   console.log("ddd",date);
            //   for (var j in records){
            //       if (date.length > 1){
            //         for (var k in date){
            //           var d = date[k];
            //           console.log(d.toDate() < new Date());
            //           if (d.toDate() < new Date()){
            //             return true;
            //           }
            //           console.log(d.toDate())
            //           if (d.toDate() >= new Date(records[j].starttime)
            //               &&d.toDate() < new Date(records[j].endtime)
            //           ){
            //             return true;
            //           }
            //         }
            //       }else{
            //         console.log(date.toDate() < new Date());
            //         if (date.toDate() < new Date()){
            //           return true;
            //         }
            //         if ( date.toDate() >= new Date(records[j].starttime)
            //             &&  date.toDate() < new Date(records[j].endtime)
            //         ){
            //           return true;
            //         }
            //       }
            //   }
            // }
          },
          disabledMeterDate:function (id){
            var records = [];
            for (var i in this.allMerial){
              if (this.allMerial[i].id == id){
                records = this.allMerial[i].records;
              }
            }
            return function (date){
              var now = new Date();
              var now0 = new Date(now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate())
              if (date < now0){
                return true;
              }
              for (var j in records){
                if (date > new Date(records[j].starttime)
                    && date < new Date(records[j].endtime)
                ){
                  return true;
                }
              }
            }
          },
            onChange(dates, dateStrings) {
              console.log('From: ', dates[0], ', to: ', dates[1]);
              console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            },
            toggleTimeRangePanel() {
              this.showTimeRangePanel = !this.showTimeRangePanel;
            },
            handleRangeClose() {
              this.showTimeRangePanel = false;
            },
            disableSelct : function (date){

              if (date < new Date()){
                return true;
              }
              return false;
            },
            handleData(){
                this.allReady = this.checkData();
                var hybridStrainId = "";
                if (this.isHybridizationNecessary == "Y"){
                    hybridStrainId = this.hybridStrain.id;
                }
                var retData = {
                    purpose : this.purpose,
                    expectedTime: this.expectedTime,
                    virginFly : this.virginFly,
                    gender : this.gender,
                    isHybridizationNecessary : this.isHybridizationNecessary,
                    hybridStrainId : hybridStrainId,
                    specialFeeding : this.specialFeeding,
                    specificFeeding : this.specificFeeding,
                    age : this.age,
                    needWy : this.needWy,
                    wyTime : this.wyTime,
                    needPhoto: this.needPhoto,
                    photoTime: this.photoTime,
                    operationProcess : this.operationProcess,
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
                if (this.purpose == ""){
                  return false;
                }
                if (this.expectedTime == ""){
                  return false;
                }
                if (this.age <0){
                    return false;
                }
                if (this.orderNumber<=0){
                    return false;
                }
                if (this.needWy == "Y" && this.wyTime == ""){
                  return  false;
                }
                if (this.needPhoto == "Y" && this.photoTime == ""){
                  return false;
                }
                return true;
            },
            disabledDate : function (usage) {
              console.log(usage);
              var late = 14;
              if (usage == "stock"){
                late = 0;
              }
              return function (time){
                var now = Date.now();
                var before = now + (1000*60*60*24) * late;
                return time.getTime() < new Date(before);
              }
            },
        },
        watch : {
          purpose(){ this.handleData();},
          expectedTime(){this.handleData();},
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
            needWy(newVal){
              if (newVal == "N"){
                this.wyTime = "";
              }
              this.handleData();
            },
            needPhoto(newVal){
              if (newVal == "N"){
                this.photoTime = "";
              }
              this.handleData();
            },
          photoTime(newVal){
            console.log(newVal)
            this.handleData();
          },
            wyTime(){
              this.handleData();
            }

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