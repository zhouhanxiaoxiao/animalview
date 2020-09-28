<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          :title="$t('current_strain')"
      >
        <template slot="extra">
          <a-popconfirm
              :disabled="selectedRowKeys.length == 0"
              :title="$t('areyousureDelete')"
              @confirm="() => deleteAllStrain()"
              v-if="this.$store.getters.isFeeder"
          >
            <a-button type="danger" :disabled="selectedRowKeys.length == 0">
              {{$t("delete")}}
            </a-button>
          </a-popconfirm>

          <a-button type="primary" v-if="this.$store.getters.isFeeder"
                    @click="showAdd">
            {{ $t("add") }}
          </a-button>
          <a-upload
              name="file"
              v-if="this.$store.getters.isFeeder"
              :multiple="false"
              :show-upload-list="false"
              :action="this.$axios.defaults.baseURL + 'file/import/initDrop'"
              :headers="{token:this.$cookies.get('token')}"
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
              <a-popconfirm
                  v-if = "record.curstatu != '09'"
                  :title="$t('areyousureDelete')"
                  @confirm="() => delStrainById(record.key)"
              >
                <a-button type="danger" size="small" style="margin: 2px 2px" >
                  {{$t("delete")}}
                </a-button>
              </a-popconfirm>

              <a-button type="primary" size="small" style="margin: 2px 2px"
                        @click="showEditStrain(record.key)"
                        v-if="record.curstatu != '09'">
                {{$t("edit")}}
              </a-button>
            </div>
            <template v-else>
              <a-tooltip placement="topLeft" :title="showText(text,col,record)">
                {{ showText(text,col,record) }}
              </a-tooltip>
            </template>
          </div>
        </template>
      </a-table>
    </div>
    <add-new-strain @submitData="submitData"></add-new-strain>
    <submitting :title="$t('submitting')"></submitting>
    <edit-strain :strain-id="strainId" @updateStrain="updateStrain"></edit-strain>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import Submitting from "@/components/publib/submitting";
import AddNewStrain from "@/components/stockcenter/addNewStrain";
import {formatDate} from "@/components/publib/date";
import EditStrain from "@/components/stockcenter/editStrain";

export default {
  name: "currentStrainNew",
  components: {EditStrain, AddNewStrain, Submitting, TopNav},
  data : function (){
    return {
      data : [],
      tableLoad : false,
      strainId : "",
      columnNames : [],
      strains: [],
      columns : [],
      selectedRowKeys : [],
      selectedRows : [],
      pageSize: 10,
      total: 0,
      currentPage: 0
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    updateStrain : function (subData){
      var post = {
        subData : subData
      }
      var _this = this;
      this.$("#editStrainModal").modal("hide");
      this.$("#submitting").modal("show");
      this.$axios.post("/strain/update",post).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("save_success"));
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    showEditStrain : function (key){
      this.strainId = key;
      this.$("#editStrainModal").modal("show");
    },
    deleteAllStrain : function (){
      this.delStrainByIds(this.selectedRowKeys);
    },
    delStrainById : function (id){
      var ids = [id];
      this.delStrainByIds(ids);
    },
    delStrainByIds : function (ids){
      var postData = {
        ids : ids
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/stock/delStrains",postData).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("save_success"));
          _this.initPage();
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
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
    initPage : function (){
      var _this = this;
      this.initColumns();
      var postData = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      this.tableLoad = true;
      this.$axios.post(
          "/stock/allStrain", postData
      ).then(function (res) {
        console.log(res);
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.strains = res.data.retMap.strains;
          _this.data = new Array();
          if (_this.strains.length > 0){
            for (var i = 0;i < _this.strains.length;i++){
              _this.strains[i].key = _this.strains[i].id;
              _this.data.push(_this.strains[i]);
            }
          }
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
          // _this.total = res.data.retMap.totalnumber;
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initColumns : function (){
      var cols = new Array();
      cols.push({
        title: "编号",
        dataIndex: 'selfindex',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'selfindex',
        },
        onFilter: (value, record) =>
            record.selfindex
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
        title: "stock id",
        dataIndex: 'stockId',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'stockId',
        },
        onFilter: (value, record) =>
            record.stockId
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
        dataIndex: 'genotype',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'genotype',
        },
        onFilter: (value, record) =>
            record.genotype
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
        dataIndex: 'resource',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'resource',
        },
        onFilter: (value, record) =>
            record.resource
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
      if (this.$store.getters.isFeeder){
        cols.push({
          title: "操作",
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        });
      }
      this.columns = cols;
      this.columnNames = new Array();
      for (var item in cols){
        this.columnNames.push(cols[item].dataIndex);
      }
    },
    showAdd: function () {
      this.$("#addNewStrain").modal("show");
      // this.$router.push("/personal/enterAnimalStock");
    },
    submitData: function (data) {
      this.$("#submitting").modal("show");
      var _this = this;
      this.$axios.post("/stock/add",
          data
      ).then(function (res) {
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("save_success"));
        }
      }).catch(function (res) {
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
  },
  computed : {
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

</style>