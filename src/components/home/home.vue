<template>
  <div>
    <top-nav></top-nav>
    <div class="main-page">
      <div class="summary-container">
        <number-and-name @click.native="myTask" num-name="待处理" :number="selfTaskNumber"></number-and-name>
        <number-and-name @click.native="myTask" num-name="流转中" :number="selfTaskNumber"></number-and-name>
        <number-and-name @click.native="currentStrain" :num-name="$t('current_strain')" :number="allStrainNumber"></number-and-name>
      </div>
      <task-table :page-location="'home'"></task-table>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import NumberAndName from "@/components/home/NumberAndName";
import TaskTable from "@/components/task/TaskTable";

export default {
  name: "home",
  components: {TaskTable, NumberAndName, TopNav},
  data : function (){
    return {
      allStrainNumber : 0,
      selfTaskNumber : 0,
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
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    currentStrain : function (){
      this.$router.push("/stock/currentStrain");
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