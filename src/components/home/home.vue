<template>
  <div>
    <top-nav></top-nav>
    <div class="main-page">
      <div class="summary-container">
        <div style="width: 100%;padding: 20px 20px;min-height: 150px" >
          <template v-if="this.$systemFlag == 'animal' || this.$systemFlag == 'local'">
            <a-statistic
                title="最近一个月新增库存"
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
                title="最近一个月新增品系"
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
                :title="$t('current_strain')"
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
                :title="$t('current_stock')"
                :value="stockNumber"
                :precision="0"
                :value-style="{ color: '#3f8600' }"
                style="margin: 0px 25px;display: inline-block"
                @click.native="currentStock"
            >
              <template #prefix>
              </template>
            </a-statistic>
          </template>

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
          _this.allStrainNumber = res.data.retMap.allStrainNumber;
          _this.selfTaskNumber = res.data.retMap.selfTaskNumber;
          _this.oneMonthStockNumber = res.data.retMap.oneMonthStockNumber;
          _this.oneMonthStrainNumber = res.data.retMap.oneMonthStrainNumber;
          _this.stockNumber = res.data.retMap.stockNumber;
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