<template>
  <div class="modal fade" id="selectTime" tabindex="-1" role="dialog" aria-labelledby="selectTimeLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="selectTimeLabel">{{$t("selectOrderTime")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <a-checkbox-group @change="onChange" v-model="times">
            <a-card>
              <a-card-grid v-for="item in checkedList" :key="item.key"
                           style="width:25%;text-align:center">
                <a-checkbox :value="item.key" :disabled="item.stat">
                  {{item.val}}
                </a-checkbox>
              </a-card-grid>
            </a-card>
          </a-checkbox-group>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary"
                  :disabled="times.length == 0"
                  @click="submitData">{{ $t("confirm") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";

export default {
  name: "selectTime",
  props:{
    currentDate : Object,
    resource : String
  },
  data : function (){
    return {
      checkedList : [
        {key:9,val:"9:00-10:00",stat:false},
        {key:10,val:"10:00-11:00",stat:false},
        {key:11,val:"11:00-12:00",stat:false},
        {key:12,val:"12:00-13:00",stat:false},
        {key:13,val:"13:00-14:00",stat:false},
        {key:14,val:"14:00-15:00",stat:false},
        {key:15,val:"15:00-16:00",stat:false},
        {key:16,val:"16:00-17:00",stat:false}
      ],
      times:[],
      records : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      if (this.currentDate == undefined){
        return ;
      }
      this.times = []
      console.log(this.currentDate.toDate(),this.resource);
      var postData = {
        currentDate : formatDate(this.currentDate.toDate(),"yyyy-MM-dd"),
        resource : this.resource
      }
      var _this = this;
      this.$axios.post("/task/resource/currentDate",postData).then(function (res){
        if (res.data.code != 200){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          _this.records = res.data.retMap.records;
          if (res.data.retMap.records.length>0){
            for (var i=0;i<res.data.retMap.records.length;i++){
              var record = res.data.retMap.records[i];
              var startTime = new Date(record.starttime);
              for (var j=0;j<_this.checkedList.length;j++){
                var check = _this.checkedList[j];
                if (startTime.getHours() == check.key){
                  check.stat = true;
                }
              }
            }
          }
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    onChange : function (checkedValues){
      console.log('checked = ', checkedValues);
    },
    submitData : function (){
      var postArray = new Array();
      for (var i=0;i<this.times.length;i++){
        var today = this.currentDate.toDate();
        var hour = this.times[i];
        today.setHours(hour);
        var time = today;
        postArray.push(time);
      }
      var postStr = JSON.stringify(postArray);
      this.times = [];
      this.$("#selectTime").modal("hide");
      this.$emit("submitData",this.resource,postStr);
    }
  },
  watch : {
    currentDate:{
      handler : function (){
        this.initPage();
      },
      deep : true
    },
    resource(){
      this.initPage();
    },
  }
}
</script>

<style scoped>

</style>