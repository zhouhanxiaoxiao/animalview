<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('summary')"
        :sub-title="process.projectname"
    ></a-page-header>
    <a-table :columns="columns"
             :data-source="samples"
             bordered
             :scroll="scroll"
             :loading="tableLoad"
             :pagination="false"
             size="small" >
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
          <template v-if="col == 'sampleName' || col == 'species' || col == 'tissue'">
            {{ showText(col ,record) }}
          </template>
          <div v-else style="font-size: 20px !important;">
            <div v-if="text == '01'">
              <a-tooltip :title="$t('processing')">
                <icon-font type="icon-jinhangzhong"/>
              </a-tooltip>
            </div>
            <div v-else-if="text == '02'">
              <a-tooltip :title="$t('Pending')">
                <icon-font type="icon-audit"/>
              </a-tooltip>
            </div>
            <div v-else-if="text == '03'">
              <a-tooltip :title="$t('allcomplete')">
                <icon-font type="icon-yiwancheng"/>
              </a-tooltip>
            </div>
            <div v-else-if="col == 'inputStatu' && text == '08'">
              <a-tooltip :title="$t('AuditNotPassed')">
                <icon-font type="icon-shenhebutongguo"/>
              </a-tooltip>
            </div >
            <div v-else-if="col != 'inputStatu' && text == '07'">
              <a-tooltip :title="$t('AuditNotPassed')">
                <icon-font type="icon-shenhebutongguo"/>
              </a-tooltip>
            </div >
<!--            <div v-else>-->
<!--              <a-tooltip :title="'未开始'">-->
<!--                <icon-font type="iconweikaishi"/>-->
<!--              </a-tooltip>-->
<!--              {{ text }}-->
<!--            </div>-->
          </div>
        </div>
      </template>
    </a-table>
    <process-diy-statu :process="process"></process-diy-statu>
  </div>
</template>

