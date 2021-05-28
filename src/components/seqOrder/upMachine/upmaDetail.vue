<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
          :sub-title=" '共' + seqGroup.totalsample + '条样本，总计数据量：' + seqGroup.totalsize"
          @back="gotoBack"
      >
        <template slot="title">
          {{ seqGroup.name }}
        </template>
        <template slot="extra">

          <a-button v-if="notComplete && currentPage !== 'all' && currentPage !== 'notDivide'"
                    @click="rollbackSub">{{ $t("seqwait.rollbackSub") }}
          </a-button>

          <a-popconfirm
              style="margin-left: 5px"
              :disabled="selectedRows.length === 0"
              v-if="notComplete"
              placement="topRight"
              :title="$t('seqwait.rollbackTip')"
              ok-text="Yes"
              cancel-text="No"
              @confirm="rollbackSelects"
          >
            <a-button :disabled="selectedRows.length === 0">{{ $t("rollback") }}
            </a-button>
          </a-popconfirm>


          <a-button type="primary" :disabled="selectedRows.length === 0" v-if="notComplete"
                    @click="saveUpmachine">{{ $t("save") }}
          </a-button>

          <a-button type="danger" @click="completeUpma" v-if="notComplete">
            {{ $t("seqwait.completeUp") }}
          </a-button>

          <a-upload
              v-if="notComplete"
              name="file"
              accept=".xls,.xlsx"
              :show-upload-list="false"
              :headers="{token:this.$cookies.get('token')}"
              @change="handleUploadChange"
              :action="this.$axios.defaults.baseURL + '/file/import/upmaDetailImport'"
          >
            <a-button>
              <a-icon type="upload"/>
              {{ $t("input") }}
            </a-button>
          </a-upload>

          <a-button icon="download" @click="downLoad" :disabled="this.selectedRowKeys.length == 0">
            {{ $t("outPut") }}
          </a-button>

          <a-tag color="#87d068" v-if="!notComplete">
            {{ $t("seqwait.completeUp") }}
          </a-tag>
        </template>
        <a-row type="flex">

          <a-tag color="purple" style="cursor:pointer;" @click="switchPage('all')">
            {{ $t("seqwait.all") }}
            <a-icon type="check-circle" v-if="currentPage === 'all'"/>
          </a-tag>

          <a-tag color="#108ee9" v-for="item in subs" :key="item.id" style="cursor:pointer;"
                 @click="switchPage(item.id)">
            {{ item.name }}
            <a-icon type="check-circle" v-if="currentPage === item.id"/>
          </a-tag>

          <a-tag color="#f50" style="cursor:pointer;" @click="switchPage('notDivide')">
            {{ $t("seqwait.notDivide") }}
            <a-icon type="check-circle" v-if="currentPage === 'notDivide'"/>
          </a-tag>

        </a-row>
      </a-page-header>

      <a-table :columns="columns"
               :data-source="upmachines"
               bordered
               :loading="tableLoad"
               :row-selection="rowSelection"
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

            <a-date-picker v-else-if="col == 'uploaddate'"
                           format="YYYY-MM-DD"
                           v-model="record.uploaddate"
                           :disabled="!notComplete"
            />

            <a-input v-else-if="col === 'follcell' || col === 'lane'" v-model="record[col]" :disabled="!notComplete"/>

            <a-switch v-else-if="col === 'order.isbalance'"
                      :checked-children="$t('yes')"
                      :un-checked-children="$t('no')"
                      v-model="record[col]"
                      :disabled="true"
            />
            <div v-else>
              {{ text }}
            </div>
          </div>
        </template>

        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a-button type="primary" size="small" @click="saveRecord(record)" :disabled="!notComplete"
              >{{ $t("save") }}</a-button>

              <a-popconfirm
                  style="margin-left: 5px"
                  :disabled="!notComplete"
                  placement="topRight"
                  :title="$t('seqwait.rollbackTip')"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="rollback(record)"
              >
                <a-button size="small" :disabled="!notComplete">{{ $t("rollback") }}</a-button>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </a-table>
    </div>
    <submitting ref="submitting" :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
