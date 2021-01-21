<template>
  <div>
    <div style="width: 100%;height: 100%">
      <div style="height: 8%">{{title}}</div>
      <e-charts :options="options" style="width: 100%;height: 90%"/>
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
  name: "ActiveHistogram",
  components : {ECharts},
  props: {
    title : String,
    subTitle : String,
    mapList : Array
  },
  data : function (){
    return{
      dataList : new Array(),
      titleList : new Array(),
      dbList : new Array()
    }
  },
  mounted() {
    var _this = this;
    setInterval(function (){
      var name = _this.titleList.shift();
      var count = _this.dataList.shift();
      var first = _this.dbList.shift();
      if (first == undefined){
        return;
      }
      var item = {
        name : name,
        count : count
      };
      _this.titleList.push(first.name);
      _this.dataList.push(first.count);
      _this.dbList.push(item);
    },2000);
  },
  watch : {
    mapList : {
      handler : function (newVal){
        this.dbList = new Array();
        this.titleList = new Array();
        this.dataList = new Array();
        var _this = this;
        newVal.map(item => _this.dbList.push(item));
        for (var i=0; i<20;i++){
          if (i < this.dbList.length -3){
            var t = this.dbList.shift();
            this.titleList.push(t.name);
            this.dataList.push(t.count);
          }
        }
      },
      deep : true
    }
  },
  computed : {
    options : function (){
      return {
        title: {
          text: this.title,
          subtext: this.subTitle
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        grid: {
          left: '3%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data: this.titleList
          }
        ],
        yAxis: [
          {
            type: 'value',
          }
        ],
        series: [
          {
            name: '预购队列',
            type: 'bar',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data:this.dataList
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>