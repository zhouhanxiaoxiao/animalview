<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
      >
        <template slot="title">
          {{ $t('seqwait.menuName') }}
        </template>
        <template slot="extra">
          <a-button type="danger" @click="deleteGroup"
                    v-if="currentPage !== 'notDivide'"> {{ $t("seqwait.deleteSub") }} </a-button>

          <a-button type="primary" @click="selectSub"
                    v-if="currentPage !== 'notDivide'"> {{ $t("seqwait.selectSub") }} </a-button>

          <a-button type="primary" @click="removeGroup" v-if="currentPage !== 'notDivide'"
                    :disabled="this.selectedRows.length === 0"> {{ $t("seqwait.removeSub") }} </a-button>

          <a-button type="primary" @click="enterGroup" v-if="currentPage === 'notDivide'"
                    :disabled="this.selectedRows.length === 0"> {{ $t("seqwait.enterGroup") }} </a-button>

          <a-button type="primary" @click="selectedOrder" v-if="currentPage === 'notDivide'"
                    :disabled="this.selectedRows.length === 0"> {{ $t("seqwait.selected") }} </a-button>

          <a-button type="primary" @click="saveOrders"
                    :disabled="this.selectedRows.length === 0"> {{ $t("save") }} </a-button>

          <a-upload
              name="file"
              accept=".xls,.xlsx"
              :show-upload-list="false"
              :headers="{token:this.$cookies.get('token')}"
              @change="handleUploadChange"
              :action="this.$axios.defaults.baseURL + '/file/import/seqOrderImport'"
          >
            <a-button>
              <a-icon type="upload"/>
              {{ $t("input") }}
            </a-button>
          </a-upload>

          <a-button icon="download" @click="downLoad" :disabled="this.selectedRowKeys.length == 0">
            {{ $t("outPut") }}
          </a-button>
        </template>

        <a-row type="flex">
          <a-tag color="#f50" style="cursor:pointer;" @click="switchPage('notDivide')">
            {{ $t("seqwait.notDivide") }}
            <a-icon type="check-circle" v-if="currentPage === 'notDivide'" />
          </a-tag>

          <a-tag color="#108ee9" v-for="item in subs" :key="item.id" style="cursor:pointer;"
                 @click="switchPage(item.id)">
            {{ item.name }}
            <a-icon type="check-circle" v-if="currentPage === item.id" />
          </a-tag>
        </a-row>
      </a-page-header>

      <a-table :columns="columns"
               :data-source="orders"
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
<!--              <a-icon type="snippets" v-if="record.ordertype === '01'"/>-->
              <a-tag color="orange"  v-if="record.ordertype === '01'">
                {{ $t("seqwait.hasDivided") }}
              </a-tag>
            </div>
            <div v-else-if="col === 'checkdate'">
              {{ format(text) }}
            </div>
            <div v-else-if="col === 'libtype'">
              {{ selects[text] }}
            </div>
            <a-switch v-else-if="col === 'isbalance' || col === 'candivide'"
                      :checked-children="$t('yes')"
                      :un-checked-children="$t('no')"
                      v-model="record[col]"
                      :disabled="col === 'candivide'"
            />

            <div v-else-if="col === 'projectuser'">
              {{ users[text] }}
            </div>
            <a-date-picker v-else-if="col == 'waitdate'"
                           format="YYYY-MM-DD"
                           v-model="record.waitdate"/>
            <a-input v-else-if="isInput(col)" v-model="record[col]"/>
            <div v-else>
              {{ text }}
            </div>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a @click="intoPackage(record)" v-if="currentPage === 'notDivide'">{{ $t("seqwait.selected") }}</a>
              <a @click="removeSubItem(record)" v-if="currentPage !== 'notDivide'">{{ $t("seqwait.removeSub") }}</a>
              <a @click="saveOrder(record)">{{ $t("save") }}</a>
              <a v-if="record.candivide && record.ordertype !== '01'" @click="splitOrder(record)">{{ $t("seqwait.split") }}</a>
            </span>
          </div>
        </template>
      </a-table>
    </div>

    <a-modal
        :title="$t('seqwait.enterGroup')"
        :visible="showGroupFlag"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
      <a-select default-value="newGroup" style="width: 100%" v-model="subId">
        <a-select-option value="newGroup">
          {{$t("seqwait.newGroup")}}
        </a-select-option>
        <a-select-option v-for="item in subs" :value="item.id"  :key="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-input :placeholder="$t('seqwait.newGroupName')"
               style="margin: 10px 0px"
               v-model="newGroupName" v-if="subId === 'newGroup'"/>
    </a-modal>

    <order-car :selects="packages"
               :seq-groups="seqGroups"
               @reload="initPage"
               @submitList="submitOrders"></order-car>

    <split-alert :visible="showSplit"
                 @closeAlert="showSplit = false"
                 @submitSplit="submitSplit"
                 :order="currentRecord"></split-alert>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