import Submitting from "@/components/publib/submitting";

export default {
  name: "upmaDetail",
  components: {Submitting, TopNav},
  data: function () {
    return {
      seqGroupId: "",
      seqGroup: {},
      subs: [],
      currentPage: "all",

      columns: [],
      upmachines: [],
      tableLoad: false,
      selectedRowKeys: [],
      selectedRows: [],
      scroll: {x: 1500},
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
  methods: {
    showLoading: function () {
      this.$(this.$refs.submitting.$el).modal("show");
    },
    hideLoading: function () {
      this.$(this.$refs.submitting.$el).modal("hide");
    },
    switchPage: function (flag) {
      this.currentPage = flag;
      this.initPage();
    },
    rollbackSub: function () {
      var postData = {
        currentPage: this.currentPage
      }
      var _this = this;
      this.showLoading();
      this.$axios.post("/seqwait/rollbackSub", postData).then(function (res) {
        _this.hideLoading();
        if (res.data.code === util.SUCCESS) {
          _this.initPage();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        _this.hideLoading();
        util.catchErr(res);
      })
    },
    handleUploadChange: function (ret) {
      if (ret.file.status == "done") {
        this.$message.success(this.$t("upload") + this.$t("save_success"));
        this.initPage();
      } else if (ret.file.status == "error") {
        this.$message.error(this.$t("systemErr"));
      }
    },
    downLoad: function () {
      var postData = {
        ids: JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/upmaDetail/download", this.seqGroup.name + ".xls");
    },
    completeUpma: function () {
      var post = {
        seqGroupId: this.seqGroupId
      }
      var _this = this;
      this.$axios.post("/seqGroup/complete", post).then(function (res) {
        if (res.data.code === util.SUCCESS) {
          _this.initPage();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        util.catchErr(res);
      })
    },
    gotoBack: function () {
      this.$router.push("/seqwait/upmac");
    },
    rollback: function (record) {
      this.selectedRows = new Array();
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.selectedRows.push(record);
      this.rollbackSelects();
    },
    rollbackSelects: function () {
      var post = {
        ups: JSON.stringify(this.selectedRows)
      };
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/upma/rollback", post).then(function (res) {
        if (res.data.code === util.SUCCESS) {
          _this.tableLoad = false;
          _this.initPage();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        util.catchErr(res);
      });
    },
    saveRecord: function (record) {
      this.selectedRows = new Array();
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.selectedRows.push(record);
      this.saveUpmachine();
    },
    saveUpmachine: function () {
      var post = {
        ups: JSON.stringify(this.selectedRows)
      };
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/upma/update", post).then(function (res) {
        if (res.data.code === util.SUCCESS) {
          _this.tableLoad = false;
          _this.initPage();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        util.catchErr(res);
      });
    },
    initPage: function () {
      this.initCols();
      if (this.seqGroupId === "") {
        return;
      }
      var postData = {
        seqGroupId: this.seqGroupId,
        currentPage: this.currentPage
      }
      var _this = this;
      this.tableLoad = true;
      _this.upmachines = new Array();
      this.$axios.post("/upmaDetail/init", postData).then(function (res) {
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS) {
          if (res.data.retMap.list.length > 0) {
            res.data.retMap.list.map(item => {
              item.key = item.id;
              item.order.checkdate = formatDate(new Date(item.order.checkdate), "yyyy-MM-dd");
              item.uploaddate = formatDate(new Date(item.uploaddate), "yyyy-MM-dd");
              _this.upmachines.push(item);
            });
          }
          _this.seqGroup = res.data.retMap.seqGroup;
          _this.subs = res.data.retMap.subs;
          _this.selectedRowKeys = new Array();
          _this.selectedRows = new Array();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        util.catchErr(res);
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

    initCols: function () {

      var scorllLength = 0;
      var clom = new Array();

      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '80px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });
      scorllLength += 80;

      /**检测日期*/
      clom.push({
        title: this.$t("seqwait.follcell"),
        dataIndex: 'follcell',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'follcell'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.follcell)) {
            return false;
          }
          return record.follcell
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
        sorter: (a, b) => util.sorter(a.follcell, b.follcell),
      });
      scorllLength += 150;

      /**lane编号*/
      clom.push({
        title: this.$t("seqwait.lane"),
        dataIndex: 'lane',
        width: '150px',
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
      scorllLength += 150;

      /**检测日期*/
      clom.push({
        title: this.$t("seqwait.checkdate"),
        dataIndex: 'order.checkdate',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.checkdate'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.checkdate)) {
            return false;
          }
          return record.order.checkdate
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
        sorter: (a, b) => util.sorter(a.order.checkdate, b.order.checkdate),
      });
      scorllLength += 150;

      /**项目名称*/
      clom.push({
        title: this.$t("seqwait.projectname"),
        dataIndex: 'order.projectname',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.projectname'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.projectname)) {
            return false;
          }
          return record.order.projectname
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
        sorter: (a, b) => util.sorter(a.order.projectname, b.order.projectname),
      });
      scorllLength += 150;

      /**样本名称*/
      clom.push({
        title: this.$t("seqwait.samplename"),
        dataIndex: 'order.samplename',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.samplename'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.samplename)) {
            return false;
          }
          return record.order.samplename
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
        sorter: (a, b) => util.sorter(a.order.samplename, b.order.samplename),
      });
      scorllLength += 150;

      /**样本编号*/
      clom.push({
        title: this.$t("seqwait.sampleindex"),
        dataIndex: 'order.sampleindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.sampleindex'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.sampleindex)) {
            return false;
          }
          return record.order.sampleindex
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
        sorter: (a, b) => util.sorter(a.order.sampleindex, b.order.sampleindex),
      });
      scorllLength += 150;

      /**文库类型*/
      clom.push({
        title: this.$t("seqwait.libtype"),
        dataIndex: 'order.libtype',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.libtype'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.libtype)) {
            return false;
          }
          return record.order.libtype
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
        sorter: (a, b) => util.sorter(a.order.libtype, b.order.libtype),
      });
      scorllLength += 150;

      /**文库编号*/
      clom.push({
        title: this.$t("seqwait.libindex"),
        dataIndex: 'order.libindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.libindex'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.libindex)) {
            return false;
          }
          return record.order.libindex
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
        sorter: (a, b) => util.sorter(a.order.libindex, b.order.libindex),
      });
      scorllLength += 150;

      /**物种*/
      clom.push({
        title: this.$t("seqwait.species"),
        dataIndex: 'order.species',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.species'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.species)) {
            return false;
          }
          return record.order.species
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
        sorter: (a, b) => util.sorter(a.order.species, b.order.species),
      });
      scorllLength += 150;

      /**物种*/
      clom.push({
        title: this.$t("seqwait.mixmethod"),
        dataIndex: 'order.mixmethod',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.mixmethod'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.mixmethod)) {
            return false;
          }
          return record.order.mixmethod
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
        sorter: (a, b) => util.sorter(a.order.mixmethod, b.order.mixmethod),
      });
      scorllLength += 150;

      /**排机日期*/
      clom.push({
        title: this.$t("seqwait.uploaddate"),
        dataIndex: 'uploaddate',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'uploaddate'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.uploaddate)) {
            return false;
          }
          return record.uploaddate
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
        sorter: (a, b) => util.sorter(a.uploaddate, b.uploaddate),
      });
      scorllLength += 150;

      /**index编号*/
      clom.push({
        title: this.$t("seqwait.indexnum"),
        dataIndex: 'order.indexnum',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.indexnum'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.indexnum)) {
            return false;
          }
          return record.order.indexnum
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
        sorter: (a, b) => util.sorter(a.order.indexnum, b.order.indexnum),
      });
      scorllLength += 150;

      /**项目名称*/
      clom.push({
        title: this.$t("seqwait.indexseq"),
        dataIndex: 'order.indexseq',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.indexseq'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.indexseq)) {
            return false;
          }
          return record.order.indexseq
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
        sorter: (a, b) => util.sorter(a.order.indexseq, b.order.indexseq),
      });
      scorllLength += 150;

      /**ds Qubit浓度（ng/ul）*/
      clom.push({
        title: this.$t("seqwait.qubit"),
        dataIndex: 'order.qubit',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.qubit'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.qubit)) {
            return false;
          }
          return record.order.qubit
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
        sorter: (a, b) => util.sorter(a.order.qubit, b.order.qubit),
      });
      scorllLength += 200;

      /**ssDNA Qubit浓度（ng/ul）*/
      clom.push({
        title: this.$t("seqwait.ssdnaqubit"),
        dataIndex: 'order.ssdnaqubit',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.ssdnaqubit'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.ssdnaqubit)) {
            return false;
          }
          return record.order.ssdnaqubit
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
        sorter: (a, b) => util.sorter(a.order.ssdnaqubit, b.order.ssdnaqubit),
      });
      scorllLength += 200;

      /**order.dnb浓度（ng/ul）*/
      clom.push({
        title: this.$t("seqwait.dnb"),
        dataIndex: 'order.dnb',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.dnb'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.dnb)) {
            return false;
          }
          return record.order.dnb
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
        sorter: (a, b) => util.sorter(a.order.dnb, b.order.dnb),
      });
      scorllLength += 200;

      /**ds DNA加样体积（ul）*/
      clom.push({
        title: this.$t("seqwait.dsdna"),
        dataIndex: 'order.dsdna',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.dsdna'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.dsdna)) {
            return false;
          }
          return record.order.dsdna
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
        sorter: (a, b) => util.sorter(a.order.dsdna, b.order.dsdna),
      });
      scorllLength += 200;

      /**ssDNA 加样体积（ul）*/
      clom.push({
        title: this.$t("seqwait.ssdna"),
        dataIndex: 'order.ssdna',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.ssdna'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.ssdna)) {
            return false;
          }
          return record.order.ssdna
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
        sorter: (a, b) => util.sorter(a.order.ssdna, b.order.ssdna),
      });
      scorllLength += 200;

      /**order.dnb加样体积（ul）*/
      clom.push({
        title: this.$t("seqwait.addvol"),
        dataIndex: 'order.addvol',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.addvol'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.addvol)) {
            return false;
          }
          return record.order.addvol
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
        sorter: (a, b) => util.sorter(a.order.addvol, b.order.addvol),
      });
      scorllLength += 200;

      /**Peak size(bp)*/
      clom.push({
        title: this.$t("seqwait.peaksize"),
        dataIndex: 'order.peaksize',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.peaksize'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.peaksize)) {
            return false;
          }
          return record.order.peaksize
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
        sorter: (a, b) => util.sorter(a.order.peaksize, b.order.peaksize),
      });
      scorllLength += 150;

      /**峰图描述*/
      clom.push({
        title: this.$t("seqwait.eledesc"),
        dataIndex: 'order.eledesc',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.eledesc'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.eledesc)) {
            return false;
          }
          return record.order.eledesc
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
        sorter: (a, b) => util.sorter(a.order.eledesc, b.order.eledesc),
      });
      scorllLength += 150;

      /**库检综合结果*/
      clom.push({
        title: this.$t("seqwait.checkresult"),
        dataIndex: 'order.checkresult',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.checkresult'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.checkresult)) {
            return false;
          }
          return record.order.checkresult
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
        sorter: (a, b) => util.sorter(a.order.checkresult, b.order.checkresult),
      });
      scorllLength += 150;

      /**项目数据量*/
      clom.push({
        title: this.$t("seqwait.projectdatanum"),
        dataIndex: 'order.projectdatanum',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.projectdatanum'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.projectdatanum)) {
            return false;
          }
          return record.order.projectdatanum
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
        sorter: (a, b) => util.sorter(a.order.projectdatanum, b.order.projectdatanum),
      });
      scorllLength += 150;

      /**数据量单位*/
      clom.push({
        title: this.$t("seqwait.dataunit"),
        dataIndex: 'order.dataunit',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.dataunit'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.dataunit)) {
            return false;
          }
          return record.order.dataunit
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
        sorter: (a, b) => util.sorter(a.order.dataunit, b.order.dataunit),
      });
      scorllLength += 150;

      /**上机备注*/
      clom.push({
        title: this.$t("seqwait.uploadremark"),
        dataIndex: 'order.uploadremark',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.uploadremark'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.uploadremark)) {
            return false;
          }
          return record.order.uploadremark
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
        sorter: (a, b) => util.sorter(a.order.uploadremark, b.order.uploadremark),
      });
      scorllLength += 150;

      /**项目负责人*/
      clom.push({
        title: this.$t("seqwait.projectuser"),
        dataIndex: 'order.projectuser',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.projectuser'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.projectuser)) {
            return false;
          }
          return record.order.projectuser
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
        sorter: (a, b) => util.sorter(a.order.projectuser, b.order.projectuser),
      });
      scorllLength += 150;

      // /**加测备注*/
      // clom.push({
      //   title: this.$t("seqwait.addseqremark"),
      //   dataIndex: 'order.addseqremark',
      //   width: '150px',
      //   scopedSlots: {
      //     filterDropdown: 'filterDropdown',
      //     filterIcon: 'filterIcon',
      //     customRender: 'order.addseqremark'
      //   },
      //   onFilter: (value, record) => {
      //     if (util.isNull(record.order.addseqremark)) {
      //       return false;
      //     }
      //     return record.order.addseqremark
      //         .toString()
      //         .toLowerCase()
      //         .includes(value.toLowerCase());
      //   },
      //   onFilterDropdownVisibleChange: visible => {
      //     if (visible) {
      //       setTimeout(() => {
      //         this.searchInput.focus();
      //       }, 0);
      //     }
      //   },
      //   sorter: (a, b) => util.sorter(a.order.addseqremark, b.order.addseqremark),
      // });
      // scorllLength += 150;

      /**是否平衡文库*/
      clom.push({
        title: this.$t("seqwait.isbalance"),
        dataIndex: 'order.isbalance',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'order.isbalance'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.order.isbalance)) {
            return false;
          }
          return record.order.isbalance
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
        sorter: (a, b) => util.sorter(a.order.isbalance, b.order.isbalance),
      });
      scorllLength += 150;

      // /**是否可拆分*/
      // clom.push({
      //   title: this.$t("seqwait.candivide"),
      //   dataIndex: 'candivide',
      //   width: '150px',
      //   scopedSlots: {
      //     filterDropdown: 'filterDropdown',
      //     filterIcon: 'filterIcon',
      //     customRender: 'candivide'
      //   },
      //   onFilter: (value, record) => {
      //     if (util.isNull(record.candivide)) {
      //       return false;
      //     }
      //     return record.candivide
      //         .toString()
      //         .toLowerCase()
      //         .includes(value.toLowerCase());
      //   },
      //   onFilterDropdownVisibleChange: visible => {
      //     if (visible) {
      //       setTimeout(() => {
      //         this.searchInput.focus();
      //       }, 0);
      //     }
      //   },
      //   sorter: (a, b) => util.sorter(a.candivide, b.candivide),
      // });
      // scorllLength += 150;

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
  },
  watch: {
    getSeqGroupId(newVal) {
      this.seqGroupId = newVal;
      this.initPage();
    }
  },
  computed: {
    getSeqGroupId: function () {
      return this.$route.query.seqGroupId;
    },
    rowSelection() {
      const {selectedRowKeys, selectedRows} = this;
      return {
        selectedRowKeys: selectedRowKeys,
        selectedRows: selectedRows,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
      };
    },
    notComplete() {
      return this.seqGroup.curstatu === "00";
    }
  }
}
</script>

<style scoped>

</style>