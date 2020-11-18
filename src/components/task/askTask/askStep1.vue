<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('orderDetail') + $t('confirm')"

    >
      <template slot="extra">
        <a-button @click="tempSave" v-if="isCreater">
          {{ $t("tmpSave") }}
        </a-button>
        <a-button @click="batchConfirm" :disabled="this.selectedRows.length == 0"
                  v-if="isSupport">
          {{ $t("confirm") }}
        </a-button>
        <a-button type="danger"  @click="batchRefuse"
                  v-if="isSupport"
                  :disabled="this.selectedRows.length == 0">
          {{ $t("refuse") }}
        </a-button>

      </template>
      <a-row type="flex">

      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="details" bordered
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
          <a-date-picker v-if="col == 'expectedtime'"
                         :disabled="isDisable(col,record)"
                         format="YYYY-MM-DD"
                         :disabled-date="disabledDate"
                         v-model="record.expectedtime"/>

          <a-switch :checked-children="$t('yes')"
                    :un-checked-children="$t('no')"
                    :disabled="isDisable(col,record)"
                    v-else-if="col == 'virginfly' || col=='ishybridizationnecessary' || col=='specialfeeding'"
                    default-checked
                    v-model="record[col]"/>

          <a-select style="width: 100%"
                    v-else-if="col == 'directors'"
                    :disabled="isDisable(col,record)"
                    mode="multiple"
                    v-model="record.directors"
          >
            <a-select-option v-for="item in users" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>

          <a-select style="width: 100%"
                    v-else-if="col == 'supporter'"
                    :disabled="isDisable(col,record)"
                    v-model="record.supporter"
          >
            <a-select-option v-for="item in users" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>

          <a-select style="width: 100%"
                    v-else-if="col == 'hybridstrain'"
                    :disabled="isDisable(col,record)"
                    v-model="record.hybridstrain"
          >
            <a-select-option v-for="item in animals" :key="item.id" :value="item.id">
              {{ item.selfindex + "-" + item.stockId }}
            </a-select-option>
          </a-select>
          <a-radio-group
              default-value="empty"
              v-model="record[col]"
              v-else-if="col == 'gender'"
              :disabled="isDisable(col,record)"
              >
            <a-radio value="male">
              {{ $t('male') }}
            </a-radio>
            <a-radio value="female">
              {{ $t('female') }}
            </a-radio>
            <a-radio value="empty">
              {{ $t('empty') }}
            </a-radio>
          </a-radio-group>
          <!-- 序号 -->
          <a-input
              :disabled="isDisable(col,record)"
              v-else-if="col != 'index' && col != 'animal.name'
               && col != 'animal.selfindex' && col != 'stock.stockindex'"
              style="margin: -5px 0"
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
            <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" v-if="record.confirmstatu == '01'"/>
            <a-icon type="clock-circle" theme="twoTone" two-tone-color="#FFCC00" v-if="record.confirmstatu == '00'"/>
            <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" v-if="record.confirmstatu == '02'"/>
          </span>
          &nbsp;
          <a @click="showConfirmAlert(record)" v-if="record.confirmstatu == '00'">{{ $t("confirm") }}</a>
          &nbsp;
          <a @click="showRefuseAlert(record)" v-if="record.confirmstatu == '00'">{{ $t("refuse") }}</a>
          &nbsp;
          <a  @click="() => showReason(record.id)" v-if="record.confirmstatu == '02'">{{ $t("showReason") }}</a>
        </div>
      </template>
    </a-table>
    <refuse-alert ref="refuseAlert" :modal-title="$t('refuseTask')" @confirmFun="refuseTask"></refuse-alert>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <confirm-ask-task ref="confirmAsk" @confirmData="confrimAskData"></confirm-ask-task>
  </div>
</template>

<script>

