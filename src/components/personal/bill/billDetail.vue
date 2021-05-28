<template>
  <div>
    <a-collapse>
<!--   检测价格明细    -->
      <a-collapse-panel key="1" :header="detectTtile">
        <div slot="extra">
          {{  $t("bill.total") + ":" + billGroup.detects.length + $t("bill.count") + " " + billGroup.detectcost + "元"}}
        </div>
        <div style="width: 100%" v-for="item in billGroup.detects" :key="item.id" >
          <a-descriptions :title="item.processname">
            <a-descriptions-item :label="$t('bill.detectprice')">
              <a-input-number :min="0" v-model="item.detectprice" :disabled="isArchive" @change="changeDetects"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.number') + '(个)'">
              <a-input-number :min="0" v-model="item.detectcount" :disabled="isArchive" @change="changeDetects"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.detectcost')">
              {{ item.detecttotal }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
        </div>
      </a-collapse-panel>
<!--   提取价格明细   -->
      <a-collapse-panel key="2" :header="extractTtile">
        <div slot="extra">
          {{  $t("bill.total") + ":" + billGroup.extracts.length + $t("bill.count") + " " + billGroup.extractcost + "元"}}
        </div>
        <div style="width: 100%" v-for="item in billGroup.extracts" :key="item.id" >
          <a-descriptions :title="item.processname">
            <a-descriptions-item :label="$t('bill.extractprice')">
              <a-input-number :min="0" v-model="item.extractprice" :disabled="isArchive" @change="changeExtracts"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.number') + '(个)'">
              <a-input-number :min="0" v-model="item.extractcount" :disabled="isArchive" @change="changeExtracts"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.extractcost')">
              {{ item.extracttotal }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
        </div>
      </a-collapse-panel>
<!--  建库价格明细    -->
      <a-collapse-panel key="3" :header="libTitle">
        <div slot="extra">
          {{  $t("bill.total") + ":" + billGroup.libs.length + $t("bill.count") + " " + billGroup.libdbcost + "元"}}
        </div>
        <div style="width: 100%" v-for="item in billGroup.libs" :key="item.id" >
          <a-descriptions :title="item.processname">
            <a-descriptions-item :label="$t('bill.libname')">
              {{ item.libname }}
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.libprice')">
              <a-input-number :min="0" v-model="item.libprice" :disabled="isArchive" @change="changeLibs"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.libcount') + '(个)'">
              <a-input-number :min="0" v-model="item.libcount" :disabled="isArchive" @change="changeLibs"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.libdbcost')">
              {{ item.libtotal }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
        </div>
      </a-collapse-panel>
<!-- 测序价格明细 -->
      <a-collapse-panel key="4" :header="seqTitle">
        <div slot="extra">
          {{  $t("bill.total") + ":" + billGroup.seqs.length + $t("bill.count") + " " + billGroup.seqcost + "元"}}
        </div>
        <div style="width: 100%" v-for="item in billGroup.seqs" :key="item.id" >
          <a-descriptions :title="item.processname">
            <a-descriptions-item :label="$t('bill.seqcheckprice')">
              <a-input-number :min="0" v-model="item.seqcheckprice" :disabled="isArchive" @change="changeSeqs"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.seqchecknum')">
              <a-input-number :min="0" v-model="item.seqchecknum" :disabled="isArchive" @change="changeSeqs"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.checktotal')">
              {{ item.seqchecktotal }}
            </a-descriptions-item>

            <a-descriptions-item :label="$t('bill.seqprice')">
              <a-input-number :min="0" v-model="item.seqprice" :disabled="isArchive" @change="changeSeqs"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.seqcount')">
              <a-input-number :min="0" v-model="item.seqcount" :disabled="isArchive" @change="changeSeqs"/>
            </a-descriptions-item>
            <a-descriptions-item :label="$t('bill.seqcost')">
              {{ item.seqtotal }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
export default {
  name: "billDetail",
  props : {
    billGroup : Object
  },
  methods : {
    changeSeqs : function (){
      var total = 0;
      var checkTotal = 0;
      for (var i = 0; i < this.billGroup.seqs.length; i++){
        var item = this.billGroup.seqs[i];
        item.seqtotal = item.seqprice * item.seqcount;
        total += item.seqtotal;

        item.seqchecktotal = item.seqcheckprice * item.seqchecknum;
        checkTotal += item.seqchecktotal;
      }
      this.billGroup.seqcost = total + checkTotal;
    },
    changeLibs : function (){
      var total = 0;
      for (var i = 0; i < this.billGroup.libs.length; i++){
        var item = this.billGroup.libs[i];
        item.libtotal = item.libprice * item.libcount;
        total += item.libtotal;
      }
      this.billGroup.libdbcost = total;
    },
    changeExtracts : function (){
      var total = 0;
      for (var i = 0; i < this.billGroup.extracts.length; i++){
        var item = this.billGroup.extracts[i];
        item.extracttotal = item.extractprice * item.extractcount;
        total += item.extracttotal;
      }
      this.billGroup.extractcost = total;
    },
    changeDetects : function (){
      var total = 0;
      for (var i = 0; i < this.billGroup.detects.length; i++){
        var detect = this.billGroup.detects[i];
        detect.detecttotal = detect.detectprice * detect.detectcount;
        total += detect.detecttotal;
      }
      this.billGroup.detectcost = total;
    }
  },
  computed : {
    detectTtile : function (){
      return this.$t("bill.detectcost");
    },
    extractTtile : function (){
      return this.$t("bill.extractcost");
    },
    libTitle : function (){
      return this.$t("bill.libdbcost");
    },
    seqTitle : function (){
      return this.$t("bill.seqcost");
    },
    isArchive : function (){
      if (this.billGroup.curentstatu === "02"){
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>