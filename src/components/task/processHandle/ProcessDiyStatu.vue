<template>
  <div style="margin-bottom: 120px;margin-top: 20px">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('diyStatu')"
        :sub-title="process.projectname"
    >
      <template slot="extra">
        <a-button type="primary" @click="addNewRow">
          {{ $t("add") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="samples"
             bordered
             :scroll="scroll"
             :loading="tableLoad"
             :pagination="false"
             size="small">
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
          slot-scope="text, record"
      >
        <div :key="col">
          <a-input
              v-if="col == 'diyname'"
              style="width: 100%"
              v-model="record[col]"
          />
          <a-select
              style="width: 100%"
              v-if="col == 'diystatu'"
              v-model="record.diystatu"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0;"/>
              <div
                  style="padding: 4px 8px; cursor: pointer;"
                  @mousedown="e => e.preventDefault()"
                  @click="addItem"
              >
                <a-icon type="plus"/>
                {{$t("addNewStatu")}}
              </div>
            </div>
            <a-select-option v-for="sta in userDiyStatus" :key="sta.id" :value="sta.id">
              {{ sta.name }}
            </a-select-option>
          </a-select>
          <a-select
              mode="multiple"
              placeholder="Please select"
              style="width: 100%"
              v-if="col === 'inputs'"
              v-model="record.inputs"
          >
            <a-select-option v-for="item in inputs" :key="item.id" :value="item.id">
              {{ item.samplename + "-" + item.species + "-" + item.tissue }}
            </a-select-option>
          </a-select>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
            title="Sure to delete?"
            @confirm="() => onDelete(record)"
        >
          <a href="javascript:;">Delete</a>
        </a-popconfirm>
        &nbsp;
        <a href="javascript:;" @click="saveDiyStatu(record)">Save</a>
      </template>
    </a-table>
    <a-modal
        :title="$t('addNewStatu')"
        :visible="addNewStatu"
        @ok="handleOk"
        @cancel="()=>this.addNewStatu=false"
    >
      <a-input v-model="newStatu"/>
    </a-modal>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";

export default {
  name: "ProcessDiyStatu",
  components: {Submitting,VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },},
  props: {
    process: Object
  },
  beforeMount() {
    this.initPage();
  },
  data: function () {
    return {
      newStatu: "",
      addNewStatu: false,
      samples: [],
      tableLoad: false,
      searchText: '',
      scroll: {y: 500},
      searchedColumn: '',
      columns: [],
      columnNames: [],
      inputs: [],
      userDiyStatus: new Array()
    }
  },
  methods: {
    addItem: function () {
      this.addNewStatu = true;
    },
    handleOk: function () {
      if (util.isNull(this.newStatu)) {
        this.$message.error("请输入状态名称");
        return;
      }
      var flag = false;
      this.userDiyStatus.map(item => {if (item.name == this.newStatu){flag = true;}});
      if (flag){
        this.$message.error("状态已存在");
        return;
      }
      this.userDiyStatus.push({id: this.newStatu, name: this.newStatu});
      console.log(this.userDiyStatus)
      this.addNewStatu = false;
    },
    saveDiyStatu: function (record) {
      if (util.isNull(record.diyname)) {
        this.$message.error(this.$t("diySampleName") + this.$t("not_null"));
        return;
      }
      var postData = {
        diyStatu: JSON.stringify(record)
      }
      var _this = this;
      util.commonPost("/task/process/saveDiyStatu", postData, _this.initPage, this.$refs.submitting.$el);
    },
    onDelete: function (record) {
      var _this = this;
      if (record.key != record.id) {
        const dataSource = [...this.samples];
        this.samples = dataSource.filter(item => item.key !== record.key);
      } else {
        util.commonPost("/task/process/deleteDiyStatu",
            {id: record.id}, _this.initPage, this.$refs.submitting.$el);
      }
    },
    addNewRow: function () {
      var key = new Date().getDate();
      var newRow = {
        key: key,
        diyname: "",
        diystatu: "",
        inputs: new Array(),
        processid: this.process.id
      }
      this.samples.push(newRow);
    },
    initPage: function () {
      this.initColumns();
      var postData = {
        processId: this.process.id
      }
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/task/process/diyStatuInit", postData).then(function (res) {
        _this.tableLoad = false;
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          console.log(res);
          _this.samples = new Array();
          if (res.data.retMap.diys != undefined && res.data.retMap.diys.length > 0) {
            for (var i = 0; i < res.data.retMap.diys.length; i++) {
              var item = res.data.retMap.diys[i];
              item.key = item.id;
              _this.samples.push(item);
            }
          }
          _this.inputs = res.data.retMap.inputs;
          _this.userDiyStatus = new Array();
          if (res.data.retMap.userDiyStatus != undefined && res.data.retMap.userDiyStatus.length > 0) {
            res.data.retMap.userDiyStatus.map(item => {
              _this.userDiyStatus.push(item)
            });
          }
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
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
    initColumns: function () {
      var clom = new Array();
      /* 自定义样本名称 */
      clom.push({
        title: this.$t("diySampleName"),
        dataIndex: 'diyname',
        key: 'diyname',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'diyname',
        },
        onFilter: (value, record) =>
            record.diyname
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
        title: this.$t("diyStatu"),
        dataIndex: 'diystatu',
        key: 'diystatu',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'diystatu',
        },
        onFilter: (value, record) =>
            record.diystatu
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

      // 关联样本名称
      clom.push({
        title: this.$t("connect") + this.$t("sampleName"),
        dataIndex: 'inputs',
        key: 'inputs',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'inputs',
        },
        onFilter: (value, record) =>
            record.inputs
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

      /**操作*/
      clom.push({
        slots: {title: 'operationTitle'},
        // title: i18n.t("operation"),
        dataIndex: 'operation',
        width: '150px',
        fixed: 'right',
        scopedSlots: {customRender: 'operation'},
      });

      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    }
  },
  watch: {
    process: {
      handler: function () {
        this.initPage();
      },
      deep: true
    }
  },
}
</script>

<style scoped>

</style>