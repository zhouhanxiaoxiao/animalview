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
import util from "@/components/publib/util";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
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