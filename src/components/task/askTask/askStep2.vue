<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('expectionObject') + $t('prepare')"
    >
      <template slot="extra">
        <a-button @click="tempSave" v-if="isSupport">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button @click="submitPrepare"
                  v-if="isSupport"
                  :disabled="this.selectedRows.length == 0">
          {{ $t("complete") }}
        </a-button>
        <a-button type="danger" @click="batchRefuse"
                  v-if="isSupport"
                  :disabled="this.selectedRows.length == 0">
          {{ $t("fail") }}
        </a-button>
      </template>
      <a-row type="flex">

      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="prepares" bordered
             :loading="tableLoad"
             :row-selection="rowSelection"
             :scroll="scroll"
             :pagination="false"
             size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record, index"
      >
        <div :key="col">
          <a-date-picker v-if="col == 'detail.expectedtime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisable(col,record)"
                         v-model="record.detail.expectedtime"/>

          <a-date-picker v-else-if="col == 'starttime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisable(col,record)"
                         v-model="record.starttime"/>

          <a-date-picker v-else-if="col == 'endtime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisable(col,record)"
                         v-model="record.endtime"/>

          <a-date-picker v-else-if="col == 'createtime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisable(col,record)"
                         v-model="record.createtime"/>

          <a-date-picker v-else-if="col == 'completetime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisable(col,record)"
                         v-model="record.completetime"/>

          <a-date-picker v-else-if="col == 'realexptime'"
                         format="YYYY-MM-DD"
                         :disabled="isDisable(col,record)"
                         v-model="record.realexptime"/>


          <a-switch :checked-children="$t('yes')"
                    :un-checked-children="$t('no')"
                    :disabled="isDisable(col,record)"
                    v-else-if="col == 'needmore'"
                    v-model="record[col]"/>
          <!-- 序号 -->
          <a-input
              v-else-if="col != 'index' && col != 'animal.name'
              && col != 'animal.selfindex' && col != 'detail.purpose'"
              style="margin: -5px 0"
              :disabled="isDisable(col,record)"
              v-model="record[col]"
              :value="text"
          />
          <template v-else>
            {{ showText(col, text, index) }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" v-if="record.prestatu != '01' && record.prestatu != '03'"/>
            <a-icon type="clock-circle" theme="twoTone" two-tone-color="#FFCC00" v-if="record.prestatu == '01'"/>
            <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" v-if="record.prestatu == '03'"/>
          </span>
          &nbsp;
          <a @click="completePrepare(record)" v-if="record.prestatu == '01'">{{ $t("complete") }}</a>
          &nbsp;
          <a @click="showRefuseAlert(record)" v-if="record.prestatu == '01'">{{ $t("fail") }}</a>
          &nbsp;
          <a  @click="() => showReason(record.id)" v-if="record.prestatu == '03'">{{ $t("showReason") }}</a>
        </div>
      </template>
    </a-table>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
    <refuse-alert ref="refuseAlert" :modal-title="$t('fail')" @confirmFun="refusePrepare"></refuse-alert>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";
import RefuseAlert from "@/components/publib/refuseAlert";

export default {
  name: "askStep2",
  components: {RefuseAlert, Submitting},
  props : {
    taskId : String,
  },
  data : function (){
    return {
      prepares : [],
      columns :[],
      tableLoad : false,
      selectedRowKeys : [],
      selectedRows : [],
      scroll: {x: 1500},
      columnNames :[],
      task : {},
      ask : {},
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    batchRefuse :function (){
      this.$(this.$refs.refuseAlert.$el).modal("show");
    },
    showReason : function (id){
      var _this = this;
      this.$axios.post("/task/process/showStopReason", {detailId: id}).then(function (res) {
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$error({
            title: _this.$t("reason"),
            content: res.data.retMap.reason
          });
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    checkNull : function (list){
      for (var i = 0; i < list.length; i++){
        var prepare = list[i];
        if (util.isNull(prepare.completetime)){
          this.$message.error(this.$t("readyTime") +this.$t("not_null"));
          return  false;
        }
        if (util.isNull(prepare.realexptime)){
          this.$message.error(this.$t("allowTime") +this.$t("not_null"));
          return  false;
        }
        if (util.isNull(prepare.realage)){
          this.$message.error(this.$t("realAge") +this.$t("not_null"));
          return  false;
        }
        if (util.isNull(prepare.realnumber)){
          this.$message.error(this.$t("realNumber") +this.$t("not_null"));
          return  false;
        }
      }
      return true;
    },
    refusePrepare : function(reason,remark){
      this.$(this.$refs.refuseAlert.$el).modal("hide");
      var postData = {
        prepares : JSON.stringify(this.selectedRowKeys),
        reason : reason,
        remark : remark
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/ask/refusePrepare",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    submitPrepare : function (){
      if (!this.checkNull(this.selectedRows)){
        return ;
      }
      var list = new Array();
      for (var i = 0;i<this.selectedRows.length;i++){
        var pre = this.prepares[i];
        pre.needmore = pre.needmore?"Y" : "N";
        list.push(pre);
      }
      var postData = {
        prepares : JSON.stringify(list)
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/ask/confirmPrepare",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    completePrepare : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.submitPrepare();
    },
    showRefuseAlert : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.$(this.$refs.refuseAlert.$el).modal("show");
    },
    isDisable : function (col,record){
      if (record.prestatu != "01"){
        return true;
      }
      if (!this.$store.getters.isCurrentUser(this.task.currentuser)){
        return true;
      }
      if (col == "detail.purpose" || col == "starttime" || col == "remarks1"
          || col == "endtime" || col == "createtime" || col == "needmore"){
        return true;
      }
      return false;
    },
    tempSave : function (){
      var list = new Array();
      for (var i = 0;i<this.prepares.length;i++){
        var pre = this.prepares[i];
        pre.needmore = pre.needmore?"Y" : "N";
        list.push(pre);
      }
      var postData = {
        prepares : JSON.stringify(list)
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/ask/updatePrepares",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initPage : function (){
      this.initColumns();

      var postData = {
        taskId : this.taskId
      }
      var _this = this;
      _this.prepares = new Array()
      _this.tableLoad = true;

      this.$axios.post("/task/ask/getAllPrepares",postData).then(function (res){
        // console.log(res);
        _this.tableLoad = false;
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          console.log(res);
          for (var i=0;i<res.data.retMap.prepares.length;i++){
            var pre = res.data.retMap.prepares[i];
            pre.key = pre.id;
            pre.detail.expectedtime = formatDate(new Date(pre.detail.expectedtime),"yyyy-MM-dd");
            pre.createtime = formatDate(new Date(pre.createtime),"yyyy-MM-dd");
            if (!util.isNull(pre.starttime)){
              pre.starttime = formatDate(new Date(pre.starttime),"yyyy-MM-dd");
              pre.endtime = formatDate(new Date(pre.endtime),"yyyy-MM-dd");
            }
            if (!util.isNull(pre.createtime)){
              pre.createtime = formatDate(new Date(pre.createtime),"yyyy-MM-dd");
            }
            if (!util.isNull(pre.completetime)){
              pre.completetime = formatDate(new Date(pre.completetime),"yyyy-MM-dd");
            }
            if (!util.isNull(pre.realexptime)){
              pre.realexptime = formatDate(new Date(pre.realexptime),"yyyy-MM-dd");
            }
            pre.needmore = pre.needmore == "Y";
            _this.prepares.push(pre);
          }
          _this.task = res.data.retMap.task;
          _this.ask = res.data.retMap.ask;
          _this.selectedRowKeys = [];
          _this.selectedRows = [];
        }
      }).catch(function (res){
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initColumns : function (){
      var scorllLength = 0;
      var clom = new Array();
      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });
      scorllLength += 50;

      // /** 预计实验时间 */
      // clom.push({
      //   title: this.$t("expectedTime"),
      //   dataIndex: 'detail.expectedtime',
      //   width: '200px',
      //   scopedSlots: {customRender: 'detail.expectedtime'},
      // });
      // scorllLength += 200;

      /** 物种 */
      clom.push({
        title: this.$t("species"),
        dataIndex: 'animal.name',
        width: '200px',
        scopedSlots: {customRender: 'animal.name'},
      });
      scorllLength += 200;

      /** 品系（编号） */
      clom.push({
        title: this.$t("strain"),
        dataIndex: 'animal.selfindex',
        width: '150px',
        scopedSlots: {customRender: 'animal.selfindex'},
      });
      scorllLength += 150;

      /** 实验目的 */
      clom.push({
        title: this.$t("purpose"),
        dataIndex: 'detail.purpose',
        width: '200px',
        scopedSlots: {customRender: 'detail.purpose'},
      });
      scorllLength += 200;


      /** 需要扩繁 */
      clom.push({
        title: this.$t("needmore"),
        dataIndex: 'needmore',
        width: '100px',
        scopedSlots: {customRender: 'needmore'},
      });
      scorllLength += 100;

      /** 开始扩繁日期 */
      clom.push({
        title: this.$t("startmore"),
        dataIndex: 'starttime',
        width: '150px',
        scopedSlots: {customRender: 'starttime'},
      });
      scorllLength += 150;

      /** 预计扩繁完成日期 */
      clom.push({
        title: this.$t("endmore"),
        dataIndex: 'endtime',
        width: '150px',
        scopedSlots: {customRender: 'endtime'},
      });
      scorllLength += 150;

      /** 确认时间 */
      clom.push({
        title: this.$t("confirmTime"),
        dataIndex: 'createtime',
        width: '150px',
        scopedSlots: {customRender: 'createtime'},
      });
      scorllLength += 150;

      /** 备注 */
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remarks1',
        width: '200px',
        scopedSlots: {customRender: 'remarks1'},
      });
      scorllLength += 200;

      /** 样本准备日期ready */
      clom.push({
        title: this.$t("readyTime"),
        dataIndex: 'completetime',
        width: '200px',
        scopedSlots: {customRender: 'completetime'},
      });
      scorllLength += 200;

      /** 可以实验时间 */
      clom.push({
        title: this.$t("allowTime"),
        dataIndex: 'realexptime',
        width: '200px',
        scopedSlots: {customRender: 'realexptime'},
      });
      scorllLength += 200;

      /** 实际果蝇年龄 */
      clom.push({
        title: this.$t("realAge"),
        dataIndex: 'realage',
        width: '200px',
        scopedSlots: {customRender: 'realage'},
      });
      scorllLength += 200;

      /** 实际提供果蝇数量 */
      clom.push({
        title: this.$t("realNumber"),
        dataIndex: 'realnumber',
        width: '200px',
        scopedSlots: {customRender: 'realnumber'},
      });
      scorllLength += 200;

      /** 备注 */
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'reamrks2',
        width: '200px',
        scopedSlots: {customRender: 'reamrks2'},
      });
      scorllLength += 200;

      /**操作*/
      clom.push({
        slots : {title : "operationTitle"},
        // title: this.$t("operation"),
        dataIndex: 'operation',
        width: '150px',
        fixed: 'right',
        scopedSlots: {customRender: 'operation'},
      });
      scorllLength += 150;

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    showText: function (col, text, index) {
      console.log(col, text, index);
      if (col == "index") {
        return index + 1;
      }
      return text;
    },
  },
  watch : {
    taskId(){
      this.initPage();
    }
  },
  computed : {
    rowSelection() {
      const {selectedRowKeys, selectedRows} = this;
      return {
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.prestatu != "01",
          },
        }),
      };
    },
    isSupport : function (){
      return this.$store.getters.isCurrentUser(this.task.currentuser);
    },
    isCreater : function (){
      return this.$store.getters.isCurrentUser(this.task.createuser);
    }
  }
}
</script>

<style scoped>

</style>