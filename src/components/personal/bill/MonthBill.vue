<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :ghost="false"
        :title="$t('bill.monthBill')"
    >
      <template slot="extra">
        <a-month-picker @change="initPage" style="width: 100px" v-model="currentMonth" :disabled-date="disabledDate" placeholder="Select month" />
        <a-button type="primary">
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
          <a-input-number  v-if="isNum(col)" v-model="record[col]" />
          <a-input v-else v-model="record[col]" />
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import moment from 'moment';
import {formatDate} from "@/components/publib/date";

export default {
  name: "MonthBill",
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
    archiveBill : function (){

    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    isNum : function (col){
      if (col === "extractnum"
          || col === "checknum"
          || col === "amplificationnum"
          || col === "dbnum"
          || col === "datanum"
          || col === "extractprice"
          || col === "amplificationprice"
          || col === "createdbprice"
          || col === "seqprice"
          || col === "totalprice"
          || col === "checkprice"
          || col === "seqtotalprice"
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
        title: this.$t("bill.project"),
        dataIndex: 'shortdesc',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'shortdesc'
        },
        onFilter: (value, record) =>
            record.shortdesc
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

      /**建库时间*/
      clom.push({
        title: this.$t("createdbtime"),
        dataIndex: 'createdbtime',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createdbtime'
        },
        onFilter: (value, record) =>
            record.createdbtime
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

      /**文库类型*/
      clom.push({
        title: this.$t("databasetype2"),
        dataIndex: 'dbtype',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dbtype'
        },
        onFilter: (value, record) =>
            record.dbtype
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

      /**提取个数*/
      clom.push({
        title: this.$t("bill.extractnum"),
        dataIndex: 'extractnum',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'extractnum'
        },
        onFilter: (value, record) =>
            record.extractnum
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

      /**检测个数*/
      clom.push({
        title: this.$t("bill.checknum"),
        dataIndex: 'checknum',
        width: '200px',
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
      scorllLength += 100;

      /**扩增个数*/
      clom.push({
        title: this.$t("bill.amplificationnum"),
        dataIndex: 'amplificationnum',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'amplificationnum'
        },
        onFilter: (value, record) =>
            record.amplificationnum
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

      /**建库个数*/
      clom.push({
        title: this.$t("bill.dbnum"),
        dataIndex: 'dbnum',
        width: '200px',
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

      /**上机平台*/
      clom.push({
        title: this.$t("bill.uploadplatform"),
        dataIndex: 'uploadplatform',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'uploadplatform'
        },
        onFilter: (value, record) =>
            record.uploadplatform
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

      /**数据量（G）*/
      clom.push({
        title: this.$t("bill.datanum"),
        dataIndex: 'datanum',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'datanum'
        },
        onFilter: (value, record) =>
            record.datanum
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

      /**使用人*/
      clom.push({
        title: this.$t("bill.user"),
        dataIndex: 'userid',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'userid'
        },
        onFilter: (value, record) =>
            record.userid
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

      /**归属*/
      clom.push({
        title: this.$t("bill.belong"),
        dataIndex: 'groupid',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'groupid'
        },
        onFilter: (value, record) =>
            record.groupid
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

      /**提取检测价格*/
      clom.push({
        title: this.$t("bill.extractprice"),
        dataIndex: 'extractprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'extractprice'
        },
        onFilter: (value, record) =>
            record.extractprice
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

      /**扩增价格*/
      clom.push({
        title: this.$t("bill.amplificationprice"),
        dataIndex: 'amplificationprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'amplificationprice'
        },
        onFilter: (value, record) =>
            record.amplificationprice
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

      /**建库价格*/
      clom.push({
        title: this.$t("bill.createdbprice"),
        dataIndex: 'createdbprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createdbprice'
        },
        onFilter: (value, record) =>
            record.createdbprice
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

      /**建库价格*/
      clom.push({
        title: this.$t("bill.seqprice"),
        dataIndex: 'seqprice',
        width: '200px',
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
      scorllLength += 100;

      /**总价*/
      clom.push({
        title: this.$t("bill.totalprice"),
        dataIndex: 'totalprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'totalprice'
        },
        onFilter: (value, record) =>
            record.totalprice
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

      /**库检*/
      clom.push({
        title: this.$t("bill.checkprice"),
        dataIndex: 'checkprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checkprice'
        },
        onFilter: (value, record) =>
            record.checkprice
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

      /**测序*/
      clom.push({
        title: this.$t("bill.seqtotalprice"),
        dataIndex: 'seqtotalprice',
        width: '200px',
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
      scorllLength += 100;

      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remarks',
        width: '300px',
        scopedSlots: {customRender: 'remarks'},
      });
      scorllLength += 300;

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