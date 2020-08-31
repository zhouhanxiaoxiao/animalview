<template>
  <div>
    <a-table :columns="columns"
             :data-source="data" bordered
             :loading="tableLoad"
             :scroll="scroll" :pagination="{ pageSize: 20 }" size="middle">
      <template
          v-for="col in this.columnNames"
          :slot="col"
          slot-scope="text, record, index"
      >
        <div :key="col">
          <template v-if="record.editable">
            <!-- 序号 -->
            <a-input
                v-if="col != 'index'"
                style="margin: -5px 0"
                :value="text"
                @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>
              {{ showText(col, text, index) }}
            </template>
          </template>
          <template v-else>
            {{ showText(col, text, index) }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.key)">{{ $t("save") }}</a>
           &nbsp;
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.key)">
            <a>{{ $t("cancel") }}</a>
          </a-popconfirm>
        </span>
          <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.key)">{{ $t("edit") }}</a>
          &nbsp;
            <a-popconfirm
                v-if="data.length>1"
                title="Sure to delete?"
                @confirm="() => onDelete(record.key)"
            >
          <a :disabled="editingKey !== ''">{{ $t("delete") }}</a>
        </a-popconfirm>
        </span>
        </div>
      </template>
    </a-table>
    <div class="modal-footer" v-if="this.canOperating">
      <button type="button" class="btn btn-warning"
              :disabled="editingKey !== ''" @click="submitData('tmp')">{{ $t("tmpSave") }}
      </button>
      <button type="button" class="btn btn-primary"
              :disabled="editingKey !== ''" @click="submitData('real')">{{ $t("submit") }}
      </button>
    </div>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import Submitting from "@/components/publib/submitting";

export default {
  name: "processStep5",
  components: {Submitting},
  props: {
    process: Object
  },
  data: function () {
    this.cacheData = [];
    return {
      tableLoad: false,
      data: [],
      columns: [],
      columnNames: [],
      scroll: {x: 1500},
      editingKey: '',
      allUsers: []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    initPage: function () {
      this.initCols();
      var _this = this;
      this.$axios.post("/task/process/analyseInit", {processId: this.process.id}).then(function (res) {
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          if (res.data.retMap.datas.length != 0) {
            _this.data = new Array();
            for (var ind in res.data.retMap.datas) {
              var d = res.data.retMap.datas[ind];
              d.key = d.id;
              _this.data.push(d);
            }
          }
          _this.cacheData = _this.data.map(item => ({...item}));
          _this.allUsers = res.data.retMap.allUsers;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    initCols: function () {
      var scorllLength = 0;
      var clom = new Array();
      /**序号*/
      clom.push({
        title: this.$t("index"),
        dataIndex: 'index',
        width: '50px',
        fixed: 'left',
        scopedSlots: {customRender: 'index'},
      });
      scorllLength += 50;
      /**样本编号*/
      clom.push({
        title: this.$t("sampleIndex"),
        dataIndex: 'selfnumber',
        width: '150px',
        scopedSlots: {customRender: 'selfnumber'},
      });
      scorllLength += 150;
      /**样本名称*/
      clom.push({
        title: this.$t("sampleName"),
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: {customRender: 'samplename'},
      });
      scorllLength += 150;
      /**结果主路径*/
      clom.push({
        title: this.$t("resultpath"),
        dataIndex: 'resultpath',
        width: '300px',
        scopedSlots: {customRender: 'resultpath'},
      });
      scorllLength += 300;
      /**报告地址*/
      clom.push({
        title: this.$t("reportpath"),
        dataIndex: 'reportpath',
        width: '300px',
        scopedSlots: {customRender: 'reportpath'},
      });
      scorllLength += 300;
      /**分析流程/参数*/
      clom.push({
        title: this.$t("args"),
        dataIndex: 'args',
        width: '200px',
        scopedSlots: {customRender: 'args'},
      });
      scorllLength += 200;
      /**分析人*/
      clom.push({
        title: this.$t("analyst"),
        dataIndex: 'analyst',
        width: '150px',
        scopedSlots: {customRender: 'analyst'},
      });
      scorllLength += 150;
      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remarks',
        width: '200px',
        scopedSlots: {customRender: 'remarks'},
      });
      scorllLength += 200;
      if (this.canOperating) {
        /**操作*/
        clom.push({
          title: this.$t("operation"),
          dataIndex: 'operation',
          width: '100px',
          fixed: 'right',
          scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 100;
      }

      this.scroll.x = scorllLength;
      this.columns = clom;
      this.columnNames = new Array();
      for (var item in clom) {
        this.columnNames.push(clom[item].dataIndex);
      }
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    onDelete(key) {
      const data = [...this.data];
      this.data = data.filter(item => item.key !== key);
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.filter(item => key === item.key)[0];
      // if (!this.checkRowData(target)){
      //   return;
      // }
      target.add = false;
      const targetCache = newCacheData.filter(item => key === item.key)[0];
      if (target && targetCache) {
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      target.editable = false;
      this.editingKey = '';
      // console.log(this.data);
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target.add == true) {
        this.editingKey = "";
        this.onDelete(target.key);
        return;
      }
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
        target.editable = false;
        this.data = newData;
      }
    },
    showText: function (col, text, index) {
      console.log(col, text, index);
      if (col == "index") {
        return index + 1;
      }
      return text;
    },
    submitData: function (type) {
      var _this = this;
      var post = {
        processId: this.process.id,
        datas: JSON.stringify(this.data),
        type: type
      }
      _this.$("#submitting").modal("show");
      this.$axios.post("/task/process/saveAnalyse", post).then(function (res) {
        _this.$("#submitting").modal("hide");
        if (res.data.code != 200) {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          window.location.reload();
        }
      }).catch(function (res) {
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  computed: {
    canOperating: function () {
      if (this.process.taskstatu != "50") {
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.process.bioinformaticsanalysis)
          && !this.isAdmin
      ) {
        return false;
      }
      return true;
    }
  },
  watch: {
    process: {
      handler: function () {
        // console.log(newVal)
        this.initPage();
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>