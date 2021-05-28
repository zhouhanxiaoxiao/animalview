<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-page-header
          style="border: 1px solid rgb(235, 237, 240)"
      >
        <template slot="title">
          {{ $t('seqwait.seqing') }}
        </template>
        <template slot="extra">

        </template>
        <a-row type="flex">

        </a-row>
      </a-page-header>

      <a-table :columns="columns"
               :data-source="seqGroups"
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
            <div v-else-if="col === 'curstatu'">
              <a-tag color="#2db7f5" v-if="record[col] === '00'">{{ $t("processing") }}</a-tag>
              <a-tag color="#87d068" v-if="record[col] === '01'">{{ $t("allcomplete") }}</a-tag>
            </div>
            <div v-else>
              {{ text }}
            </div>
          </div>
        </template>

        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a-button type="primary" size="small" class="operator-btn"
                        @click="gotoDetail(record.id)">{{ $t("detail") }}</a-button>
              <a-button type="danger" size="small" class="operator-btn" v-if="record.curstatu === '01'"
                        @click="gotoReport(record.id)">{{ $t("qualityControl") }}</a-button>
            </span>
          </div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date";
export default {
  name: "upmachine",
  components: {TopNav},
  data : function (){
    return {
      seqGroups : [],
      tableLoad : false,
      columns :[],
      columnNames: [],
      searchText: '',
      searchInput: null,
      searchedColumn: '',
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    gotoDetail : function (id){
      this.$router.push({name:"upmaDetail",query:{seqGroupId:id}});
    },
    gotoReport : function (id){
      this.$router.push({name:"seqReport",query:{seqGroupId:id}});
    },
    initPage : function (){
      this.initCols();
      var _this = this;
      this.$axios.post("/seqwait/seqgroup/init").then(function (res){
        if (res.data.code === util.SUCCESS){
          if (res.data.retMap.seqGroups.length > 0){
            _this.seqGroups = new Array();
            res.data.retMap.seqGroups.map(group =>{
              group.key = group.id;
              group.createtime = formatDate(new Date(group.createtime), "yyyy-MM-dd");
              _this.seqGroups.push(group);
            })
          }
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
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
    initCols : function (){
      var clom = new Array();

      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        scopedSlots: {customRender: 'index'},
      });


      /**检测日期*/
      clom.push({
        title: this.$t("seqgroup.name"),
        dataIndex: 'name',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'name'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.name)) {
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
        sorter: (a, b) => util.sorter(a.name, b.name),
      });

      /**数据量*/
      clom.push({
        title: this.$t("seqgroup.totalsize"),
        dataIndex: 'totalsize',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'totalsize'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.totalsize)) {
            return false;
          }
          return record.totalsize
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
        sorter: (a, b) => util.sorter(a.totalsize, b.totalsize),
      });

      /**检测日期*/
      clom.push({
        title: this.$t("seqgroup.totalsample"),
        dataIndex: 'totalsample',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'totalsample'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.totalsample)) {
            return false;
          }
          return record.totalsample
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
        sorter: (a, b) => util.sorter(a.totalsample, b.totalsample),
      });

      /**检测日期*/
      clom.push({
        title: this.$t("seqgroup.createtime"),
        dataIndex: 'createtime',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'createtime'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.createtime)) {
            return false;
          }
          return record.createtime
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
        sorter: (a, b) => util.sorter(a.createtime, b.createtime),
      });

      /**序号*/
      clom.push({
        title: this.$t("status"),
        dataIndex: 'curstatu',
        scopedSlots: {customRender: 'curstatu'},
      });

      /**操作*/
      clom.push({
        title: this.$t("operation"),
        dataIndex: 'operation',
        scopedSlots: {customRender: 'operation'},
      });

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
.operator-btn{
  margin: 2px 2px;
}
</style>