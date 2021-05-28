<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          :title="$t('qualityControl')"
          :sub-title="seqGroup.name"
      >
        <template slot="extra">

        </template>

        <a-row type="flex">

        </a-row>
      </a-page-header>

      <a-table :columns="columns"
               :data-source="reports"
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
              :placeholder="`Search ${column.dataIndex}`"
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
            Search
          </a-button>
          <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
            Reset
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
            <div v-if="col === 'index'">
              {{ index + 1 }}
            </div>
            <div v-else>
              {{ text }}
            </div>
          </div>
        </template>

      </a-table>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import util from "@/components/publib/util";
export default {
  name: "seqReport",
  components: {TopNav},
  data : function (){
    return {
      seqGroup : {},
      seqGroupId : "",

      reports : [],
      columns: [],
      tableLoad: false,
      columnNames: [],
      searchText: '',
      searchInput: null,
      searchedColumn: '',
    }
  },
  beforeMount() {
    this.seqGroupId = this.$route.query.seqGroupId;
    this.initPage();
  },
  methods : {
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },

    initPage : function () {
      this.initCols();
      if (util.isNull(this.seqGroupId)){
        return;
      }
      var postData = {
        seqGroupId : this.seqGroupId
      }
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/seqwait/report", postData).then(function (res){
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS){
          _this.reports = new Array();
          if (res.data.retMap.reports.length > 0){
            res.data.retMap.reports.map(item => {
              item.key = item.id;
              _this.reports.push(item);
            })
          }
          _this.seqGroup = res.data.retMap.seqGroup;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.tableLoad = false;
        util.catchErr(res)
      });
    },
    initCols : function (){
      var clom = new Array();

      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });

      /**sample*/
      clom.push({
        title: this.$t("seqwait.sample"),
        dataIndex: 'sample',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sample'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.sample)) {
            return false;
          }
          return record.sample
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
        sorter: (a, b) => util.sorter(a.sample, b.sample),
      });

      /**filename*/
      clom.push({
        title: this.$t("seqwait.filename"),
        dataIndex: 'filename',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'filename'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.filename)) {
            return false;
          }
          return record.filename
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
        sorter: (a, b) => util.sorter(a.filename, b.filename),
      });


      /**lane*/
      clom.push({
        title: this.$t("seqwait.lane"),
        dataIndex: 'lane',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'lane'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.lane)) {
            return false;
          }
          return record.lane
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
        sorter: (a, b) => util.sorter(a.lane, b.lane),
      });

      /**barcode*/
      clom.push({
        title: this.$t("seqwait.barcode"),
        dataIndex: 'barcode',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'barcode'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.barcode)) {
            return false;
          }
          return record.barcode
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
        sorter: (a, b) => util.sorter(a.barcode, b.barcode),
      });

      /**长度*/
      clom.push({
        title: this.$t("seqwait.readlength"),
        dataIndex: 'readlength',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'readlength'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.readlength)) {
            return false;
          }
          return record.readlength
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
        sorter: (a, b) => util.sorter(a.readlength, b.readlength),
      });

      /**rawdata*/
      clom.push({
        title: this.$t("seqwait.rawdata"),
        dataIndex: 'rawdata',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'rawdata'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.rawdata)) {
            return false;
          }
          return record.rawdata
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
        sorter: (a, b) => util.sorter(a.rawdata, b.rawdata),
      });

      /**cleandata*/
      clom.push({
        title: this.$t("seqwait.cleandata"),
        dataIndex: 'cleandata',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'cleandata'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.cleandata)) {
            return false;
          }
          return record.cleandata
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
        sorter: (a, b) => util.sorter(a.cleandata, b.cleandata),
      });

      /**q20*/
      clom.push({
        title: this.$t("seqwait.q20"),
        dataIndex: 'q20',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'q20'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.q20)) {
            return false;
          }
          return record.q20
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
        sorter: (a, b) => util.sorter(a.q20, b.q20),
      });

      /**q30*/
      clom.push({
        title: this.$t("seqwait.q30"),
        dataIndex: 'q30',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'q30'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.q30)) {
            return false;
          }
          return record.q30
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
        sorter: (a, b) => util.sorter(a.q30, b.q30),
      });

      /**mappingrate*/
      clom.push({
        title: this.$t("seqwait.mappingrate"),
        dataIndex: 'mappingrate',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'mappingrate'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.mappingrate)) {
            return false;
          }
          return record.mappingrate
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
        sorter: (a, b) => util.sorter(a.mappingrate, b.mappingrate),
      });

      /**检测日期*/
      clom.push({
        title: this.$t("seqwait.remark"),
        dataIndex: 'remark',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'remark'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.remark)) {
            return false;
          }
          return record.remark
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
        sorter: (a, b) => util.sorter(a.remark, b.remark),
      });

      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    }
  },
  watch : {
    getSeqGroupId(newVal){
      this.seqGroupId = newVal;
      this.initPage();
    }
  },
  computed : {
    getSeqGroupId: function () {
      return this.$route.query.seqGroupId;
    },
  }
}
</script>

<style scoped>

</style>