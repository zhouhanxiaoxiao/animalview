<template>
  <div>
    <div class="shopCar" @click="showList">
      <a-badge :count="sampleCount">
        <a-icon type="shopping" theme="twoTone" two-tone-color="#eb2f96" style="font-size: 30px;line-height: 1.2"/>
      </a-badge>
    </div>
    <a-drawer
        placement="right"
        :visible="visible"
        :width="800"
        @close="onClose"
    >
      <div slot="title">
        {{ $t('seqwait.hasSelect') }}- {{ sampleCount }} 条，共 {{ totalNum }}G
      </div>

      <a-empty v-if="isNoData" />
      <div style="width: 100%;margin-bottom: 50px" v-else>
        <a-card size="small" v-for="sub in subs" :title="sub.name" :key="sub.id"
                style="width: 100%;margin-bottom: 20px">

          <div slot="extra" v-if="sub.id !== 'notDivide'">
            <a-button type="danger" size="small" @click="removeSub(sub.id)">{{ $t("seqwait.removeSub") }}</a-button>
          </div>

          <a-list
              class="demo-loadmore-list"
              item-layout="horizontal"
              :data-source="sub.orders"
              style="padding-bottom: 200px"
          >
            <a-list-item slot="renderItem" slot-scope="item">
              <div slot="actions">
                <a-popconfirm
                    placement="topRight"
                    :title="$t('seqwait.removeItemOutCar')"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="removeSelect(item)"
                >
                  <a>remove</a>
                </a-popconfirm>
              </div>
              <a-list-item-meta>
                <a slot="title">{{
                    item.projectname + "_" + item.samplename
                    + "_" + item.sampleindex
                  }}</a>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-card>
      </div>
      <div
          :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'left',
          zIndex: 1,
        }"
      >
        添加至：
        <a-select default-value="other" v-model="upId" style="width: 200px">
          <a-select-option value="other">
            {{ $t("seqwait.newUp") }}
          </a-select-option>
          <a-select-option v-for="item in seqGroups" :value="item.id" :key="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>

        <a-input :addon-before="newTask" style="width: 300px;margin-left: 7px"
                 v-if="upId === 'other'"
                 placeholder="给本次上机取个名字" v-model="upName"/>
        <div style="display: inline-block;float: right">
          <a-button :style="{ marginRight: '8px',marginLeft: '8px' }" @click="onClose">
            Cancel
          </a-button>
          <a-button type="primary" @click="submitData">
            Submit
          </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import {formatDate} from "@/components/publib/date"

export default {
  name: "orderCar",
  props: {
    selects: Array,
    seqGroups : Array
  },
  data: function () {
    return {
      subs : [],
      visible: false,
      upName: "",
      upId : "other",
      loading : false
    }
  },
  beforeMount() {
    this.subs = this.selects;
  },
  methods: {
    removeSub : function (subId){
      var post = {
        subId : subId,
        status : "00"
      }
      this.tableLoad = true;
      var _this = this;
      this.$axios.post("/seqwait/selectSub", post).then(function (res){
        _this.tableLoad = false;
        if (res.data.code === util.SUCCESS){
          _this.$emit("reload");
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        this.tableLoad = false;
        util.catchErr(res);
      })
    },
    showList: function () {
      this.visible = true;
    },
    onClose: function () {
      this.visible = false;
    },
    removeSelect: function (item) {
      var post = {
        order : JSON.stringify(item)
      }
      var _this = this;
      this.$axios.post("/seqwait/removeFromCar", post).then(function (res){
        if (res.data.code === util.SUCCESS){
          _this.$emit("reload");
        }else {
          util.error(res.data.code);
        }
      }).catch(function (res){
        util.catchErr(res);
      })
    },
    submitData: function () {
      if (this.selects.length === 0) {
        util.error("seqwait.carhasnoitem");
        return;
      }
      this.$emit("submitList", this.subs, this.upId, this.newTask + this.upName, this.totalNum);
      this.onClose();
    }
  },
  computed: {
    totalNum: function () {
      var total = 0.0;
      this.subs.map(sub =>{
        sub.orders.map(ord =>{
          total += parseFloat(ord.projectdatanum);
        })
      })
      return total;
    },
    newTask: function () {
      return "上机" + formatDate(new Date(), "yyyy-MM-dd");
    },
    isNoData : function (){
      if (this.selects.length === 1 && this.selects[0].orders.length === 0){
        return true;
      }
      return  false;
    },
    sampleCount : function (){
      var count = 0;
      this.selects.map(item =>{
        count += item.orders.length;
      });
      return count;
    }
  },
  watch : {
    selects : {
      handler : function (newVal){
        this.subs = newVal;
      },
      deep : true
    }
  }
}
</script>

<style scoped>
.shopCar {
  position: fixed;
  bottom: 50px;
  right: 40px;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 1px darkgray solid;
  background: white;
  cursor: pointer;
}
</style>