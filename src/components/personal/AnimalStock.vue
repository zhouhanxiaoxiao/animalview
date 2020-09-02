<template>
  <div class="animal-stock-container">
    <top-nav></top-nav>
    <div class="stock-table">
      <div class="batch-edit">
        <button class="btn btn-primary btn-sm" :disabled="selectallDisable" type="button" @click="batchOrder">
          {{ $t("batchEdit") }}
        </button>
      </div>
      <table class="table table-striped table-hover">
        <thead class="stock-table-head">
        <tr>
          <th scope="col">
            <input type="checkbox" id="selectAll" value="selectAll" @click="selectAll('selectAll',$event)">
          </th>
          <th scope="col" v-for="(title,index) in titles" v-bind:key="index">{{ title }}</th>
        </tr>
        </thead>
        <tbody class="stock-table-body">
        <tr v-for="row in rows" v-bind:key="row.id" @click="selectRow($event)">
          <th scope="row" style="width: 5%">
            <input class="form-check-input stock-line-select" type="checkbox"
                   :disabled="row.number<1 || row.number == null"
                   :value="row.id" @click="selectAll(row.id,$event)">
          </th>
          <td style="width: 5%">
            {{ row.index }}
          </td>
          <td style="width: 5%">
            {{ row.stockID }}
          </td>
          <td style="width: 10%">
            {{ row.genotype }}
          </td>
          <td style="width: 20%">
            {{ row.resource }}
          </td>
          <td style="width: 10%">
            {{ row.container }}
          </td>
          <td style="width: 5%">
            {{ row.number }}
          </td>
          <td style="width: 5%">
            {{ usageType(row.usagetype) }}
          </td>
          <td style="width: 15%">
            {{ row.environment }}
          </td>
          <td style="width: 10%">
            <button type="button" class="btn btn-primary btn-sm stock-action"
                    @click="makeAppointment(row.id)"
                    v-if="canOrder"
                    :disabled="row.number<1 || row.number == null">
              预约
            </button>
            &nbsp;
            <button type="button"
                    class="btn btn-primary btn-sm stock-action"
                    v-if="canEdit"
                    @click="editStock(row.id)"
            >
              编辑
            </button>
          </td>
        </tr>
        </tbody>
      </table>
      <AppointmentDialog @submitData="submitAllData" :stock-ids="orderIds"></AppointmentDialog>
      <submitting :title="$t('submitting')"></submitting>
      <div class="page-index-container">
        <nav aria-label="Page navigation example " class="page-index">
          <ul class="pagination">
            <li class="page-item" @click="updateTable(currentPage - 1)"><a class="page-link">{{ $t("previous") }}</a>
            </li>
            <li class="page-item" :class="currentPage + 1 == item ? 'active':'' "
                v-for="item in pageTotal" :key="item"
                @click="updateTable(item - 1)"
            >
              <a class="page-link">{{ item }}</a>
            </li>
            <li class="page-item" @click="updateTable(currentPage + 1)"><a class="page-link">{{ $t("next") }}</a></li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import AppointmentDialog from "@/components/stockcenter/AppointmentDialog";
import Submitting from "@/components/publib/submitting";

