<template>
  <a-modal
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
  >
    <h4> {{ $t("seqwait.projectdatanum") }} : {{ order.projectdatanum }} </h4>

    <a-row v-for="item in items" :key="item.id" style="margin-bottom: 10px">
      <a-col :span="20">
        <a-input-number style="width: 100%" @change="checkNum(item)"
                        v-model="item.number" :min="0" :max="parseFloat(order.projectdatanum)"/>
      </a-col>
      <a-col :span="3" offset="1">
        <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96"
                v-if="items.length > 2"
                @click="removeSplit(item)"
                style="cursor: pointer;font-size: 30px;"/>
      </a-col>
    </a-row>
    <div style="width: 90%;text-align: center;font-size: 30px;margin-top: 10px">
      <a-icon type="plus-circle" theme="twoTone" two-tone-color="#52c41a"
              @click="addNewSplit"
              style="cursor: pointer"/>
    </div>
  </a-modal>
</template>

<script>
import uuidv1 from 'uuid/v1'
import util from '@/components/publib/util'
export default {
  name: "splitAlert",
  props : {
    visible : Boolean,
    order : {}
  },
  data : function (){
    return {
      items : [{id : uuidv1(), number : 0}, {id : uuidv1(), number : 0}]
    }
  },
  methods : {
    checkNum : function (item){
      var total = 0;
      this.items.map(tmp => total += tmp.number);
      if (total > parseFloat(this.order.projectdatanum)){
        item.number = 0;
        util.error("seqwait.moreNum");
      }
    },
    removeSplit : function (record){
      const tmps = [...this.items];
      this.items = tmps.filter(item => item.id !== record.id);
    },
    addNewSplit : function (){
      this.items.push({id : uuidv1(), number : 0});
    },
    handleCancel : function (){
      this.$emit("closeAlert");
    },
    handleOk : function (){
      var total = 0;
      this.items.map(tmp => total += tmp.number);
      console.log(total, this.order.projectdatanum)
      if (total !== parseFloat(this.order.projectdatanum)){
        util.error("seqwait.notEqual");
        return;
      }
      var nums = new Array();
      this.items.map(tmp => nums.push(tmp.number));
      this.$emit("submitSplit", nums);
    }
  },
  computed : {
    title : function (){
      return this.order.projectname + " " + this.order.samplename;
    }
  },
  watch : {
    order :{
      handler(){
        this.items = [{id : uuidv1(), number : 0}, {id : uuidv1(), number : 0}]
      },
      deep : true
    }
  }
}
</script>

<style scoped>

</style>