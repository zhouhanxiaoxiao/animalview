<template>
  <div>
    <top-nav></top-nav>
    <div  style="width: 100%;text-align: left">
      <div class="my-task-num" style="width: 90%" v-if="this.$systemFlag == 'animal' || this.$systemFlag == 'local'">
        <histogram style="height: 100%;width: 100%"
                   :title="$t('果蝇品系')"
                   @clickHistogram="clickStrainHistogram"
                   :data-list="animalDataList"
                   :title-list="animalTitleList"></histogram>
      </div>
    </div>

    <div style="width: 100%;text-align: left" v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local'">
      <div class="my-task-num">
        <histogram style="height: 100%;width: 100%"
                   :title="$t('myTodoSample')"
                   :data-list="seqDataList"
                   :title-list="seqTitleList"></histogram>
      </div>

      <div class="people-task">
        <histogram style="height: 100%;width: 100%"
                   :title="$t('ongoingProjects')"
                   :data-list="topDataList"
                   :title-list="topTitleList"></histogram>
      </div>
    </div>
    <div class="main-page" >
      <task-table-new page-location="home"></task-table-new>
    </div>

  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import TaskTableNew from "@/components/task/taskMain/taskTableNew";
import Histogram from "@/components/publib/chart/Histogram";

export default {
  name: "home",
  components: { Histogram, TaskTableNew, TopNav},
  data: function () {
    return {
      allStrainNumber: 0,
      selfTaskNumber: 0,
      oneMonthStockNumber: 0,
      oneMonthStrainNumber: 0,
      stockNumber: 0,
      todoNum: {
        inputNum: 0,
        makeNum: 0,
        libNum: 0,
        confirmNum: 0,
        disNum: 0,
        bioNum: 0
      },
      checkNum: {
        inputNum: 0,
        makeNum: 0,
        libNum: 0,
        confirmNum: 0,
        disNum: 0,
        bioNum: 0
      },
      animalTaskCount :[],
      userTaskCount : new Array(),
      animalDataList : [],
      animalTitleList : ["新增扩繁品系","新增保种品系",'现有' + this.$t('current_strain'),
        '现有' + this.$t('current_stock'),"进行中的任务"],
      seqDataList: [],
      seqTitleList: [this.$t('sampleInput'), this.$t('samplePreparation'), this.$t('libraryPreparation')
        , this.$t('uploadConfirm'), this.$t('dismountData'), this.$t('bioinformaticsAnalysis')]
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    initPage: function () {
      var _this = this;
      this.$axios.post("/home/preview").then(function (res) {
        console.log(res);
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.allStrainNumber = res.data.retMap.allStrainNumber;
          _this.selfTaskNumber = res.data.retMap.selfTaskNumber;
          _this.oneMonthStockNumber = res.data.retMap.oneMonthStockNumber;
          _this.oneMonthStrainNumber = res.data.retMap.oneMonthStrainNumber;
          _this.stockNumber = res.data.retMap.stockNumber;
          _this.todoNum = res.data.retMap.todoNum;
          _this.checkNum = res.data.retMap.checkNum;
          _this.userTaskCount = res.data.retMap.userTaskCount;
          _this.animalTaskCount = res.data.retMap.animalTaskCount;

          _this.seqDataList = new Array();
          _this.seqDataList.push(parseInt(_this.checkNum.inputNum) + parseInt(_this.todoNum.inputNum));
          _this.seqDataList.push(parseInt(_this.checkNum.makeNum) + parseInt(_this.todoNum.makeNum));
          _this.seqDataList.push(parseInt(_this.checkNum.libNum) + parseInt(_this.todoNum.libNum));
          _this.seqDataList.push(parseInt(_this.checkNum.confirmNum) + parseInt(_this.todoNum.confirmNum));
          _this.seqDataList.push(parseInt(_this.checkNum.disNum) + parseInt(_this.todoNum.disNum));
          _this.seqDataList.push(parseInt(_this.checkNum.bioNum) + parseInt(_this.todoNum.bioNum));

          _this.animalDataList = new Array();
          _this.animalDataList.push(_this.oneMonthStockNumber)
          _this.animalDataList.push(_this.oneMonthStrainNumber)
          _this.animalDataList.push(_this.allStrainNumber)
          _this.animalDataList.push(_this.stockNumber)
          _this.animalDataList.push(_this.selfTaskNumber)
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    clickStrainHistogram : function (params){
      console.log(params,"home");
      if (params.dataIndex === 0 || params.dataIndex === 3){
        this.$router.push("/stock/currentStock");
      }else if (params.dataIndex === 1 || params.dataIndex === 2){
        this.$router.push("/stock/currentStrain");
      }else if (params.dataIndex === 4){
        this.$router.push("/task");
      }
    },
    currentStrain: function () {
      this.$router.push("/stock/currentStrain");
    },
    currentStock: function () {
      this.$router.push("/stock/currentStock");
    },
    myTask: function () {
      this.$router.push("/task");
    }
  },
  watch: {
    getUserId() {
      this.initPage()
    }
  },
  computed: {
    getUserId: function () {
      return this.$store.getters.getUser.id;
    },
    topDataList : function (){
      var list = new Array();
      this.userTaskCount.map(item =>{list.push(item.count)});
      return list;
    },
    topTitleList : function (){
      var list = new Array();
      this.userTaskCount.map(item =>{list.push(item.name)});
      return list;
    }
  }
}
</script>

<style scoped>
.my-task-num {
  margin-top: 50px;
  margin-bottom: 10px;
  background-color: white;
  width: 44%;
  margin-left: 5%;
  border-radius: 5px;
  display: inline-block;
  height: 55vh;
}
.people-task{
  margin-top: 50px;
  margin-bottom: 10px;
  background-color: white;
  margin-left: 1%;
  width: 45%;
  border-radius: 5px;
  display: inline-block;
  height: 55vh;
}

.main-page {
  padding-bottom: 50px;
  margin-top: 10px;
  margin-bottom: 50px;
  background-color: white;
  width: 90%;
  margin-left: 5%;
  min-height: 500px;
  border-radius: 5px;
}

.summary-container {
  width: 90%;
  height: 100%;
}

</style>