export default {
  name: "AnimalStock",
  components: {Submitting, AppointmentDialog, TopNav},
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
  methods: {
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
          _this.titles = new Array();
          _this.titles.push("#");
          _this.titles.push("stock ID");
          _this.titles.push("genotype");
          _this.titles.push("resource");
          _this.titles.push("容器类型");
          _this.titles.push("数量");
          _this.titles.push("用途");
          _this.titles.push("保存环境");
          _this.titles.push("操作");
          _this.rows = new Array();
          if (stockTable != null && stockTable.length > 0) {
            for (var i = 0; i < stockTable.length; i++) {
              var stockTmp = stockTable[i];
              var row = {
                "id": stockTmp.stock.id,
                "index": i + _this.currentPage * _this.pageSize + 1,
                "stockID": stockTmp.animal.stockId,
                "genotype": stockTmp.animal.genotype,
                "resource": stockTmp.animal.resource,
                "container": stockTmp.stock.contanertype,
                "number": stockTmp.stock.contanernmuber,
                "usagetype": stockTmp.stock.usagetype,
                "environment": stockTmp.env.displayname ? stockTmp.env.displayname : "",
              }
              _this.rows.push(row);
            }
          }
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    editStock : function (stockId){
      this.$router.push({name:"stockEdit",query:{stockId:stockId}});
    },
    selectAll: function (value, evnt) {
      event.stopPropagation();
      if (value == "selectAll") {
        if (evnt.currentTarget.checked) {
          this.$(".stock-line-select:not(:checked)").click();
        } else {
          this.$(".stock-line-select:checked").click();
        }
      } else {
        if (evnt.currentTarget.checked) {
          this.selectedList.push(evnt.currentTarget.value);
        } else {
          if (this.selectedList != null && this.selectedList.length > 0) {
            var delIndex = -1;
            for (var i = 0; i < this.selectedList.length; i++) {
              if (this.selectedList[i] == evnt.currentTarget.value) {
                delIndex = i;
                break;
              }
            }
            if (delIndex != -1) {
              this.selectedList.splice(delIndex, 1);
            }
          }
        }
      }
    },
    selectRow: function (evnt) {
      event.stopPropagation();
      this.$(evnt.currentTarget).find(".stock-line-select").click();
    },
    updateTable: function (currentPage) {
      if (currentPage < 0) {
        return;
      }
      if (currentPage >= Math.ceil(this.total / this.pageSize)) {
        return;
      }
      this.selectedList = new Array();
      this.currentPage = currentPage;
      this.initStockTable();
    },
    makeAppointment: function (id) {
      event.stopPropagation();
      this.orderIds = new Array();
      this.orderIds.push(id);
      this.$("#exampleModal").modal('show');
    },
    batchOrder: function () {
      this.orderIds = new Array();
      for (var i = 0; i < this.selectedList.length; i++) {
        this.orderIds.push(this.selectedList[i]);
      }
      this.$("#exampleModal").modal();
    },
    submitAllData: function (data) {
      this.$("#submitting").modal('show');
      var _this = this;
      console.log(data);
      this.$axios.post("/task/askTask", data).then(function (res) {
        console.log(res);
        _this.$("#submitting").modal('hide');
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          window.location.reload();
        }
      }).catch(function (res) {
        console.log(res);
        _this.$("#submitting").modal('hide');
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    usageType: function (t) {
      if (t == "keep") {
        return this.$t("keep");
      } else if (t == "stock") {
        return this.$t("personnal_btn_stock");
      }
      return t;
    }
  },
  computed: {
    pageTotal: function () {
      var pages = Math.ceil(this.total / this.pageSize);
      var pageArry = new Array();
      for (var i = 0; i < pages; i++) {
        pageArry.push(i + 1);
      }
      return pageArry;
    },
    selectallDisable: function () {
      return this.selectedList.length == 0;
    },
    canEdit: function () {
      for (var i = 0; i < this.$store.getters.getUser.roles.length; i++) {
        var role = this.$store.getters.getUser.roles[i];
        if (role.roletype == "999999" || role.roletype == "02") {
          return true;
        }
      }
      return false;
    },
    canOrder: function () {
      for (var i = 0; i < this.$store.getters.getUser.roles.length; i++) {
        var role = this.$store.getters.getUser.roles[i];
        if (role.roletype == "999999" || role.roletype == "01") {
          return true;
        }
      }
      return false;
    }
  }
}
</script>

<style scoped>
.animal-stock-container {
  padding-top: 50px;
  text-align: left;
}

.stock-table {
  width: 90%;
  margin-left: 5%;
  background-color: white;
  margin-top: 20px;
  min-height: 500px;
  padding: 20px 20px;
  border-radius: 5px;
}

.stock-line-select {
  margin-left: 0px;
}

.stock-table-head {
  font-size: 14px;
}

.stock-table-body {
  font-size: 12px;
}

.stock-action {
  font-size: 12px;
}

.page-index-container {
  width: 100%;
  margin: 10px 0px;
  text-align: center;
}

.page-index {
  display: inline-block;
}

.batch-edit {
  margin-bottom: 10px;
}
</style>