import OrderCar from "@/components/seqOrder/orderCar";
import SplitAlert from "@/components/seqOrder/splitAlert";
import Submitting from "@/components/publib/submitting";

export default {
  name: "seqOrder",
  components: {Submitting, SplitAlert, OrderCar, TopNav},
  data: function () {
    return {
      // table 数据
      currentPage : "notDivide",
      columns: [],
      orders: [],
      tableLoad: false,
      selectedRowKeys: [],
      selectedRows: [],
      scroll: {x: 1500},
      columnNames: [],
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      // order 数据
      users: {},
      selects: {},
      packages : [],
      seqGroups : [],
      // 拆分数据
      showSplit : false,
      currentRecord : {},
      //分组数据
      showGroupFlag : false,
      confirmLoading : false,
      subId : "newGroup",
      subs : [],
      newGroupName : ""
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    selectSub : function (){
      var post = {
        subId : this.currentPage,
        status : "01"
      }
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/seqwait/selectSub", post).then(function (res){
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS){
          _this.currentPage = "notDivide";
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        this.tableLoad = false;
        util.catchErr(res);
      })
    },
    deleteGroup : function (){
      var post = {
        subId : this.currentPage
      }
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/seqwait/deleteSub", post).then(function (res){
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS){
          _this.currentPage = "notDivide";
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        this.tableLoad = false;
        util.catchErr(res);
      })
    },
    selectItem : function (record){
      this.selectedRows = new Array();
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.selectedRows.push(record);
    },
    removeSubItem : function (record){
      this.selectItem(record);
      this.removeGroup();
    },
    removeGroup : function (){
      var post = {
        orders : JSON.stringify(this.selectedRows)
      }
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/seqwait/removeSubGroup", post).then(function (res){
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS){
          _this.initPage();
        }else {
          util.error(res.data.code)
        }
      }).catch(function (res){
        _this.tableLoad = false;
        util.catchErr(res);
      })
    },
    switchPage : function (id){
      this.currentPage = id;
      this.initPage();
    },
    handleOk : function (){
      if ("newGroup" === this.subId && util.isNull(this.newGroupName)){
        util.error("seqwait.newGroupName");
        return;
      }
      this.confirmLoading = true;
      var post = {
        orders : JSON.stringify(this.selectedRows),
        subId : this.subId,
        groupName : this.newGroupName
      }
      var _this = this;
      this.$axios.post("/seqwait/enterSubGroup", post).then(function (res){
        _this.confirmLoading = false;
        if (res.data.code === util.SUCCESS){
          _this.showGroupFlag = false;
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.confirmLoading = false;
        util.catchErr(res);
      })
    },
    handleCancel : function (){
      this.showGroupFlag = false;
    },
    enterGroup : function (){
      this.showGroupFlag = true;
    },
    handleUploadChange : function (ret){
      if (ret.file.status == "done"){
        this.$message.success(this.$t("upload") + this.$t("save_success"));
        this.initPage();
      }else if (ret.file.status == "error"){
        this.$message.error(this.$t("systemErr"));
      }
    },
    downLoad : function (){
      var postData = {
        ids: JSON.stringify(this.selectedRowKeys)
      }
      util.downLoad(postData, "/seqOrder/download", "排机管理.xls");
    },
    saveOrder : function (record){
      this.selectItem(record)
      this.saveOrders();
    },
    saveOrders : function (){
      var post = {
        orders : JSON.stringify(this.selectedRows)
      }
      this.$axios.post("/order/updateRecords", post).then(function (res){
        if (res.data.code === util.SUCCESS){
          util.success();
        }else {
          util.error(res.data.code)
        }
      }).catch(function (res){
        util.catchErr(res);
      })
    },
    submitOrders : function (orders, upId, upName, totalNum){
      var postData = {
        orders : JSON.stringify(orders),
        upId : upId,
        upName : upName,
        totalNum : totalNum
      }
      this.$(this.$refs.submitting.$el).modal("show");
      var _this = this;
      this.$axios.post("/order/commitOrders", postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code === util.SUCCESS){
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        util.catchErr(res);
      })
    },
    submitSplit : function (nums){
      var postData = {
        order : JSON.stringify(this.currentRecord),
        nums : JSON.stringify(nums)
      }
      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/order/submitSplit",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code === util.SUCCESS){
          console.log(res);
          const tmpOrder = [..._this.orders];
          _this.orders = tmpOrder.filter(item => item.id !== _this.currentRecord.id);
          _this.orders = [..._this.orders,...res.data.retMap.splitOrders];
          _this.showSplit = false;
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        util.catchErr(res);
      })
    },
    splitOrder : function (record){
      this.showSplit = true;
      this.currentRecord = record;
    },
    selectedOrder : function (){
      // this.tableLoad = true;
      // this.packages = [...this.packages,...this.selectedRows];
      // const dataSource = [...this.orders];
      // this.orders = dataSource.filter(item => this.selectedRowKeys.indexOf(item.id) < 0);
      // this.tableLoad = false;
      var post = {
        orders : JSON.stringify(this.selectedRows)
      }
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/seqwait/selectOrder", post).then(function (res){
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS){
          util.success();
          _this.initPage();
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res)
      })
    },
    intoPackage : function (record){
      this.selectItem(record);
      this.selectedOrder();
    },
    format: function (date) {
      return formatDate(new Date(date), "yyyy-MM-dd")
    },
    initPage: function () {
      this.initCols();
      this.tableLoad = true;
      var _this = this;
      var postData = {
        subId : this.currentPage
      }
      this.$axios.post("/order/init", postData).then(function (res) {
        _this.tableLoad = false;
        _this.orders = new Array();
        if (res.data.code === util.SUCCESS) {
          if (res.data.retMap.orders.length > 0) {
            res.data.retMap.orders.map(item => {
              item.key = item.id;
              item.waitdate = formatDate(new Date(item.waitdate), "yyyy-MM-dd");
            })
          }
          _this.orders = res.data.retMap.orders;
          _this.subs = res.data.retMap.subs;
          _this.users = res.data.retMap.users;
          _this.selects = res.data.retMap.selects;
          _this.seqGroups = res.data.retMap.groups;
          _this.packages = [...res.data.retMap.selectedSubs];

          _this.selectedRows = new Array();
          _this.selectedRowKeys = new Array();
        } else {
          util.error(res.data.code);
        }
      }).catch(function (res) {
        _this.tableLoad = false;
        util.catchErr(res);
      });
    },

    isInput: function (col) {
      if (col === "indexnum" || col === "indexseq" || col === "ssdnaqubit" || col === "addseqremark"
          || col === "dnb" || col === "mixmethod" || col === "dsdna" || col === "ssdna" || col === "addvol") {
        return true;
      }
      return false;
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
        title: this.$t("seqwait.checkdate"),
        dataIndex: 'checkdate',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checkdate'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.checkdate)) {
            return false;
          }
          return formatDate(new Date(record.checkdate), "yyyy-MM-dd")
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
        sorter: (a, b) => {
          var aDate = formatDate(new Date(a.checkdate), "yyyy-MM-dd")
          var bDate = formatDate(new Date(b.checkdate), "yyyy-MM-dd")
          return util.sorter(aDate, bDate)
        },
      });
      scorllLength += 150;

      /**项目名称*/
      clom.push({
        title: this.$t("seqwait.projectname"),
        dataIndex: 'projectname',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'projectname'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.projectname)) {
            return false;
          }
          return record.projectname
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
        sorter: (a, b) => util.sorter(a.projectname, b.projectname),
      });
      scorllLength += 150;

      /**样本名称*/
      clom.push({
        title: this.$t("seqwait.samplename"),
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'samplename'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.samplename)) {
            return false;
          }
          return record.samplename
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
        sorter: (a, b) => util.sorter(a.samplename, b.samplename),
      });
      scorllLength += 150;

      /**样本编号*/
      clom.push({
        title: this.$t("seqwait.sampleindex"),
        dataIndex: 'sampleindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sampleindex'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.sampleindex)) {
            return false;
          }
          return record.sampleindex
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
        sorter: (a, b) => util.sorter(a.sampleindex, b.sampleindex),
      });
      scorllLength += 150;

      /**文库类型*/
      clom.push({
        title: this.$t("seqwait.libtype"),
        dataIndex: 'libtype',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'libtype'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.libtype)) {
            return false;
          }
          return record.libtype
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
        sorter: (a, b) => util.sorter(a.libtype, b.libtype),
      });
      scorllLength += 150;

      /**文库编号*/
      clom.push({
        title: this.$t("seqwait.libindex"),
        dataIndex: 'libindex',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'libindex'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.libindex)) {
            return false;
          }
          return record.libindex
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
        sorter: (a, b) => util.sorter(a.libindex, b.libindex),
      });
      scorllLength += 150;

      /**物种*/
      clom.push({
        title: this.$t("seqwait.species"),
        dataIndex: 'species',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'species'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.species)) {
            return false;
          }
          return record.species
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
        sorter: (a, b) => util.sorter(a.species, b.species),
      });
      scorllLength += 150;

      /**物种*/
      clom.push({
        title: this.$t("seqwait.mixmethod"),
        dataIndex: 'mixmethod',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'mixmethod'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.mixmethod)) {
            return false;
          }
          return record.mixmethod
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
        sorter: (a, b) => util.sorter(a.mixmethod, b.mixmethod),
      });
      scorllLength += 150;

      /**排机日期*/
      clom.push({
        title: this.$t("seqwait.waitdate"),
        dataIndex: 'waitdate',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'waitdate'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.waitdate)) {
            return false;
          }
          return record.waitdate
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
        sorter: (a, b) => {
          var aDate = formatDate(new Date(a.checkdate), "yyyy-MM-dd")
          var bDate = formatDate(new Date(b.checkdate), "yyyy-MM-dd")
          return util.sorter(aDate, bDate)
        },
      });
      scorllLength += 150;

      /**index编号*/
      clom.push({
        title: this.$t("seqwait.indexnum"),
        dataIndex: 'indexnum',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'indexnum'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.indexnum)) {
            return false;
          }
          return record.indexnum
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
        sorter: (a, b) => util.sorter(a.indexnum, b.indexnum),
      });
      scorllLength += 150;

      /**项目名称*/
      clom.push({
        title: this.$t("seqwait.indexseq"),
        dataIndex: 'indexseq',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'indexseq'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.indexseq)) {
            return false;
          }
          return record.indexseq
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
        sorter: (a, b) => util.sorter(a.indexseq, b.indexseq),
      });
      scorllLength += 150;

      /**ds Qubit浓度（ng/ul）*/
      clom.push({
        title: this.$t("seqwait.qubit"),
        dataIndex: 'qubit',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'qubit'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.qubit)) {
            return false;
          }
          return record.qubit
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
        sorter: (a, b) => util.sorter(a.qubit, b.qubit),
      });
      scorllLength += 200;

      /**ssDNA Qubit浓度（ng/ul）*/
      clom.push({
        title: this.$t("seqwait.ssdnaqubit"),
        dataIndex: 'ssdnaqubit',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'ssdnaqubit'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.ssdnaqubit)) {
            return false;
          }
          return record.ssdnaqubit
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
        sorter: (a, b) => util.sorter(a.ssdnaqubit, b.ssdnaqubit),
      });
      scorllLength += 200;

      /**DNB浓度（ng/ul）*/
      clom.push({
        title: this.$t("seqwait.dnb"),
        dataIndex: 'dnb',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dnb'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.dnb)) {
            return false;
          }
          return record.dnb
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
        sorter: (a, b) => util.sorter(a.dnb, b.dnb),
      });
      scorllLength += 200;

      /**ds DNA加样体积（ul）*/
      clom.push({
        title: this.$t("seqwait.dsdna"),
        dataIndex: 'dsdna',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dsdna'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.dsdna)) {
            return false;
          }
          return record.dsdna
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
        sorter: (a, b) => util.sorter(a.dsdna, b.dsdna),
      });
      scorllLength += 200;

      /**ssDNA 加样体积（ul）*/
      clom.push({
        title: this.$t("seqwait.ssdna"),
        dataIndex: 'ssdna',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'ssdna'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.ssdna)) {
            return false;
          }
          return record.ssdna
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
        sorter: (a, b) => util.sorter(a.ssdna, b.ssdna),
      });
      scorllLength += 200;

      /**DNB加样体积（ul）*/
      clom.push({
        title: this.$t("seqwait.addvol"),
        dataIndex: 'addvol',
        width: '200px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'addvol'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.addvol)) {
            return false;
          }
          return record.addvol
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
        sorter: (a, b) => util.sorter(a.addvol, b.addvol),
      });
      scorllLength += 200;

      /**Peak size(bp)*/
      clom.push({
        title: this.$t("seqwait.peaksize"),
        dataIndex: 'peaksize',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'peaksize'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.peaksize)) {
            return false;
          }
          return record.peaksize
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
        sorter: (a, b) => util.sorter(a.peaksize, b.peaksize),
      });
      scorllLength += 150;

      /**峰图描述*/
      clom.push({
        title: this.$t("seqwait.eledesc"),
        dataIndex: 'eledesc',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'eledesc'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.eledesc)) {
            return false;
          }
          return record.eledesc
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
        sorter: (a, b) => util.sorter(a.eledesc, b.eledesc),
      });
      scorllLength += 150;

      /**库检综合结果*/
      clom.push({
        title: this.$t("seqwait.checkresult"),
        dataIndex: 'checkresult',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'checkresult'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.checkresult)) {
            return false;
          }
          return record.checkresult
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
        sorter: (a, b) => util.sorter(a.checkresult, b.checkresult),
      });
      scorllLength += 150;

      /**项目数据量*/
      clom.push({
        title: this.$t("seqwait.projectdatanum"),
        dataIndex: 'projectdatanum',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'projectdatanum'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.projectdatanum)) {
            return false;
          }
          return record.projectdatanum
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
        sorter: (a, b) => util.sorter(a.projectdatanum, b.projectdatanum),
      });
      scorllLength += 150;

      /**数据量单位*/
      clom.push({
        title: this.$t("seqwait.dataunit"),
        dataIndex: 'dataunit',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'dataunit'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.dataunit)) {
            return false;
          }
          return record.dataunit
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
        sorter: (a, b) => util.sorter(a.dataunit, b.dataunit),
      });
      scorllLength += 150;

      /**上机备注*/
      clom.push({
        title: this.$t("seqwait.uploadremark"),
        dataIndex: 'uploadremark',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'uploadremark'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.uploadremark)) {
            return false;
          }
          return record.uploadremark
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
        sorter: (a, b) => util.sorter(a.uploadremark, b.uploadremark),
      });
      scorllLength += 150;

      /**项目负责人*/
      clom.push({
        title: this.$t("seqwait.projectuser"),
        dataIndex: 'projectuser',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'projectuser'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.projectuser)) {
            return false;
          }
          return record.projectuser
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
        sorter: (a, b) => util.sorter(a.projectuser, b.projectuser),
      });
      scorllLength += 150;

      /**加测备注*/
      clom.push({
        title: this.$t("seqwait.addseqremark"),
        dataIndex: 'addseqremark',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'addseqremark'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.addseqremark)) {
            return false;
          }
          return record.addseqremark
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
        sorter: (a, b) => util.sorter(a.addseqremark, b.addseqremark),
      });
      scorllLength += 150;

      /**是否平衡文库*/
      clom.push({
        title: this.$t("seqwait.isbalance"),
        dataIndex: 'isbalance',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'isbalance'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.isbalance)) {
            return false;
          }
          return record.isbalance
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
        sorter: (a, b) => a.isbalance - b.isbalance,
      });
      scorllLength += 150;

      /**是否可拆分*/
      clom.push({
        title: this.$t("seqwait.candivide"),
        dataIndex: 'candivide',
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'candivide'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.candivide)) {
            return false;
          }
          return record.candivide
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
        sorter: (a, b) => a.candivide - b.candivide
      });
      scorllLength += 150;

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
  computed: {
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
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}

</style>