<script>
import {Icon} from "ant-design-vue";
import util from "@/components/publib/util";
import ProcessDiyStatu from "@/components/task/processHandle/ProcessDiyStatu";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});
export default {
  name: "processAllData",
  props : {
    process:Object,
  },
  components : {ProcessDiyStatu, IconFont},
  data : function (){
    return {
      samples : [],
      tableLoad : false,
      searchText: '',
      scroll : {y:500},
      searchedColumn: '',
      columns :[],
      columnNames : []
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    showText : function (col, record){
      if (col == 'sampleName'){
        return record.sampleName;
      }
      if (col == 'species'){
        return record.species;
      }
      if (col == 'tissue'){
        return record.tissue;
      }
      return "";
    },
    initPage : function (){
      this.initCols();
      var postData = {
        processId : this.process.id
      }
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/task/process/initAllStatu",postData).then(function (res){
        _this.tableLoad = false;
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          console.log(res);
          _this.samples = res.data.retMap.list;
        }
      }).catch(function (res){
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },

    initCols : function (){
      var clom = new Array();
      /* 样本名称 */
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'sampleName',
        key: 'sampleName',
        width: "12%",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sampleName',
        },
        onFilter: (value, record) =>
            record.sampleName
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

      /* 物种 */
      clom.push({
        title: this.$t("species"),
        dataIndex: 'species',
        key: 'species',
        width: "11%",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'species',
        },
        onFilter: (value, record) =>
            record.species
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

      /* 样本名称 */
      clom.push({
        title: this.$t("tissue"),
        dataIndex: 'tissue',
        key: 'tissue',
        width: "11%",
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'tissue',
        },
        onFilter: (value, record) =>
            record.tissue
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

      /* 样本录入 */
      clom.push({
        title: this.$t('sampleInput'),
        width: "11%",
        dataIndex: 'inputStatu',
        key: 'inputStatu',
        scopedSlots: { customRender: 'inputStatu' },
        filters : [
          {
            text : this.$t('processing'),
            value : '01'
          },
          {
            text : this.$t('Pending'),
            value : '02'
          },
          {
            text : this.$t('allcomplete'),
            value : '03'
          },
          {
            text : this.$t('AuditNotPassed'),
            value : '08'
          },
        ],
        onFilter: (value, record) => {
          if (record.inputStatu == undefined){
            return false;
          }
          return record.inputStatu.indexOf(value) === 0;
        },
        sorter: (a, b) => util.sorter(a.inputStatu,b.inputStatu),
      });

      /* 样本制备 */
      clom.push({
        title: this.$t('samplePreparation'),
        width: "11%",
        dataIndex: 'makeStatu',
        key: 'makeStatu',
        scopedSlots: { customRender: 'makeStatu' },
        filters : [
          {
            text : this.$t('processing'),
            value : '01'
          },
          {
            text : this.$t('Pending'),
            value : '02'
          },
          {
            text : this.$t('allcomplete'),
            value : '03'
          },
          {
            text : this.$t('AuditNotPassed'),
            value : '07'
          },
        ],
        onFilter: (value, record) => {
          if (record.makeStatu == undefined){
            return false;
          }
          return record.makeStatu.indexOf(value) === 0;
        },
        sorter: (a, b) => util.sorter(a.makeStatu,b.makeStatu),
      });

      /* 文库制备 */
      clom.push({
        title: this.$t('libraryPreparation'),
        width: "11%",
        dataIndex: 'libStatu',
        key: 'libStatu',
        scopedSlots: { customRender: 'libStatu' },
        filters : [
          {
            text : this.$t('processing'),
            value : '01'
          },
          {
            text : this.$t('Pending'),
            value : '02'
          },
          {
            text : this.$t('allcomplete'),
            value : '03'
          },
          {
            text : this.$t('AuditNotPassed'),
            value : '07'
          },
        ],
        onFilter: (value, record) => {
          if (record.libStatu == undefined){
            return false;
          }
          return record.libStatu.indexOf(value) === 0;
        },
        sorter: (a, b) => util.sorter(a.libStatu,b.libStatu),
      });

      /* 上机确认 */
      clom.push({
        title: this.$t('uploadConfirm'),
        width: "11%",
        dataIndex: 'confrimStatu',
        key: 'confrimStatu',
        scopedSlots: { customRender: 'confrimStatu' },
        filters : [
          {
            text : this.$t('processing'),
            value : '01'
          },
          {
            text : this.$t('Pending'),
            value : '02'
          },
          {
            text : this.$t('allcomplete'),
            value : '03'
          },
          {
            text : this.$t('AuditNotPassed'),
            value : '07'
          },
        ],
        onFilter: (value, record) => {
          if (record.confrimStatu == undefined){
            return false;
          }
          return record.confrimStatu.indexOf(value) === 0;
        },
        sorter: (a, b) => util.sorter(a.confrimStatu,b.confrimStatu),
      });

      /* 数据交付 */
      clom.push({
        title: this.$t('dismountData'),
        width: "11%",
        dataIndex: 'disStatu',
        key: 'disStatu',
        scopedSlots: { customRender: 'disStatu' },
        filters : [
          {
            text : this.$t('processing'),
            value : '01'
          },
          {
            text : this.$t('Pending'),
            value : '02'
          },
          {
            text : this.$t('allcomplete'),
            value : '03'
          },
          {
            text : this.$t('AuditNotPassed'),
            value : '07'
          },
        ],
        onFilter: (value, record) => {
          if (record.disStatu == undefined){
            return false;
          }
          return record.disStatu.indexOf(value) === 0;
        },
        sorter: (a, b) => util.sorter(a.disStatu,b.disStatu),
      });

      /* 生信分析 */
      clom.push({
        title: this.$t('bioinformaticsAnalysis'),
        width: "11%",
        dataIndex: 'anaStatu',
        key: 'anaStatu',
        scopedSlots: { customRender: 'anaStatu' },
        filters : [
          {
            text : this.$t('processing'),
            value : '01'
          },
          {
            text : this.$t('Pending'),
            value : '02'
          },
          {
            text : this.$t('allcomplete'),
            value : '03'
          },
          {
            text : this.$t('AuditNotPassed'),
            value : '07'
          },
        ],
        onFilter: (value, record) => {
          if (record.anaStatu == undefined){
            return false;
          }
          return record.anaStatu.indexOf(value) === 0;
        },
        sorter: (a, b) => util.sorter(a.anaStatu,b.anaStatu),
      });
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }

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
  },
  watch : {
    process : {
      handler : function (){
        this.initPage();
      },
      deep : true
    }
  },
  computed :{

  }
}
</script>

<style scoped>

</style>