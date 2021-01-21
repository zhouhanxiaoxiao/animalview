<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('userManager')"
    >
      <template slot="extra">
<!--        <a-button type="primary" @click="newDepartment">-->
<!--          {{ $t("newDepartment") }}-->
<!--        </a-button>-->
        <a-button type="primary" @click="addNewRole">
          {{ $t("newRole") }}
        </a-button>
        <a-button type="primary" @click="updateUsers" :disabled="this.selectedRows.length == 0">
          {{ $t("update") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="allUsers" bordered
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
          slot-scope="text, record, index"
      >
        <div :key="col">
          <a-select
              mode="multiple"
              style="width: 200px"
              v-model="record.rolesIds"
              v-if="col == 'roles'"
              @change="consoleValue(record.rolesIds)"
          >
            <a-select-option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.rolename }}
            </a-select-option>
          </a-select>
          <a-select v-else-if="col == 'group.groupname'"
                    v-model="record.roleid"
                    style="width: 100%">
            <a-select-option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.groupname }}
            </a-select-option>
          </a-select>
          <template v-else>
            {{ showText(col, text, index) }}
          </template>
        </div>
      </template>
    </a-table>
    <new-department ref="newDep" :users="allUsers" @submitDepart="submitDepart"></new-department>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
    <new-role ref="newRole" @sumintNewRole="sumintNewRole"></new-role>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import NewDepartment from "@/components/personal/newDepartment";
import Submitting from "@/components/publib/submitting";
import NewRole from "@/components/personal/newRole";

export default {
  name: "userManager",
  components: {NewRole, Submitting, NewDepartment},
  data : function (){
    return {
      tableLoad: false,
      data: [],
      selectedRowKeys : [],
      selectedRows : [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      editingKey: '',
      allUsers: [],
      roles : [],
      groups : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    addNewRole : function (){
      this.$(this.$refs.newRole.$el).modal("show");
    },
    sumintNewRole : function(role){
      this.$(this.$refs.newRole.$el).modal("hide");
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("/user/manager/addNewRole",role).then(function (res){
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
    updateUsers : function (){
      if (this.selectedRows.length == 0){
        return ;
      }
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      var postData = {
        users : JSON.stringify(this.selectedRows)
      }
      this.$axios.post("/user/manager/updateUsers", postData).then(function (res){
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
    newDepartment : function(){
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
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    consoleValue : function (record){
      console.log(record);
    },
    getRoleIds : function (roles){
      var roleIds = new Array();
      roles.map(role=>roleIds.push(role.id));
      return roleIds;
    },
    initPage : function (){
      this.initColumns();
      var _this = this;
      this.$axios.post("/user/manager/init").then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.allUsers = res.data.retMap.users;
          _this.roles = res.data.retMap.roles;
          _this.groups = res.data.retMap.groups;
          _this.allUsers.map(user=>user.key=user.id);
          _this.selectedRowKeys = new Array();
          _this.selectedRows = new Array();
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initColumns : function (){
      var clom = new Array();
      /**用户名*/
      clom.push({
        title: this.$t("userName"),
        dataIndex: 'name',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'name'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.name)){
            return false;
          }
          return record.name
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
        sorter: (a, b) => util.sorter(a.name,b.name),
      });

      /**邮箱*/
      clom.push({
        title: this.$t("userEmail"),
        dataIndex: 'email',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'email'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.email)){
            return false;
          }
          return record.email
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
        sorter: (a, b) => util.sorter(a.email,b.email),
      });

      /**角色*/
      clom.push({
        title: this.$t("role"),
        dataIndex: 'roles',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'roles'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.roles)){
            return false;
          }
          for (var i = 0;i< record.roles.length; i++){
            var role = record.roles[i];
            if (role.rolename.toString()
                .toLowerCase()
                .includes(value.toLowerCase())){
              return true
            }
          }
          return false;
        },
        onFilterDropdownVisibleChange: visible => {
          if (visible) {
            setTimeout(() => {
              this.searchInput.focus();
            }, 0);
          }
        },
      });

      /**组别*/
      clom.push({
        title: this.$t("department"),
        dataIndex: 'group.groupname',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'group.groupname'
        },
        onFilter: (value, record) =>{
          if (util.isNull(record.group.groupname)){
            return false;
          }
          return record.group.groupname
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
        sorter: (a, b) => util.sorter(a.group.groupname,b.group.groupname),
      });
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom){
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    showText : function (col, text, index){
      console.log(col, text, index);
      return text;
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