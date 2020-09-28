<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container current-stock">
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          :title="$t('current_stock')"
      >
        <template slot="extra">
          <a-button type="primary" @click="batchOrder" v-if="canOrder" :disabled="this.selectedRowKeys.length == 0">
            {{ $t("batchEdit") }}
          </a-button>
          <a-button type="primary" @click="addNewStock" v-if="canEdit">
            {{ $t("add") }}
          </a-button>

          <a-button type="danger" @click="batchDelete" :disabled="selectedRowKeys.length == 0" v-if="canEdit">
            {{ $t("delete") }}
          </a-button>
          <a-upload
              name="file"
              :multiple="false"
              :action="this.$axios.defaults.baseURL + '/file/import/stockImport'"
              :headers="{token:this.$cookies.get('token')}"
              @change="handleUploadChange"
              :show-upload-list="false"
              v-if="canEdit"
          >
            <a-button>
              <a-icon type="upload"/>
              {{ $t("input") }}
            </a-button>
          </a-upload>
        </template>
      </a-page-header>
      <a-table :data-source="data"
               :row-selection="rowSelection"
               :pagination="pagina"
               :loading="tableLoad"
               :columns="columns" >
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
            slot-scope="text,record"
        >
          <div :key="col">
            <div v-if="col == 'operation'">
              <button type="button" class="btn btn-primary btn-sm stock-action"
                      @click="makeAppointment(record.id)"
                      v-if="canOrder"
                      :disabled="record.contanernmuber < 1 || record.contanernmuber == null">
                预约
              </button>
              &nbsp;
              <button type="button"
                      class="btn btn-primary btn-sm stock-action"
                      v-if="canEdit"
                      @click="editStock(record.id)"
              >
                编辑
              </button>
            </div>
            <template v-else>
              <a-tooltip placement="topLeft" :title="showText(text,col,record)">
              {{ showText(text,col,record) }}
              </a-tooltip>
            </template>
          </div>
        </template>
        <template slot="customRender" slot-scope="text,column,record">
          <template>
            <a-tooltip placement="topLeft" :title="showText(text,column,record)">
              {{ showText(text,column,record) }}
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </div>
    <AppointmentDialog @submitData="submitAllData" :stock-ids="orderIds"></AppointmentDialog>
    <submitting :title="$t('submitting')"></submitting>
    <add-new-stock ref="addNewStock" @currentInit="initStockTable"></add-new-stock>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import AppointmentDialog from "@/components/stockcenter/AppointmentDialog";
