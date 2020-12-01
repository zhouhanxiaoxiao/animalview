<template>
  <div class="form-row">
    <div class="col-md-12">
      <a-card style="width: 100%">
        <a-result
            slot="cover"
            :title="$t('isComplete') + '?'"
            sub-title=""
        >
          <template #icon>
<!--            给自己打个分：<a-rate :default-value="2.5" allow-half v-model="score"/>-->
            <icon-font style="font-size: 150px" slot="prefix" type="iconguoying" />
          </template>
          <template #extra>
            <div style="width: 100%" v-if="canComplete">
              <a-button key="console" type="primary" @click="updateConfirm('Y')" :disabled="!canComplete">
                {{ $t("yes") }}
              </a-button>
              <a-button key="buy" @click="updateConfirm('N')"  style="margin-left: 10px"  :disabled="!canComplete">
                {{ $t("no") }}
              </a-button>
            </div>
            <a-icon type="check" style="font-size: 50px" v-if="ask.currentstatu=='05'" />
            <a-icon type="close" style="font-size: 50px" v-if="ask.currentstatu=='08'" />
            <div style="width: 100%;margin-top: 20px" >
              <a-textarea v-if="canComplete" style="width: 80%" placeholder="备注：" v-model="remark"></a-textarea>
              <a-tag color="purple" v-else-if="confirm.remarks != '' ">
                {{ confirm.remarks}}
              </a-tag>
            </div>
          </template>
        </a-result>

<!--        <a-card-meta title="Europe Street beat" style="width:100%;text-align: center;">-->
<!--          <template slot="description">-->
<!--            www.instagram.com-->
<!--          </template>-->
<!--        </a-card-meta>-->
      </a-card>
    </div>
  </div>
</template>

<script>
import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
  name: "askStep3",
  components : {IconFont},
  props : {
    taskId : String,
  },
  data : function (){
    return{
      ask : {},
      confirm :{},
      score : 2.5,
      remark :""
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    updateConfirm : function (flag){
      var postData = {
        askId : this.ask.id,
        flag : flag,
        remark : this.remark
      }
      var _this = this;
      this.$axios.post("/task/ask/finalConfirm",postData).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initPage : function (){
      var postData = {
        taskId : this.taskId
      }
      var _this = this;
      this.$axios.post("/task/ask/finalInit",postData).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.ask = res.data.retMap.ask;
          _this.confirm = res.data.retMap.confirm;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch : {
    taskId(){
      this.initPage();
    }
  },
  computed : {
    canComplete : function (){
      if (this.ask.currentstatu == "04"
          && this.$store.getters.isCurrentUser(this.ask.creater)
      ){
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>