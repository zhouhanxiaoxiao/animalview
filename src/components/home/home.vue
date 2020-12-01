<template>
  <div>
    <top-nav></top-nav>
    <div class="main-page">
      <div class="summary-container">
        <div style="width: 100%;padding: 20px 20px;min-height: 150px" >
          <template v-if="this.$systemFlag == 'animal'" style="width: 100%;text-align: center">
            <a-statistic
                title="最近一个月新增扩繁品系"
                :value="oneMonthStockNumber"
                :precision="0"
                :value-style="{ color: '#3f8600' }"
                style="margin: 0px 25px;display: inline-block"
            >
              <template #prefix>
                <a-icon type="arrow-up" />
              </template>
            </a-statistic>
            <a-statistic
                title="最近一个月新增保种品系"
                :value="oneMonthStrainNumber"
                :precision="0"
                :value-style="{ color: '#3f8600' }"
                style="margin: 0px 25px;display: inline-block"

            >
              <template #prefix>
                <a-icon type="arrow-up" />
              </template>
            </a-statistic>

            <a-statistic
                :title="'现有' + $t('current_strain')"
                :value="allStrainNumber"
                :precision="0"
                :value-style="{ color: '#3f8600' }"
                style="margin: 0px 25px;display: inline-block"
                @click.native="currentStrain"
            >
              <template #prefix>
              </template>
            </a-statistic>

            <a-statistic
                :title="'现有' + $t('current_stock')"
                :value="stockNumber"
                :precision="0"
                :value-style="{ color: '#3f8600' }"
                style="margin: 0px 25px;display: inline-block"
                @click.native="currentStock"
            >
              <template #prefix>
              </template>
            </a-statistic>
            <a-statistic
                title="进行中的任务"
                :value="selfTaskNumber"
                :precision="0"
                :value-style="{ color: '#3f8600' }"
                style="margin: 0px 25px;display: inline-block"
                @click.native="myTask"
            >
              <template #prefix>
                <a-icon type="arrow-up" />
              </template>
            </a-statistic>
          </template>
          <div  v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local'"
                     style="width: 100%;text-align: center;">
<!--            <a-statistic-->
<!--                title="进行中的任务"-->
<!--                :value="selfTaskNumber"-->
<!--                :precision="0"-->
<!--                :value-style="{ color: '#3f8600' }"-->
<!--                style="margin: 0px 25px;display: inline-block;float: left;margin-left: 100px"-->
<!--                @click.native="myTask"-->
<!--            >-->
<!--              <template #prefix>-->
<!--                <a-icon type="arrow-up" />-->
<!--              </template>-->
<!--            </a-statistic>-->
            <div style="display: inline-block;margin-left: 50px">
              <a-statistic
                  :title="$t('sampleInput')"
                  :value="parseInt(checkNum.inputNum) + parseInt(todoNum.inputNum)"
                  :precision="0"
                  :value-style="{ color: '#3f8600' }"
                  style="margin: 0px 20px;display: inline-block"
              >
              </a-statistic>
              <a-statistic
                  :title="$t('samplePreparation')"
                  :value="parseInt(checkNum.makeNum) + parseInt(todoNum.makeNum)"
                  :precision="0"
                  :value-style="{ color: '#3f8600' }"
                  style="margin: 0px 20px;display: inline-block"
              >
              </a-statistic>
              <a-statistic
                  :title="$t('libraryPreparation')"
                  :value="parseInt(checkNum.libNum) + parseInt(todoNum.libNum)"
                  :precision="0"
                  :value-style="{ color: '#3f8600' }"
                  style="margin: 0px 20px;display: inline-block"
              >
              </a-statistic>
              <a-statistic
                  :title="$t('uploadConfirm')"
                  :value="parseInt(checkNum.confirmNum) + parseInt(todoNum.confirmNum)"
                  :precision="0"
                  :value-style="{ color: '#3f8600' }"
                  style="margin: 0px 20px;display: inline-block"
              >
              </a-statistic>
              <a-statistic
                  :title="$t('dismountData')"
                  :value="parseInt(checkNum.disNum) + parseInt(todoNum.disNum)"
                  :precision="0"
                  :value-style="{ color: '#3f8600' }"
                  style="margin: 0px 20px;display: inline-block"
              >
              </a-statistic>
              <a-statistic
                  :title="$t('bioinformaticsAnalysis')"
                  :value="parseInt(checkNum.bioNum) + parseInt(todoNum.bioNum)"
                  :precision="0"
                  :value-style="{ color: '#3f8600' }"
                  style="margin: 0px 20px;display: inline-block"
              >
              </a-statistic>
            </div>
            <div style="display: inline-block">

            </div>
          </div>
        </div>

<!--        <number-and-name @click.native="myTask" num-name="待处理" :number="selfTaskNumber"></number-and-name>-->
<!--        <number-and-name @click.native="myTask" num-name="流转中" :number="selfTaskNumber"></number-and-name>-->
<!--        <number-and-name @click.native="currentStrain" :num-name="$t('current_strain')" :number="allStrainNumber"></number-and-name>-->
      </div>
<!--      <task-table :page-location="'home'"></task-table>-->
      <task-table-new page-location="home"></task-table-new>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
// import NumberAndName from "@/components/home/NumberAndName";
import TaskTableNew from "@/components/task/taskMain/taskTableNew";

export default {
  name: "home",
  components: {TaskTableNew, TopNav},
  data : function (){
    return {
      allStrainNumber : 0,
      selfTaskNumber : 0,
      oneMonthStockNumber : 0,
      oneMonthStrainNumber : 0,
      stockNumber : 0,
      todoNum : {
        inputNum : 0,
        makeNum : 0,
        libNum : 0,
        confirmNum : 0,
        disNum : 0,
        bioNum : 0
      },
      checkNum :{
        inputNum : 0,
        makeNum : 0,
        libNum : 0,
        confirmNum : 0,
        disNum : 0,
        bioNum : 0
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.post("/home/preview").then(function (res){
        console.log(res);
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          console.log(res);
          _this.allStrainNumber = res.data.retMap.allStrainNumber;
          _this.selfTaskNumber = res.data.retMap.selfTaskNumber;
          _this.oneMonthStockNumber = res.data.retMap.oneMonthStockNumber;
          _this.oneMonthStrainNumber = res.data.retMap.oneMonthStrainNumber;
          _this.stockNumber = res.data.retMap.stockNumber;
          _this.todoNum = res.data.retMap.todoNum;
          _this.checkNum = res.data.retMap.checkNum;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    currentStrain : function (){
      this.$router.push("/stock/currentStrain");
    },
    currentStock : function (){
      this.$router.push("/stock/currentStock");
    },
    myTask : function (){
      this.$router.push("/task");
    }
  },
  watch : {
    getUserId(){
      this.initPage()
    }
  },
  computed : {
    getUserId : function (){
      return this.$store.getters.getUser.id;
    }
  }
}
</script>

<style scoped>
.main-page {
  margin-top: 100px;
  margin-bottom: 50px;
  background-color: white;
  width: 90%;
  margin-left: 5%;
  min-height: 500px;
  border-radius: 5px;
}

.summary-container {
  width: 90%;
}

</style>