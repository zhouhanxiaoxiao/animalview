<template>
  <div>
    <a-result title="Great, we have done all the operations!">
      <template #icon>
        <icon-font type="icon-jiyinjiancebaogao"/>
      </template>
      <template #extra>
        <a-button type="primary">
          Next
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
import {Icon} from 'ant-design-vue';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2031063_ynnrauyza3.js',
});
export default {
  name: "processStep6",
  components: {IconFont},
  props: {
    process: Object
  },
  data() {
    return {};
  },
}
</script>

<style scoped>

</style>