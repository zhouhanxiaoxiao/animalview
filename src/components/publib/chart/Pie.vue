<template>
  <div style="width: 100%;height: 100%">
    <div style="width: 80%;margin-top:10px; font-weight: bold;font-size: 20px;
    margin-left:5%;text-align: left;display: inline-block">
      {{ title }}
    </div>
    <e-charts :options="options" style="width: 100%;height: 80%"/>
  </div>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/pie'

export default {
  name: "Pie",
  props : {
    title : String,
    data : []
  },
  components : {ECharts},
  computed : {
    options : function (){
      return {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: this.title,
            type: 'pie',
            radius: '90%',
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>