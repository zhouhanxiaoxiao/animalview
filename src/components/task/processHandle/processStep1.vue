<template>
  <div>
    <div style="text-align: right">
      <button type="button" class="btn btn-primary" @click="addNewRow">{{$t("addNewRow")}}</button>
    </div>
    <a-collapse>
      <a-collapse-panel
          v-for="(item,key,index) in rows" :key="index"
          :header="$t('index') + '：' + (index + 1)">
        <sample-preparation-detail
                                   :process="process"
                                   :index="index"
                                   :uuid = "key"
                                   :rowsLength="Object.keys(rows).length"
                                   :item="item"
                                   @deleteRow="deleteRow"
                                   @saveData="saveData"
        >
        </sample-preparation-detail>
        <a-icon type="delete" slot="extra" @click="deleteRow(key,$event)" v-if="Object.keys(rows).length > 1"/>
      </a-collapse-panel>
    </a-collapse>

    <div class="modal-footer">
      <button type="button" class="btn btn-primary"
              >{{$t("confirm")}}</button>
    </div>
  </div>
</template>

<script>
import SamplePreparationDetail from "@/components/task/processHandle/samplePreparationDetail";
export default {
  name: "processStep1",
  components: {SamplePreparationDetail},
  props:{
    taskId : String,
    process : Object,
  },
  data :function(){
    return{
      rowNum : 1,
      rows : {
        def : {
          sampleName : "",
          species : "",
          tissue : "",
          sampletype : this.process.sampletype,
          sampleMsg : "",
          sampleStatu : "",
          tissueNumber : "",
          bloodVolume : "",
          concentration : "",
          sampleVolume : "",
          totalNumber : "",
          cellLife:"",
          cellSort :"",
          databaseType : "",
          SequencingPlatform : "",
          remarks : "",
          files:[]
        }
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      this.rowNum = 1;
    },
    addNewRow : function (){
      this.$set(this.rows,new Date().getTime(),{});
    },
    deleteRow : function (uuid,eve){
      eve.stopPropagation();
      this.$delete(this.rows,uuid);
    },
    saveData : function (row,index){
      this.$set(this.rows,index,row);
    }
  },
  watch:{
    taskId(){
      this.initPage();
    },
    rows : {
      handler(newVal){
        console.log(newVal)
      },
      deep:true
    }
  }
}
</script>

<style scoped>

</style>