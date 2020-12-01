<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('departmentManager')"
    >
      <template slot="extra">
        <a-button type="primary" @click="showNewDep">
          {{ $t("newDepartment") }}
        </a-button>
        <a-button type="primary" :disabled="this.selectedRows.length == 0" @click="updateDepart">
          {{ $t("update") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="groups" bordered
             :loading="tableLoad"
             :row-selection="rowSelection"
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
          slot-scope="text,record"
      >
        <div :key="col">
          <div v-if="col == 'users'">
            <a-tag v-for="user in record.users" :key="user.id">
              {{ user.name }}
            </a-tag>
          </div>
          <a-select style="width: 100%" v-else-if="col == 'groupadmin'"
                    v-model="record.groupadmin"
          >
            <a-select-option v-for="item in allUsers" :key="item.id" :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <template v-else>
            {{ showtext(text) }}
          </template>
        </div>
      </template>
    </a-table>
    <new-department ref="newDep" :users="allUsers" @submitDepart="submitDepart"></new-department>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import NewDepartment from "@/components/personal/newDepartment";
import Submitting from "@/components/publib/submitting";

export default {
  name: "DepartmentManager",
  components: {Submitting, NewDepartment},
  data : function (){
    return {
      tableLoad: false,
      groups: [],
      selectedRowKeys : [],
      selectedRows : [],
      columns: [],
      columnNames: [],
      allUsers :[],
      scroll: {x: 1500},
    }
  },
  mounted() {
    this.initPage();
  },

  methods : {
    updateDepart : function (){
      var postData = {
        list : JSON.stringify(this.selectedRows)
      }
      util.commonPost("/personal/groups/updateDepartment",postData,this.initPage,this.$refs.submitting.$el);
    },
    showNewDep : function (){
      this.$(this.$refs.newDep.$el).modal("show");
    },
    submitDepart : function (group){
      this.$(this.$refs.newDep.$el).modal("hide");
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("/user/manager/addNewDepartment",group).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    preventDefault : function (){
      var _this = this;
      this.$confirm({
        title: _this.$t("confirmDelete"),
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          console.log('OK');
        },
        onCancel() {
          _this.initPage();
        },
      });
    },
    showtext : function (text){
      return text;
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
      this.initColumns();
      var _this = this;
      this.$axios.post("/personal/groups/init").then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.groups = res.data.retMap.groups;
          _this.allUsers = res.data.retMap.allUsers;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    initColumns : function (){
      var clom = new Array();
      /**部门名称*/
      clom.push({
        title: this.$t("departmentName"),
        dataIndex: 'groupname',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'groupname'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.groupname)){
            return false;
          }
          return record.groupname
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
      /**部门负责人*/
      clom.push({
        title: "部门负责人",
        dataIndex: 'groupadmin',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'groupadmin'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.admin.name)){
            return false;
          }
          return record.admin.name
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

      /**部门成员*/
      clom.push({
        title: "部门成员",
        dataIndex: 'users',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'users'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.users)){
            return false;
          }
          return record.users.length
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

      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom){
        this.columnNames.push(clom[item].dataIndex);
      }
    }
  },
  computed : {
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
      };
    },
  }
}
</script>

<style scoped>

</style>