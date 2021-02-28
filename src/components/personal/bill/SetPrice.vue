<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :ghost="false"
        :title="$t('bill.unitPriceSet')"
    >
      <template slot="extra">
        <a-button type="primary" @click="addNewPrice">
          {{ $t("add") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="prices"
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
            {{ showText(record,index,col) }}
          </div>
          <a-input v-model="record.pricename"
                   v-else-if="col == 'pricename'"
                   ></a-input>

          <a-input-number style="width: 100%" v-else v-model="record[col]" />
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <a href="javascript:;" @click="savePrice(record)">Save</a>
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
  </div>
</template>

<script>
import i18n from "@/i18n";
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";

export default {
  name: "SetPrice",
  components: {Submitting},
  data : function (){
    return {
      tableLoad: false,
      prices: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    addNewPrice : function (){
      var item = {
        key : new Date().getTime(),
        pricename : "",
        price : 0,
        singlenum : 0,
        checkdays : 0,
        increnum : 0,
        incredays : 0,
        createdbdays : 0,
        seqcycle : 0,
        otherprice : 0,
        oldprice : 0,
      };
      this.prices.push(item);
    },
    savePrice : function (record){
      var postData = {
        price : JSON.stringify(record)
      }
      util.commonPost("/personal/bill/updatePrice",postData,this.initPage,this.$refs.submitting.$el);
    },
    showText : function (record,index,col){
      console.log(record,index,col);
      return index + 1;
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
    initPage : function (){
      this.initCols();
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/personal/bill/setInit",{}).then(function (res){
        _this.tableLoad = false;
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.prices = new Array();
          _this.prices = res.data.retMap.prices;
          _this.prices.map(item => item.key = item.id);
        }
      }).catch(function (res){
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols : function (){
      var scorllLength = 0;
      var clom = new Array();
      /**序号*/
      clom.push({
        title: i18n.t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });
      scorllLength += 50;

      /**收费项目*/
      clom.push({
        title: this.$t("bill.pricename"),
        dataIndex: 'pricename',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'pricename'
        },
        onFilter: (value, record) =>
            record.pricename
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

      /**单价*/
      clom.push({
        title: this.$t("bill.price"),
        dataIndex: 'price',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'price'
        },
        onFilter: (value, record) =>
            record.price
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

      /** 单次样本个数 */
      clom.push({
        title: this.$t("bill.singlenum"),
        dataIndex: 'singlenum',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'singlenum'
        },
        onFilter: (value, record) =>
            record.singlenum
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

      /** 检测周期（工作日） */
      clom.push({
        title: this.$t("bill.checkdays"),
        dataIndex: 'checkdays',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checkdays'
        },
        onFilter: (value, record) =>
            record.checkdays
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


      /** 送样本个数＞单次样本个数，每递增样本个数 */
      clom.push({
        title: this.$t("bill.increnum"),
        dataIndex: 'increnum',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'increnum'
        },
        onFilter: (value, record) =>
            record.increnum
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

      /** 递增的时间周期（工作日） */
      clom.push({
        title: this.$t("bill.incredays"),
        dataIndex: 'incredays',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'incredays'
        },
        onFilter: (value, record) =>
            record.incredays
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

      /** 诺禾 */
      clom.push({
        title: this.$t("bill.otherprice"),
        dataIndex: 'otherprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'otherprice'
        },
        onFilter: (value, record) =>
            record.otherprice
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

      /** 修改前价格 */
      clom.push({
        title: this.$t("bill.oldprice"),
        dataIndex: 'oldprice',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'oldprice'
        },
        onFilter: (value, record) =>
            record.oldprice
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

      /**操作*/
      clom.push({
        title: this.$t("operation"),
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
    }
  }
}
</script>

<style scoped>

</style>