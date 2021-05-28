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
                        :disabled-date="disabledDate" placeholder="Select month"/>
        <a-button type="primary" @click="regenerateBill" :disabled="isArchive">
          {{ $t("bill.regenerate") }}
        </a-button>
      </template>
      <a-row type="flex">
        <a-button @click="saveBill" :disabled="isArchive">
          {{ $t("save") }}
        </a-button>
        <a-button style="margin-left: 10px" @click="exportBill">
          {{ $t("outPut") }}
        </a-button>
        <a-popconfirm
            :title="$t('bill.archiveTip')"
            :ok-text="$t('yes')"
            :cancel-text="$t('no')"
            :disabled="isArchive"
            @confirm="archiveBill"
        >
          <a-button :disabled="isArchive" style="margin-left: 10px">
            {{ $t("bill.archive") }}
          </a-button>
        </a-popconfirm>
      </a-row>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="bills"
             :loading="tableLoad"
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
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <bill-detail :bill-group="record"></bill-detail>
      </p>
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text,record,index"
      >
        <div :key="col" :d="record">
          <div v-if="col == 'index'">
            {{ index + 1 }}
          </div>
          <div v-else>
            {{ text }}
          </div>
        </div>
      </template>
    </a-table>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";
import moment from "moment";
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";
import BillDetail from "@/components/personal/bill/billDetail";

export default {
  name: "monthBillNew",
  components: {BillDetail, Submitting},
  data: function () {
    return {
      tableLoad: false,
      bills: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      currentMonth: new moment().endOf('day')
    }
  },

  mounted() {
    this.initPage();
  },
  methods: {
    archiveBill: function () {
      var postData = {
        currentMonth: formatDate(this.currentMonth.toDate(), "yyyy-MM")
      }
      util.commonPost("/personal/bill/archiveBill", postData, this.initPage, this.$refs.submitting.$el);
    },
    exportBill: function () {
      var postData = {
        currentMonth: formatDate(this.currentMonth.toDate(), "yyyy-MM")
      }
      util.downLoad(postData, "/personal/bill/exportBill",
          formatDate(this.currentMonth.toDate(), "yyyyMM") + "账单.xls");
    },
    saveBill: function () {
      var postData = {
        bills: JSON.stringify(this.bills)
      }
      util.commonPost("/personal/bill/updateBills", postData, this.initPage, this.$refs.submitting.$el);
    },
    initPage: function () {
      this.initCols();
      this.tableLoad = true;
      var postData = {
        currentMonth: formatDate(this.currentMonth.toDate(), "yyyy-MM")
      }
      var _this = this;
      this.$axios.post("/personal/bill/initMonthBill", postData).then(function (res) {
        _this.tableLoad = false;
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.bills = new Array();
          if (res.data.retMap.bills != undefined && res.data.retMap.bills.length > 0) {
            res.data.retMap.bills.map(bill => {
              bill.key = bill.id;
              _this.bills.push(bill);
            })
          }
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day');
    },
    regenerateBill: function () {
      var postData = {
        currentMonth: formatDate(this.currentMonth.toDate(), 'yyyy-MM')
      }
      util.commonPost("/personal/bill/regenerateBill", postData, this.initPage, this.$refs.submitting.$el);
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
    initCols: function () {
      var scorllLength = 0;
      var clom = new Array();
      // /**序号*/
      // clom.push({
      //   title: this.$t("index"),
      //   dataIndex: 'index',
      //   width: '50px',
      //   fixed: 'left',
      //   scopedSlots: {customRender: 'index'},
      // });
      // scorllLength += 50;

      /**所属部门*/
      clom.push({
        title: this.$t("bill.groupname"),
        dataIndex: 'groupname',
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

      clom.push({
        title: this.$t("bill.detectcost"),
        dataIndex: 'detectcost',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'detectcost'
        },
        onFilter: (value, record) =>
            record.detectcost
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

      clom.push({
        title: this.$t("bill.extractcost"),
        dataIndex: 'extractcost',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'extractcost'
        },
        onFilter: (value, record) =>
            record.extractcost
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

      clom.push({
        title: this.$t("bill.libdbcost"),
        dataIndex: 'libdbcost',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'libdbcost'
        },
        onFilter: (value, record) =>
            record.libdbcost
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

      clom.push({
        title: this.$t("bill.seqcost"),
        dataIndex: 'seqcost',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'seqcost'
        },
        onFilter: (value, record) =>
            record.seqcost
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

      clom.push({
        title: this.$t("bill.totalcost"),
        dataIndex: 'totalcost',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'totalcost'
        },
        onFilter: (value, record) =>
            record.totalcost
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

      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remark',
        scopedSlots: {customRender: 'remark'},
      });

      // /**操作*/
      // clom.push({
      //   title: this.$t("operation"),
      //   dataIndex: 'operation',
      //   width: '100px',
      //   fixed: 'right',
      //   scopedSlots: {customRender: 'operation'},
      // });
      // scorllLength += 100;

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    }
  },
  computed : {
    isArchive : function (){
      for(var i = 0; i < this.bills.length; i++){
        if (this.bills[i].curentstatu === "02"){
          return true;
        }
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>