import {formatDate} from "@/components/publib/date";
import RefuseAlert from "@/components/publib/refuseAlert";
import Submitting from "@/components/publib/submitting";
import ConfirmAskTask from "@/components/task/confirmAskTask";
export default {
  name: "askStep1",
  components: {ConfirmAskTask, Submitting, RefuseAlert},
  props : {
    taskId : String,
  },
  data : function (){
    return {
      details : [],
      columns :[],
      tableLoad : false,
      selectedRowKeys : [],
      selectedRows : [],
      scroll: {x: 1500},
      columnNames :[],
      ddd : undefined,
      ask : {},
      task : {},
      animals : [],
      users : []
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    batchRefuse : function (){
      this.$(this.$refs.refuseAlert.$el).modal("show");
    },
    batchConfirm : function (){
      this.$(this.$refs.confirmAsk.$el).modal("show");
    },
    tempSave : function (){
      var list = new Array();
      for (var i = 0; i < this.details.length; i++){
        var detail = this.details[i];
        detail.virginfly = detail.virginfly ? "Y" : "N";
        detail.ishybridizationnecessary = detail.ishybridizationnecessary ? "Y" : "N";
        detail.specialfeeding = detail.specialfeeding ? "Y" : "N";
        list.push(detail);
      }
      var postData = {
        details : JSON.stringify(list)
      }
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("task/ask/updateDetails",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    confrimAskData : function (data){
      this.$(this.$refs.confirmAsk.$el).modal("hide");
      var _this = this;
      data.taskid = this.taskId;
      data.detailId = JSON.stringify(this.selectedRowKeys);
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/ask/confirm",data).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showConfirmAlert : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.$(this.$refs.confirmAsk.$el).modal("show");
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
    showRefuseAlert : function (record){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.$(this.$refs.refuseAlert.$el).modal("show");
    },
    refuseTask : function(reason,remarks){
      this.$(this.$refs.refuseAlert.$el).modal("hide");
      var _this = this;
      var postData = {
        taskId : this.taskId,
        detailId : JSON.stringify(this.selectedRowKeys),
        remarks : remarks,
        reason : reason
      }
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/ask/refuse",postData).then(function (res){
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
    isDisable : function (col,record){
      if (record.confirmstatu != "00"){
        return true;
      }
      if (!this.$store.getters.isCurrentUser(this.ask.creater)){
        return true;
      }
      if(col == "hybridstrain" && !record.ishybridizationnecessary){
        return true;
      }
      if(col == "specificfeeding" && !record.specialfeeding){
        return true;
      }
      return false;
    },
    disabledDate : function (val){
      console.log(val);
      return val.toDate().getTime() <= new Date().getTime();
    },
    initPage : function (){
      this.initColumns();
      var _this = this;
      console.log(this.taskId);
      if (this.taskId == "" || this.taskId == undefined || this.taskId == null){
        return;
      }
      var postData = {
        taskId : this.taskId
      };
      this.tableLoad = true;
      _this.details = new Array();
      this.$axios.post("/task/askTaskDetailNew",postData).then(function (res) {
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          if (res.data.retMap == null|| res.data.retMap == undefined){
            return ;
          }
          console.log(res);
          _this.tableLoad = false;
          console.log(res)
          for (var i = 0; i< res.data.retMap.details.length; i++){
            var detail = res.data.retMap.details[i];
            detail.key = detail.id;
            detail.virginfly = detail.virginfly == "Y";
            detail.ishybridizationnecessary = detail.ishybridizationnecessary == "Y";
            detail.specialfeeding = detail.specialfeeding == "Y";
            detail.expectedtime = formatDate(new Date(detail.expectedtime),"yyyy-MM-dd");
            _this.details.push(detail);
          }

          _this.ask = res.data.retMap.ask;
          _this.animals = res.data.retMap.animals;
          _this.users = res.data.retMap.users;
          _this.task = res.data.retMap.task;
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
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

      /** 实验负责人 */
      clom.push({
        title: this.$t("studyDirector"),
        dataIndex: 'directors',
        width: '150px',
        scopedSlots: {customRender: 'directors'},
      });
      scorllLength += 150;

      /** 材料提供人员 */
      clom.push({
        title: this.$t("supporter"),
        dataIndex: 'supporter',
        width: '150px',
        scopedSlots: {customRender: 'supporter'},
      });
      scorllLength += 150;

      /** 预计实验时间 */
      clom.push({
        title: this.$t("expectedTime"),
        dataIndex: 'expectedtime',
        width: '150px',
        scopedSlots: {customRender: 'expectedtime'},
      });
      scorllLength += 150;

      /** 实验目的 */
      clom.push({
        title: this.$t("purpose"),
        dataIndex: 'purpose',
        width: '200px',
        scopedSlots: {customRender: 'purpose'},
      });
      scorllLength += 200;

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

      /** 库存编号 */
      clom.push({
        title: "库存编号",
        dataIndex: 'stock.stockindex',
        width: '150px',
        scopedSlots: {customRender: 'stock.stockindex'},
      });
      scorllLength += 200;

      /** 处女蝇 */
      clom.push({
        title: this.$t("virginFly"),
        dataIndex: 'virginfly',
        width: '100px',
        scopedSlots: {customRender: 'virginfly'},
      });
      scorllLength += 100;

      /** 性别 */
      clom.push({
        title: this.$t("gender"),
        dataIndex: 'gender',
        width: '250px',
        scopedSlots: {customRender: 'gender'},
      });
      scorllLength += 250;

      /** 是否需要杂交 */
      clom.push({
        title: this.$t("isHybridizationNecessary"),
        dataIndex: 'ishybridizationnecessary',
        width: '150px',
        scopedSlots: {customRender: 'ishybridizationnecessary'},
      });
      scorllLength += 150;

      /** 对应的杂交品系 */
      clom.push({
        title: this.$t("hybridStrain"),
        dataIndex: 'hybridstrain',
        width: '300px',
        scopedSlots: {customRender: 'hybridstrain'},
      });
      scorllLength += 300;

      /** 特殊饲养条件 */
      clom.push({
        title: this.$t("specialFeeding"),
        dataIndex: 'specialfeeding',
        width: '150px',
        scopedSlots: {customRender: 'specialfeeding'},
      });
      scorllLength += 150;

      /** 具体饲养条件 */
      clom.push({
        title: this.$t("specificFeeding"),
        dataIndex: 'specificfeeding',
        width: '200px',
        scopedSlots: {customRender: 'specificfeeding'},
      });
      scorllLength += 200;

      /** 年龄day */
      clom.push({
        title: this.$t("age"),
        dataIndex: 'age',
        width: '200px',
        scopedSlots: {customRender: 'age'},
      });
      scorllLength += 200;

      /** 拟用数量 */
      clom.push({
        title: this.$t("orderNumber"),
        dataIndex: 'ordernumber',
        width: '200px',
        scopedSlots: {customRender: 'ordernumber'},
      });
      scorllLength += 200;

      /** 操作流程 */
      clom.push({
        title: this.$t("operationProcess"),
        dataIndex: 'operationprocess',
        width: '200px',
        scopedSlots: {customRender: 'operationprocess'},
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
    ddd(newVal){
      console.log(newVal);
    },
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
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: record => ({
          props: {
            // Column configuration not to be checked
            disabled: record.confirmstatu != "00"
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