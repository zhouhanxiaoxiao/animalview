<template>
  <div>
    <top-nav></top-nav>
    <div class="resource-container">
      <a-radio-group v-model="resource" @change="onChange" button-style="solid">
        <a-radio-button v-for="met in meters" :key="met.id" :value="met.id">
          {{ showName(met) }}
        </a-radio-button>
      </a-radio-group>
      <a-calendar :disabledDate="disabledDate"
                  @select="showSelectTime"
      >
        <ul slot="dateCellRender" slot-scope="value" class="events">
          <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
          </li>
        </ul>
      </a-calendar>
    </div>
    <select-time :current-date="selectDate" :resource="resource"
    @submitData="commitTimes"></select-time>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import {formatDate} from "@/components/publib/date";
import SelectTime from "@/components/task/resourceOrder/selectTime";
import Submitting from "@/components/publib/submitting";
export default {
  name: "resource",
  components: {Submitting, SelectTime, TopNav},
  data : function (){
    return {
      resource : "",
      meters : [],
      records : [],
      selectDate : undefined,
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    showName : function (met){
      if (met.email == undefined){
        return met.name;
      }else {
        return met.name + "协助";
      }
    },
    onChange : function (){

    },
    showSelectTime : function (date){
      // console.log(date);
      this.selectDate = date;
      this.$("#selectTime").modal("show");
    },
    getListData : function(value){
      var list = new Array();
      for (var i = 0;i< this.records.length;i++){
        var record = this.records[i];
        // console.log(formatDate(new Date(record.starttime),"yyyy-MM-dd"),value.date());
        if (formatDate(new Date(record.starttime),"yyyy-MM-dd") == formatDate(value.toDate(),"yyyy-MM-dd")){
          var start = formatDate(new Date(record.starttime),"hh:00");
          var end = formatDate(new Date(record.endtime),"hh:00");
          list.push({type:"success",content:start + " - " + end});
        }
      }
      return list || [];
    },
    initPage : function (){
      var _this = this;
      this.$axios.post("/task/resource/init").then(function (res){
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          // console.log(res);
          _this.meters = new Array();
          _this.meters = _this.meters.concat(res.data.retMap.feeds);
          _this.meters = _this.meters.concat(res.data.retMap.meterials);
          _this.resource = _this.meters[0].id;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    } ,
    disabledDate : function (date){
      var now = new Date();
      var now0 = new Date(now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate())
      if (date < now0){
        return  true;
      }
      return false;
    },
    commitTimes : function (resourceId,times){
      console.log(resourceId,times);
      var postData = {
        resourceId : resourceId,
        times : times
      }
      var _this = this;
      _this.$("#submitting").modal("show");
      this.$axios.post("/task/resource/commitTask",postData).then(function (res){
        console.log(res);
        _this.$("#submitting").modal('hide');
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          window.location.reload();
          // _this.initPage();
          // _this.render();
        }
      }).catch(function (res){
        _this.$("#submitting").modal('hide');
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    }
  },
  watch : {
    resource(newValue){
      var _this = this;
      this.$axios.post("/task/resource/getRecords",{recordId : newValue}).then(function (res){
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          console.log(res);
          _this.records = res.data.retMap.records;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
  }
}
</script>

<style scoped>
.resource-container{
  text-align: left;
  margin-top: 100px;
  background-color: white;
  width: 90%;
  margin-left: 5%;
  min-height: 500px;
  border-radius: 5px;
  padding: 50px 50px;
}
ul {
  list-style: none;
  padding-inline-start: 0;
}
</style>