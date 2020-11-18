<template>
  <div style="text-align: left">
    <viewer>
      <!--   流程图   -->
      <a-card hoverable :title="$t('process.allStep')" style="width: 100%">
        <img
            src="../../../assets/process/processTip.jpg"
            style="width: 100%"
        />
      </a-card>
      <!--  样本录入    -->
      <a-card hoverable :title="$t('sampleInput')" style="width: 100%">
        <img
            src="../../../assets/process/step1.png"
            style="width: 100%"
        />
        <h5>说明</h5>
        <p>1.页面分为三个列表：未提交，已提交，已审核。未提交由相关人员填写，可编辑，可暂存。提交至已提交列表则不可编辑，等待<span style="color: red">基因组学中心</span>审核。</p>
        <p>2.首先“新增”一条数据项，填写完整数据。标红(<icon-font style="font-size: 20px" type="icon-bitian" />)的数据项为必填项。</p>
        <p>3.点击“暂存”可以保存当前页面上的所有数据。</p>
        <p>4.选中需要提交的条目点击“提交”按钮或点击某一条目操作栏的“提交”，将当前条目提交至“已提交”列表，等待审核。</p>
        <p>5.审核不通过需要填写原因，审核通过之后将进入已审核列表，此列表中的数据可提交至“样本制备”页面。</p>
        <p>6.选中需要提交的条目点击“删除”按钮或点击某一条目操作栏的“删除”，删除当前条目。</p>
        <p>7.也可先点击“导出”按钮，导入Excle表格，在表格中填写完毕之后，再“导入”进页面。注意：所有下拉框选项，导入时填写必须与下拉选项一致。</p>
        <p>8.“样本编号”一栏是自动生成字段，无需填写。</p>
        <p>9.所有有蓝色问号(<a-icon type="question-circle" theme="twoTone"/>)的地方，鼠标悬停在上面会有相应的提示信息。</p>
        <p>10.所有页面只有各模块负责人可填写，其他人只允许查看！</p>
      </a-card>
      <a-card hoverable :title="step2" style="width: 100%">
        <img
            src="../../../assets/process/step2.png"
            style="width: 100%"
        />
        <h5>说明</h5>
        <p>1.此页面操作参照“{{$t('sampleInput')}}”页面</p>
        <p>2.此页面审核由<span style="color: red">发起者</span>审核，如有疑问请联系相关负责人。</p>
        <p style="color: red">3.提交至生信分析之前，请先联系生信分析负责人！</p>
        <p>4.点击操作列的附件按钮，可查看当前条目上传的附件。</p>
      </a-card>
    </viewer>
  </div>

</template>

<script>

import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
  name: "processTip",
  components : {IconFont},
  data: function () {
    return {
      step2 : this.$t('samplePreparation') + "、" + this.$t('libraryPreparation') + "、" + this.$t('uploadConfirm')
          + "、" + this.$t('dismountData') + "、" + this.$t('bioinformaticsAnalysis')
    }
  }
}
</script>

<style scoped>

</style>