import Submitting from "@/components/publib/submitting";
import AddNewStock from "@/components/stockcenter/addNewStock";
import {formatDate} from "@/components/publib/date";
import util from "@/components/publib/util";
export default {
  name: "currentStock",
  components: {AddNewStock, Submitting, AppointmentDialog, TopNav},
  data: function () {
    return {
      data : [],
      columns : [],
      columnNames : [],
      orderIds: [],
      selectedList: [],
      titles: [],
      rows: [],
      selectedLine: [],
      currentPage: 0,
      pageSize: 10,
      total: 0,
      selectedRowKeys : [],
      selectedRows : [],
      tableLoad : false
    }
  },
  beforeMount: function () {
    this.initStockTable();
  },
  methods : {
    batchDelete : function (){
      var psotData = {
        stockIds : this.selectedRowKeys
      };
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/stock/edit/delete",psotData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initStockTable();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    handleUploadChange: function (ret) {
      util.commonHandleUploadChange(ret);
    },
    addNewStock : function (){
      this.$(this.$refs.addNewStock.$el).modal("show");
    },
    batchOrder: function () {
      this.orderIds = new Array();
      for (var i = 0; i < this.selectedRowKeys.length; i++) {
        this.orderIds.push(this.selectedRowKeys[i]);
      }
      this.$("#exampleModal").modal();
    },
    editStock : function (stockId){
      this.$router.push({name:"stockEdit",query:{stockId:stockId}});
    },
    makeAppointment: function (id) {
      event.stopPropagation();
      this.orderIds = new Array();
      this.orderIds.push(id);
      this.$("#exampleModal").modal('show');
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
    submitAllData: function (data) {
      this.$("#submitting").modal('show');
      var _this = this;
      console.log(data);
      this.$axios.post("/task/askTask", data).then(function (res) {
        console.log(res);
        _this.$("#submitting").modal('hide');
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          window.location.reload();
        }
      }).catch(function (res) {
        console.log(res);
        _this.$("#submitting").modal('hide');
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initStockTable: function () {
      this.initColumns();
      var _this = this;
      var postData = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.tableLoad = true;
      this.$axios.post("/stock/currentStock", postData).then(function (res) {
        console.log(res);
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.data = new Array();
          var currentStock = res.data.retMap.currentStock;
          if (currentStock != null && currentStock.length > 0) {
            for (var i = 0; i < currentStock.length; i++) {
              var stockTmp = currentStock[i];
              stockTmp.key = stockTmp.id;
              _this.data.push(stockTmp);
            }
          }
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showText(text,column,record){
      console.log(text,column,record);
      if (column == "usagetype"){
        if (record.usagetype == "keep"){
          return "保种";
        }else {
          return "库存";
        }
      }
      if(column == "createtime"){
        return  formatDate(new Date(record.createtime),"yyyy-MM-dd");
      }
      return text;
    },
    initColumns : function (){
      var cols = new Array();
      cols.push({
        title: "编号",
        dataIndex: 'animal.selfindex',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'animal.selfindex',
        },
        onFilter: (value, record) =>
            record.animal.selfindex
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
      cols.push({
        title: "stock ID",
        dataIndex: 'animal.stockId',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'animal.stockId',
        },
        onFilter: (value, record) =>
            record.animal.stockId
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
      cols.push({
        title: "genotype",
        dataIndex: 'animal.genotype',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'animal.genotype',
        },
        onFilter: (value, record) =>
            record.animal.genotype
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
      cols.push({
        title: "resource",
        dataIndex: 'animal.resource',
        scopedSlots: {
          customRender: 'animal.resource',
        },
        ellipsis: true,
      });
      cols.push({
        title: "容器类型",
        dataIndex: 'contanertype',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'contanertype',
        },
        onFilter: (value, record) =>
            record.contanertype
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
      cols.push({
        title: "数量",
        dataIndex: 'contanernmuber',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'contanernmuber',
        },
        onFilter: (value, record) =>
            record.contanernmuber
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

      cols.push({
        title: "用途",
        dataIndex: 'usagetype',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'usagetype',
        },
        onFilter: (value, record) =>{
          var usage = "库存";
          if (record.usagetype == "keep"){
            usage = "保种";
          }
          return usage
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      cols.push({
        title: "保存环境",
        dataIndex: 'env.displayname',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'env.displayname',
        },
        onFilter: (value, record) =>
            record.env.displayname
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
      cols.push({
        title: "建管日期",
        dataIndex: 'createtime',
        ellipsis: true,
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createtime',
        },
        onFilter: (value, record) =>{
          var createT = formatDate(new Date(record.createtime),"yyyy-MM-dd");
          return createT
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase());
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      cols.push({
        title: "操作",
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
      });

      this.columns = cols;
      this.columnNames = new Array();
      for (var item in cols){
        this.columnNames.push(cols[item].dataIndex);
      }
    }
  },
  computed : {
    canEdit: function () {
      for (var i = 0; i < this.$store.getters.getUser.roles.length; i++) {
        var role = this.$store.getters.getUser.roles[i];
        if (role.roletype == "999999" || role.roletype == "02") {
          return true;
        }
      }
      return false;
    },
    canOrder: function () {
      for (var i = 0; i < this.$store.getters.getUser.roles.length; i++) {
        var role = this.$store.getters.getUser.roles[i];
        if (role.roletype == "999999" || role.roletype == "01") {
          return true;
        }
      }
      return false;
    },
    pagina(){
      return{
        showSizeChanger : true,
        showQuickJumper : true,
        pageSizeOptions:['10','20','50','100']
      }
    },
    rowSelection() {
      const { selectedRowKeys,selectedRows } = this;
      return {
        selectedRowKeys : selectedRowKeys,
        selectedRows : selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        getCheckboxProps: record => ({
          props: {
            // Column configuration not to be checked
            disabled: record.currentstatu == "09",
          },
        }),
      };
    },
  }
}
</script>

<style scoped>
  .current-stock{
    font-size: 12px !important;
  }
</style>