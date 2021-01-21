<template>
  <div style="width: 100%;height: 100%">
    <div style="width: 80%;margin-top:10px; font-weight: bold;font-size: 20px;
    margin-left:5%;text-align: left;display: inline-block">
      {{title}}
    </div>
    <e-charts :options="options" style="width: 100%;height: 80%"/>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'

export default {
  name: "Histogram",
  components: {ECharts},
  props: {
    dataList: Array,
    titleList : Array,
    title : String,
  },
  data: function () {
    return {}
  },
  computed: {
    options: function () {
      return {
        title: {
          text: this.title,
          subtext: '纯属虚构',
          left: "0",
          top: "0",
          textStyle: {
            fontSize: 30
          },
          subtextStyle: {
            fontSize: 20
          },
          show : true,
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
          left: '2%',
          right: '2%',
          bottom: '0px',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            data:this.titleList
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.title,
            type: 'bar',
            label: {
              show: true,
              position: 'inside'
            },
            data: this.dataList,
            barWidth: "60%",
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>