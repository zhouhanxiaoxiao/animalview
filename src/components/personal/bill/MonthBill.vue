<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :ghost="false"
        :title="$t('bill.monthBill')"
    >
      <template slot="extra">
        <a-month-picker @change="initPage" style="width: 100px"
                        v-model="currentMonth"
                        :format="'yyyy-MM'"
                        :disabled-date="disabledDate" placeholder="Select month" />
        <a-button type="primary" @click="regenerateBill">
          {{ $t("bill.regenerate") }}
        </a-button>
      </template>
      <a-row type="flex">
        <a-button >
          {{ $t("save") }}
        </a-button>

        <a-button style="margin-left: 10px">
          {{ $t("outPut") }}
        </a-button>
        <a-popconfirm
            :title="$t('bill.archiveTip')"
            :ok-text="$t('yes')"
            :cancel-text="$t('yes')"
            @confirm="archiveBill"
        >
          <a-button style="margin-left: 10px">
            {{ $t("bill.archive") }}
          </a-button>
        </a-popconfirm>

      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="bills"
             bordered
             :loading="tableLoad"
             :scroll="scroll"
             :pagination="false"
             size="middle">
      <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
      >
        <a-input
            v-ant-ref="c => (searchInput = c)"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block;"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          {{ $t("search") }}
        </a-button>
        <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
          {{ $t("reset") }}
        </a-button>
      </div>
      <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text,record,index"
      >
        <div :key="col">
          <div v-if="col == 'index'">
            {{ index + 1 }}
          </div>
          <a-input v-else-if="col === 'remark'" v-model="record.remark"></a-input>
          <a-input-number  v-else-if="isNum(col)" min="0"
                           v-model="record[col]" style="width: 100%" @change="calculation(record)"/>
          <div v-else>{{ text }}</div>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <a href="javascript:;" @click="saveBill(record)">Save</a>
        </div>
      </template>
    </a-table>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import moment from 'moment';
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";

export default {
  name: "MonthBill",
  components: {Submitting},
  data :function (){
    return {
      tableLoad: false,
      bills: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      currentMonth : new moment().endOf('day')
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    calculation : function (record){
      record.dbtotalprice = (record.dbprice * record.dbnum).toFixed(2);
      record.seqtotalprice = (record.seqnum * record.seqprice).toFixed(2);
      record.checktotal = (record.checknum * record.checkpirce).toFixed(2);
    },
    regenerateBill : function (){
      var postData = {
        currentMonth : formatDate(this.currentMonth.toDate(),'yyyy-MM')
      }
      util.commonPost("/personal/bill/regenerateBill",postData,this.initPage,this.$refs.submitting.$el);
    },
    archiveBill : function (){

    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    isNum : function (col){
      if (col === "dbnum"
          || col === "dbprice"
          || col === "seqnum"
          || col === "seqprice"
          || col === "checknum"
          || col === "checkpirce"
      ){
        return true;
      }
      return  false;
    },
    isText : function (col){
      if (col === "shortdesc"
          || col === "remark"
      ){
        return true;
      }
    },
    initPage : function (){
      this.initCols();
      this.tableLoad = true;
      var postData = {
        currentMonth : formatDate(this.currentMonth.toDate(),"yyyy-MM")
      }
      var _this = this;
      this.$axios.post("/personal/bill/getCurrentBill",postData).then(function (res){
        _this.tableLoad = false;
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.bills = new Array();
          if (res.data.retMap.bills != undefined && res.data.retMap.bills.length > 0){
            res.data.retMap.bills.map(bill =>{
              bill.key = bill.id;
              _this.bills.push(bill);
            })
          }
        }
      }).catch(function (res){
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initCols : function (){
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

      /**收费项目*/
      clom.push({
        title: this.$t("bill.projectname"),
        dataIndex: 'projectname',
        width: '350px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'projectname'
        },
        onFilter: (value, record) =>
            record.projectname
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 350;

      /**用户*/
      clom.push({
        title: this.$t("bill.username"),
        dataIndex: 'username',
        width: '100px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'username'
        },
        onFilter: (value, record) =>
            record.username
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 100;

      /**所属部门*/
      clom.push({
        title: this.$t("bill.groupname"),
        dataIndex: 'groupname',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'groupname'
        },
        onFilter: (value, record) =>
            record.groupname
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**文库名称*/
      clom.push({
        title: this.$t("bill.libtype"),
        dataIndex: 'dbname',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dbname'
        },
        onFilter: (value, record) =>
            record.dbname
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 200;

      /**文库数量*/
      clom.push({
        title: this.$t("bill.dbnum"),
        dataIndex: 'dbnum',
        width: '100px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dbnum'
        },
        onFilter: (value, record) =>
            record.dbnum
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 100;

      /**建库单价*/
      clom.push({
        title: this.$t("bill.dbprice"),
        dataIndex: 'dbprice',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dbprice'
        },
        onFilter: (value, record) =>
            record.dbprice
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**建库总计*/
      clom.push({
        title: this.$t("bill.dbtotalprice"),
        dataIndex: 'dbtotalprice',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dbtotalprice'
        },
        onFilter: (value, record) =>
            record.dbtotalprice
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**测序数量*/
      clom.push({
        title: this.$t("bill.seqnum"),
        dataIndex: 'seqnum',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'seqnum'
        },
        onFilter: (value, record) =>
            record.seqnum
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**测序单价*/
      clom.push({
        title: this.$t("bill.seqprice"),
        dataIndex: 'seqprice',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'seqprice'
        },
        onFilter: (value, record) =>
            record.seqprice
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**测序总价*/
      clom.push({
        title: this.$t("bill.seqtotalprice"),
        dataIndex: 'seqtotalprice',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'seqtotalprice'
        },
        onFilter: (value, record) =>
            record.seqtotalprice
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**库检数量*/
      clom.push({
        title: this.$t("bill.checknum"),
        dataIndex: 'checknum',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checknum'
        },
        onFilter: (value, record) =>
            record.checknum
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**库检单价*/
      clom.push({
        title: this.$t("bill.checkpirce"),
        dataIndex: 'checkpirce',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checkpirce'
        },
        onFilter: (value, record) =>
            record.checkpirce
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**库检总价*/
      clom.push({
        title: this.$t("bill.checktotal"),
        dataIndex: 'checktotal',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checktotal'
        },
        onFilter: (value, record) =>
            record.checktotal
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });
      scorllLength += 150;

      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remark',
        width: '400px',
        scopedSlots: {customRender: 'remark'},
      });
      scorllLength += 400;

      /**操作*/
      clom.push({
        title: this.$t("operation"),
        dataIndex: 'operation',
        width: '100px',
        fixed: 'right',
        scopedSlots: {customRender: 'operation'},
      });
      scorllLength += 100;

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
  },
  watch : {
    currentMonth(newVal){
      console.log(formatDate(newVal.toDate(),"yyyy-MM"));
    }
  }
}
</script>

<style scoped>

</style>