<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" :tab="$t('bill.unitPriceSet')">
        <SetPrice></SetPrice>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('bill.monthBill')" force-render>
        <month-bill></month-bill>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Tab 3">
        Content of Tab Pane 3
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import SetPrice from "@/components/personal/bill/SetPrice";
import MonthBill from "@/components/personal/bill/MonthBill";
export default {
  name: "BillingCenter",
  components: {MonthBill, SetPrice},
}
</script>

<style scoped>

</style>