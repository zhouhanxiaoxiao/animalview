<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-table :data-source="data" :columns="columns">
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
        <template slot="customRender" slot-scope="text, record, index, column">
      <span v-if="searchText && searchedColumn === column.dataIndex">
        <template
            v-for="(fragment, i) in text
            .toString()
            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
        >
          <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
          >{{ fragment }}</mark
          >
          <template v-else>{{ fragment }}</template>
        </template>
      </span>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
export default {
  name: "currentStock",
  components: {TopNav},
  data: function () {
    return {
      orderIds: [],
      selectedList: [],
      titles: [],
      rows: [],
      selectedLine: [],
      currentPage: 0,
      pageSize: 10,
      total: 0
    }
  },
  beforeMount: function () {
    this.initStockTable();
  },
  methods : {
    initStockTable: function () {
      var _this = this;
      var postData = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      this.$axios.post(
          "/stock/getAll", postData
      ).then(function (res) {
        console.log(res);
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          var stockTable = res.data.retMap.stockTable;
          _this.total = res.data.retMap.totalnumber;
          if (stockTable != null && stockTable.length > 0) {
            for (var i = 0; i < stockTable.length; i++) {
              var stockTmp = stockTable[i];
              stockTmp.key = stockTmp.id;
            }
          }
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
  }
}
</script>

<style scoped>

</style>