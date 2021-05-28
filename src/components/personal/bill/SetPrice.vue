<template>
  <div>
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :ghost="false"
        :title="$t('bill.unitPriceSet')"
    >
      <template slot="extra">
        <a-button type="primary" @click="addNewPrice">
          {{ $t("add") }}
        </a-button>
      </template>
    </a-page-header>
    <a-table :columns="columns"
             :data-source="prices"
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
          <div v-if="col == 'index'">
            {{ index + 1 }}
          </div>
          <a-input-number style="width: 100%"  v-else-if="col === 'price'" v-model="record[col]" />
          <a-select style="width: 100%" v-else-if="col === 'libtype'"
                    v-model="record.libtype" disabled
          >
            <a-select-option v-for="item in libtypes" :key="item.key" :value="item.key" >
              {{ item.name }}
            </a-select-option>
          </a-select>
          <div v-else>
            {{ record[col] }}
          </div>

        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <a href="javascript:;" @click="savePrice(record)">Save</a>
        </div>
      </template>
    </a-table>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>

    <a-modal v-model="visible" :title="$t('add')" @ok="submitNewPrice">
      <div class="form-group row">
        <label for="name" class="col-sm-3 col-form-label">{{ $t("bill.name") }}</label>
        <div class="col-sm-9">
          <a-input id="name" v-model="newPrice.pricename"/>
        </div>
      </div>
      <div class="form-group row">
        <label for="libtype" class="col-sm-3 col-form-label">{{ $t("bill.libtype") }}</label>
        <div class="col-sm-9">
          <a-select id="libtype" style="width: 100%" v-model="newPrice.libtype">
            <a-select-option v-for="item in libtypes" :key="item.key" :value="item.key">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="form-group row">
        <label for="price" class="col-sm-3 col-form-label">{{ $t("bill.price") }}</label>
        <div class="col-sm-9">
          <a-input-number style="width: 100%"  id="price" v-model="newPrice.price" />
        </div>
      </div>
      <div class="form-group row">
        <label for="pricetype" class="col-sm-3 col-form-label">{{ $t("bill.pricetype") }}</label>
        <div class="col-sm-9">
          <a-input id="pricetype" v-model="newPrice.pricetype" />
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>
import i18n from "@/i18n";
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";

export default {
  name: "SetPrice",
  components: {Submitting},
  data : function (){
    return {
      tableLoad: false,
      prices: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      libtypes : [],
      visible : false,
      newPrice : {
        pricename : "",
        libtype : "",
        price : "",
        pricetype : ""
      }
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    addNewPrice : function (){
      this.visible = true;
    },
    submitNewPrice : function (){
      var postData = {
        price : JSON.stringify(this.newPrice)
      }
      this.visible = false;
      util.commonPost("/personal/bill/addNewPrice",postData,this.initPage,this.$refs.submitting.$el);
    },
    savePrice : function (record){
      var postData = {
        price : JSON.stringify(record)
      }
      util.commonPost("/personal/bill/updatePrice",postData,this.initPage,this.$refs.submitting.$el);
    },
    showText : function (record,index,col){
      console.log(record,index,col);
      return index + 1;
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
      this.initCols();
      var _this = this;
      this.tableLoad = true;
      this.$axios.post("/personal/bill/setInit",{}).then(function (res){
        _this.tableLoad = false;
        console.log(res);
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.prices = new Array();
          _this.prices = res.data.retMap.prices;
          _this.libtypes = res.data.retMap.libtypes;
          _this.prices.map(item => item.key = item.id);
        }
      }).catch(function (res){
        _this.tableLoad = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols : function (){
      var clom = new Array();
      /**序号*/
      clom.push({
        title: i18n.t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });

      /**收费项目*/
      clom.push({
        title: this.$t("bill.pricename"),
        dataIndex: 'pricename',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'pricename'
        },
        onFilter: (value, record) =>
            record.pricename
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

      /**单价*/
      clom.push({
        title: this.$t("bill.price"),
        dataIndex: 'price',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'price'
        },
        onFilter: (value, record) =>
            record.price
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

      /** pricetype */
      clom.push({
        title: this.$t("bill.pricetype"),
        dataIndex: 'pricetype',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'pricetype'
        },
        onFilter: (value, record) =>
            record.pricetype
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

      /** 文库类型 */
      clom.push({
        title: this.$t("bill.libtype"),
        dataIndex: 'libtype',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'libtype'
        },
        onFilter: (value, record) =>
            record.libtype
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

</style>