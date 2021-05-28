<template>
  <div>
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" :tab="$t('bill.unitPriceSet')">
        <SetPrice></SetPrice>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="$t('bill.monthBill')" force-render>
<!--        <month-bill></month-bill>-->
        <month-bill-new></month-bill-new>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import SetPrice from "@/components/personal/bill/SetPrice";
import MonthBillNew from "@/components/personal/bill/monthBillNew";
export default {
  name: "BillingCenter",
  components: {MonthBillNew, SetPrice},
}
</script>

<style scoped>

</style>