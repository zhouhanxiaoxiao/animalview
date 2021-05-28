<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :ghost="false"
        :title="$t('menuConfig')"
    >
      <template slot="extra">
        <a-button type="primary" @click="showNewModal">
          {{ $t("add") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="selects"
             bordered
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
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text,record,index"
      >
        <div :key="col">
          <div v-if="col === 'index'">
            {{ index + 1 }}
          </div>
          <div v-else-if="col === 'selecttype'">
            {{ $t("select." + record.selecttype) }}
          </div>
<!--          <a-input v-else-if="col === 'sampleflag'" v-model="record.sampleflag"></a-input>-->
          <a-select style="width: 100%" v-else-if="col === 'parentid'"
                    @change="updateSelect(record)"
                    v-model="record.parentid"
          >
            <a-select-option v-for="item in selects" :key="item.key" :value="item.key">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-switch @change="updateSelect(record)" default-checked v-model="record.useflag" v-else-if="col === 'useflag'"/>
          <div v-else>
            {{ text }}
          </div>
        </div>
      </template>
    </a-table>

    <a-modal v-model="visible" :title="$t('add')" @ok="submitNewSelect">
      <div class="form-group row">
        <label for="selectName" class="col-sm-3 col-form-label">{{ $t("select.name") }}</label>
        <div class="col-sm-9">
          <a-input id="selectName" v-model="newSelect.name"/>
        </div>
      </div>
      <div class="form-group row">
        <label for="selectType" class="col-sm-3 col-form-label">{{ $t("select.selecttype") }}</label>
        <div class="col-sm-9">
          <a-select id="selectType" style="width: 100%" v-model="newSelect.selectType">
            <a-select-option v-for="item in selectTypes" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="form-group row">
        <label for="parentId" class="col-sm-3 col-form-label">{{ $t("select.parentid") }}</label>
        <div class="col-sm-9">
          <a-select id="parentId" style="width: 100%" v-model="newSelect.parentId">
            <a-select-option v-for="item in selects" :key="item.key" :value="item.key">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </a-modal>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
  </div>
</template>

<script>

import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";

export default {
  name: "selectConfig",
  components: {Submitting},
  data: function () {
    return {
      tableLoad: false,
      selects: [],
      columns: [],
      columnNames: [],
      visible: false,
      newSelect: {
        name: "",
        selectType: "",
        parentId: ""
      }
    }
  },
  mounted() {
    this.initPage();
  },
  methods: {
    updateSelect : function (record){
      var postData = {
        selStr : JSON.stringify(record)
      }
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("/personal/updateSel", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.initPage();
        }
      }).catch(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    submitNewSelect: function () {

      if (util.isNull(this.newSelect.name)) {
        this.$message.error(this.$t("select.name") + this.$t("not_null"))
        return;
      }
      if (util.isNull(this.newSelect.selectType)) {
        this.$message.error(this.$t("select.selecttype") + this.$t("not_null"))
        return;
      }

      this.$(this.$refs.submitting.$el).modal("show");
      this.visible = false;
      var postData = {
        selStr: JSON.stringify(this.newSelect)
      }
      var _this = this;
      this.$axios.post("/personal/addNewSelect", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.initPage();
        }
      }).catch(function (res) {
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
    showNewModal: function () {
      this.visible = true;
    },
    initPage: function () {
      this.initCols();
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/personal/getSelects").then(function (res) {
        _this.tableLoad = false;
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.selects = new Array();
          _this.selects = res.data.retMap.selects;
          _this.selects.map(item => item.key = item.id);
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols: function () {
      var clom = new Array();

      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });

      /**下拉归属*/
      clom.push({
        title: this.$t("select.selecttype"),
        dataIndex: 'selecttype',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'selecttype'
        },
        onFilter: (value, record) =>
            record.selecttype
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

      /**收费项目*/
      clom.push({
        title: this.$t("select.name"),
        dataIndex: 'name',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'name'
        },
        onFilter: (value, record) =>
            record.name
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

      /**父级选项*/
      clom.push({
        title: this.$t("select.parentid"),
        dataIndex: 'parentid',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'parentid'
        },
        onFilter: (value, record) =>
            record.parentid
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

      /**样本标记*/
      clom.push({
        title: this.$t("select.sampleflag"),
        dataIndex: 'sampleflag',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sampleflag'
        },
        onFilter: (value, record) =>
            record.sampleflag
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

      /**是否使用*/
      clom.push({
        title: this.$t("select.useflag"),
        dataIndex: 'useflag',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'useflag'
        },
        onFilter: (value, record) =>
            record.useflag
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

      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    }
  },
  computed: {
    selectTypes: function () {
      var types = new Array();
      var retList = new Array();
      this.selects.map(item => {
        if (types.indexOf(item.selecttype) === -1) {
          types.push(item.selecttype);
          retList.push({
            key: item.selecttype,
            val: this.$t("select." + item.selecttype)
          });
        }
      })
      return retList;
    }
  }
}
</script>

<style scoped>

</style>