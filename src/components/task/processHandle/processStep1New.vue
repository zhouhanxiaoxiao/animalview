<template>
  <div class="process-step1">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        :title="$t('sampleInput')"
        :sub-title="process.projectname"
    >
      <template slot="extra">
        <a-button type="danger" @click="batchUnPass()" v-if="canPase" :disabled="disabledPass">
          {{ $t("unPass") }}
        </a-button>
        <a-button type="primary" @click="submitData('pass')" v-if="canPase" :disabled="disabledPass">
          {{ $t("pass") }}
        </a-button>
        <a-button :disabled="canDelete" type="primary" v-if="canEdit"
                  data-toggle="collapse" href="#batchUpdate" role="button" aria-expanded="false"
                  aria-controls="batchUpdate">
          {{ $t("batchUpdate") }}
        </a-button>

        <a-popconfirm placement="topLeft"
                      :ok-text="$t('yes')"
                      :disabled="selectedRows.length == 0"
                      :cancel-text="$t('no')"
                      v-if="canEdit"
                      @confirm="deleteInputs">
          <template slot="title">
            <p>{{ $t("areyousureDelete") }}</p>
          </template>
          <a-button :disabled="canDelete" type="danger" v-if="canEdit">
            {{ $t("delete") }}
          </a-button>
        </a-popconfirm>
        <a-button @click="subTaskInfo"
                  :disabled="canDivide" type="primary" v-if="canEdit">
          {{ $t("divide") }}
        </a-button>

        <a-button @click="submitData('complete')"
                  :disabled="canDelete" type="primary" v-if="canEdit">
          {{ $t("submit") }}
        </a-button>
        <a-button @click="submitData('real')"
                  :disabled="cansubmit" type="primary" v-if="isCreater">
          {{ $t("samplePreparation") }}
        </a-button>
        <a-button @click="submitData('tmp')" color="orange" v-if="canEdit">
          {{ $t("tmpSave") }}
        </a-button>
        <a-tooltip placement="topLeft" :title="$t('process.addnewrowTip')">
          <a-button class="editable-add-btn" v-if="canEdit"
                    @click="handleAdd"
          >
            {{ $t("add") }}
          </a-button>
        </a-tooltip>
        <a-button icon="download" @click="downLoad">
          {{ $t("outPut") }}
        </a-button>
        <a-upload
            name="file"
            v-if="canEdit"
            accept=".xls,.xlsx"
            :headers="{token:this.$cookies.get('token'),processId : process.id}"
            @change="handUploadChange"
            @reject="handUnaccept"
            :show-upload-list="false"
            :action="this.$axios.defaults.baseURL + '/file/import/sampleInput'"
        >
          <a-tooltip placement="topLeft" :title="$t('overText')">
            <a-button>
              <a-icon type="upload"/>
              {{ $t("input") }}
            </a-button>
          </a-tooltip>
        </a-upload>
      </template>
      <a-row type="flex">
        <a-tooltip>
          <a-tag class="pointer" color="#87d068" @click="showSubTask('03')">
            {{ $t("allAllow") + "(" + operators.creater.name + ")"}}
          </a-tag>
          <a-tag class="pointer" color="#108ee9" @click="showSubTask('02')">
            {{ $t("submitted") + "(" + operators.make.name + ")"}}
          </a-tag>
          <template  v-if="canEdit">
            <a-tag class="pointer" color="#2db7f5" v-for="sub in subs" :key="sub.id" @click="showSubTask(sub.id)">
              {{ sub.name }}
            </a-tag>
          </template>
          <a-tag class="pointer" color="#f50" @click="showSubTask('00')">
            {{ $t("init") + "(" + operators.creater.name + ")"}}
          </a-tag>
          <template slot="title">
            {{$t("process.tagListTip")}}
          </template>
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </a-row>
    </a-page-header>
    <div class="collapse" id="batchUpdate">
      <div class="card card-body">
        <div class="form-row">

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="arrindex">{{ $t("arrindex") }}</label>
            <a-input id="arrindex" v-model="editObj.arrindex"/>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="initSample">{{ $t("initSample") }}</label>
            <!-- initSample -->
            <a-select id="initSample" style="width: 100%" v-model="editObj.initsample">
              <a-select-option v-for="item in sampleInits" :key="item.key" :value="item.key">
                {{ item.val }}
              </a-select-option>
            </a-select>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="sampleName">{{ $t("sampleName") }}</label>
            <a-input id="sampleName" v-model="editObj.samplename"/>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="species">{{ $t("species") }}</label>
            <a-input id="species" v-model="editObj.species"/>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="tissue">{{ this.$t("tissue") + $t("animal_stock_resource") }}</label>
            <a-input id="tissue" v-model="editObj.tissue"/>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="sampleMsg">{{ $t("sampleMsg") }}</label>
            <a-select id="sampleMsg" style="width: 100%" v-model="editObj.samplemsg">
              <a-select-option v-for="item in sampletypes(editObj.initsample)" :key="item.key" :value="item.key">
                {{ item.val }}
              </a-select-option>
            </a-select>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="sampleStatu">{{ $t("sampleStatu") }}</label>
            <a-select id="sampleStatu" style="width: 100%" v-model="editObj.samplestatu">
              <a-select-option v-for="item in sampletypes(editObj.initsample)" :key="item.key" :value="item.key">
                {{ item.val }}
              </a-select-option>
            </a-select>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="tissueNumber">{{ $t("tissueNumber") + "（g）" }}</label>
            <div id="tissueNumber">
              <a-input-number v-model="editObj.tissuenumber" style="width: 100%"/>
            </div>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="bloodVolume">{{ $t("bloodVolume") + "(ml)" }}</label>
            <div id="bloodVolume">
              <a-input-number v-model="editObj.bloodvolume" style="width: 100%"/>
            </div>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="concentration">{{ concentrationName }}</label>
            <div id="concentration">
              <a-input-number v-model="editObj.concentration" style="width: 100%"/>
            </div>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="samplevolume">{{ $t("sampleVolume") + "(ul)" }}</label>
            <div id="samplevolume">
              <a-input-number v-model="editObj.samplevolume" style="width: 100%"/>
            </div>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="totalnumber">{{ totalNumberTitle }}</label>
            <div id="totalnumber">
              <a-input-number v-model="editObj.totalnumber" style="width: 100%"/>
            </div>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="celllife">{{ $t("cellLife") }}</label>
            <a-input id="celllife" v-model="editObj.celllife"/>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="cellSort">{{ $t("cellSort") }}</label>
            <a-select id="cellSort" style="width: 100%" v-model="editObj.cellsort">
              <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
                {{ item.val }}
              </a-select-option>
            </a-select>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="databaseType">{{ $t("databaseType") }}</label>
            <!-- 建库类型 -->
            <a-select style="width: 100%" id="databaseType" v-model="editObj.databasetype">
              <a-select-option v-for="item in databaseTypes(editObj.initsample)" :key="item.key" :value="item.key">
                {{ item.val }}
              </a-select-option>
            </a-select>
          </div>

          <div class="form-group col-md-3 col-sm-12 col-lg-2">
            <label for="SequencingPlatform">{{ $t("SequencingPlatform") }}</label>
            <a-select style="width: 100%" id="SequencingPlatform"
                      v-model="editObj.sequencingplatform">
              <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
                {{ item.val }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <div class="modal-footer" style="text-align: center">
          <a-popconfirm placement="topLeft"
                        :ok-text="$t('yes')"
                        :disabled="selectedRows.length == 0"
                        :cancel-text="$t('no')"
                        @confirm="tmpSaveData">
            <template slot="title">
              <p>{{ "数据将保存到页面上，确认无误后点击'暂存'才可以真正保存数据！" }}</p>
            </template>
            <a-button type="primary" :disabled="selectedRows.length == 0">
              {{ $t("confirm") }}
            </a-button>
          </a-popconfirm>
        </div>
      </div>
    </div>
    <a-table :columns="columns"
             :data-source="data"
             bordered
             :loading="tableLoad"
             :scroll="scroll"
             :row-selection="rowSelection"
             :pagination="false"
             size="middle">
      <!--   自定义列名 开始  -->
      <template slot="initSampleTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.sampleInitTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{this.$t("initSample")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <template slot="sampleNameTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{this.$t("sampleName")}}
      </template>

      <template slot="sampleIndexTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.sampleIndexTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{this.$t("sampleIndex")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>
      <template slot="speciesTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.speciesTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{this.$t("species")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <template slot="tissueTitle">
        <icon-font style="font-size: 20px" type="icon-bitian" />
        {{this.$t("tissue") + this.$t("animal_stock_resource")}}
      </template>

      <template slot="sampleMsgTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.dropdownTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{$t("sampleMsg")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>
      <template slot="sampleStatuTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.dropdownTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{$t("sampleStatu")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <template slot="databaseTypeTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.dropdownTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{$t("databaseType")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <template slot="SequencingPlatformTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.dropdownTip")}}
          </template>
          <icon-font style="font-size: 20px" type="icon-bitian" />
          {{$t("SequencingPlatform")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <template slot="operationTitle">
        <a-tooltip>
          <template slot="title">
            {{$t("process.operationTip")}}
          </template>
          {{$t("operation")}}
          <a-icon type="question-circle" theme="twoTone"/>
        </a-tooltip>
      </template>

      <!--   自定义列名 结束  -->
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
          slot-scope="text, record,index"
      >
        <div :key="col">
          <!-- 样本类型 -->
          <a-select style="width: 100%" v-if="col == 'samplemsg'"
                    v-model="record.samplemsg"
                    :disabled="isDisabled(record)"
          >
            <a-select-option v-for="item in sampletypes(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 样本状态 -->
          <a-select style="width: 100%" v-else-if="col == 'samplestatu'"
                    v-model="record.samplestatu"
                    :disabled="isDisabled(record)"
          >
            <a-select-option v-for="item in sampleStatu(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- 细胞分选法 -->
          <a-select style="width: 100%" v-else-if="col == 'cellsort'"
                    v-model="record.cellsort"
                    :disabled="colIsDisabed(record.initsample,'cellsort') || isDisabled(record)"
          >
            <a-select-option v-for="item in cellSortMethods" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>

          <!-- 建库类型 -->
          <a-select style="width: 100%" v-else-if="col == 'databasetype'"
                    v-model="record.databasetype"
                    :disabled="isDisabled(record)"
          >
            <a-select-option v-for="item in databaseTypes(record.initsample)" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- initSample -->
          <a-select style="width: 100%" v-else-if="col == 'initsample'"
                    v-model="record.initsample"
                    :disabled="isDisabled(record)"
                    @change="sampleInitChange(record)"
          >
            <a-select-option v-for="item in sampleInits" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <!-- species -->
          <div v-else-if="col == 'species'">
            <a-select style="width: 100%"
                      mode="default"
                      :showSearch="true"
                      :maxTagCount="1"
                      v-model="record.species"
                      :disabled="isDisabled(record)"
            >
              <a-select-option value="Homo sapiens">Homo sapiens</a-select-option>
              <a-select-option value="Mus musculus">Mus musculus</a-select-option>
              <a-select-option value="Drosophila melanogaster">Drosophila melanogaster</a-select-option>
              <a-select-option value="Drosophila simulans">Drosophila simulans</a-select-option>
              <a-select-option value="Drosophila yakuba">Drosophila yakuba</a-select-option>
              <a-select-option value="other">other</a-select-option>
            </a-select>
            <a-input v-model="record.otherSpecies" v-if="record.species == 'other'"
                     :disabled="isDisabled(record)"></a-input>
          </div>
          <!-- 测序平台 -->
          <a-select style="width: 100%" v-else-if="col == 'sequencingplatform'"
                    v-model="record.sequencingplatform"
                    :disabled="isDisabled(record)"
          >
            <a-select-option v-for="item in seqPlants" :key="item.key" :value="item.key">
              {{ item.val }}
            </a-select-option>
          </a-select>
          <a-input-number
              v-else-if="col == 'samplevolume'"
              style="margin: -5px 0"
              v-model="record.samplevolume"
              :min="0"
              :disabled="colIsDisabed(record.initsample,'samplevolume') || isDisabled(record)"
          />
          <a-input-number
              v-else-if="col == 'tissuenumber'"
              style="margin: -5px 0"
              v-model="record.tissuenumber"
              :min="0"
              :disabled="colIsDisabed(record.initsample,'tissuenumber') || isDisabled(record)"
          />
          <a-input-number
              v-else-if="col == 'bloodvolume'"
              style="margin: -5px 0"
              v-model="record.bloodvolume"
              :min="0"
              :disabled="colIsDisabed(record.initsample,'bloodvolume') || isDisabled(record)"
          />
          <a-input v-else-if="col == 'concentration'"
                   :disabled="colIsDisabed(record.initsample,'concentration') || isDisabled(record)"
                   v-model="record.concentration"
          >
            <a-select slot="addonAfter" default-value="ng/ul"
                      v-model="record.concentrationunit"
                      :disabled="colIsDisabed(record.initsample,'concentration') || isDisabled(record)"
                      style="width:130px">
              <a-select-option value="ng/ul">
                ng/ul
              </a-select-option>
              <a-select-option value="细胞个数/μl">
                细胞个数/μl
              </a-select-option>
            </a-select>
          </a-input>

<!--          <a-input-number-->
<!--              v-else-if="col == 'concentration'"-->
<!--              style="margin: -5px 0"-->
<!--              v-model="record.concentration"-->
<!--              :min="0"-->
<!--              :disabled="colIsDisabed(record.initsample,'concentration') || isDisabled(record)"-->
<!--          />-->
          <a-input-number
              v-else-if="col == 'totalnumber'"
              style="margin: -5px 0"
              v-model="record.totalnumber"
              :min="0"
              :disabled="colIsDisabed(record.initsample,'totalnumber') || isDisabled(record)"
          />
          <a-input
              v-else-if="col != 'index'"
              style="margin: -5px 0"
              v-model="record[col]"
              :disabled="colIsDisabed(record.initsample,col) || isDisabled(record)"
          />
          <template v-else>
            {{ showText(col, text, index, record) }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" v-if="record.currentstatu == '03'"/>
            <a-icon type="clock-circle" theme="twoTone" two-tone-color="#FFCC00" v-if="record.currentstatu == '02'"/>
            <a-icon type="close-circle" theme="twoTone" two-tone-color="#eb2f96" v-if="record.currentstatu == '08'"/>
            <a-icon type="stop" theme="twoTone" two-tone-color="#CC0000" v-if="record.currentstatu == '09'"/>
            &nbsp;
          </span>
          <span v-if="record.currentstatu == '01' || record.currentstatu == '00'">
            &nbsp;
            <a @click="submitItem(record,'complete')" :disabled="!canEdit">{{ $t("submit") }}</a>
            &nbsp;
            <a-popconfirm
                v-if="data.length>1"
                title="Sure to delete?"
                @confirm="() => onDelete(record)"
                :disabled="!canOperating"
            >
              <a :disabled="!canOperating">{{ $t("delete") }}</a>
            </a-popconfirm>
            &nbsp;
          </span>
          <span v-if="record.currentstatu == '02'">
            &nbsp;
            <a @click="passItem(record,true)" :disabled="!canPase">{{ $t("pass") }}</a>
            &nbsp;
            <a @click="passItem(record,false)" :disabled="!canPase">{{ $t("unPass") }}</a>
            &nbsp;
          </span>
          <span v-if="record.currentstatu == '08'">
            &nbsp;
            <a @click="() => showReason(record.id)">{{ $t("showReason") }}</a>
            &nbsp;
          </span>
          <span v-if="record.currentstatu == '03'">
            &nbsp;
            <a-badge :count="record.makeNum">
              <a @click="() => submitItem(record,'real')" :disabled="!canOperating">{{ $t("samplePreparation") }}</a>
            </a-badge>
            &nbsp;
          </span>
        </div>
      </template>
    </a-table>
    <sub-task-info @subTaskInfo="startProcess" ref="subTask"></sub-task-info>
    <submitting :title="$t('submitting')" ref="submitting"></submitting>
    <refuse-alert ref="refuseAlert" :modalTitle="$t('unPass')" @confirmFun="confirmFun"></refuse-alert>
  </div>
</template>

<script>
import util from "@/components/publib/util";
import Submitting from "@/components/publib/submitting";
import SubTaskInfo from "@/components/task/processHandle/subTaskInfo";
import RefuseAlert from "@/components/publib/refuseAlert";
import {Icon} from "ant-design-vue";

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: util.alicdnIcon,
});

export default {
  name: "processStep1New",
  components: {RefuseAlert, SubTaskInfo, Submitting,IconFont},
  props: {
    process: Object
  },
  data() {
    this.cacheData = [];
    return {
      tableLoad: false,
      data: [],
      columns: [],
      searchInput: null,
      searchedColumn: '',
      columnNames: [],
      selectedRowKeys: [],
      selectedRows: [],
      scroll: {x: 1500},
      editingKey: '',
      subs: [],
      curFlag: "01",
      subId: "00",
      operators : {},
      editObj: {
        arrindex: "",
        initsample: "",
        samplename: "",
        species: "",
        tissue: "",
        samplemsg: "",
        samplestatu: "",
        tissuenumber: 0,
        bloodvolume: 0,
        concentration: 0,
        samplevolume: 0,
        totalnumber: 0,
        celllife: "",
        cellsort: "",
        databasetype: "",
      }
    };
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    sampleInitChange : function (record){
      record.samplemsg = "";
      record.samplestatu = "";
      record.databasetype = "";
    },
    batchUnPass : function (){
      this.$(this.$refs.refuseAlert.$el).modal('show');
    },
    showReason: function (id) {
      var _this = this;
      this.$axios.post("/task/process/showStopReason", {detailId: id}).then(function (res) {
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$error({
            title: _this.$t("reason"),
            content: res.data.retMap.reason
          });
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    confirmFun : function (reason,remark){
      console.log(reason,remark);
      this.$(this.$refs.refuseAlert.$el).modal("hide");
      var postData = {
        processId: this.process.id,
        datas: JSON.stringify(this.selectedRows),
        type: "unPass",
        reason : reason,
        remark : remark
      };
      var _this = this;
      _this.$(_this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/refuseInput",postData).then(function (res){
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        // _this.$("#submitting").modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    passItem : function (record,flag){
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      if (flag){
        this.submitData("pass");
      }else {
        // this.submitData("unPass");
        this.$(this.$refs.refuseAlert.$el).modal("show");
      }
    },
    submitItem: function (record,flag) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.submitData(flag);
    },
    tmpSaveData: function () {
      var _this = this;
      Object.keys(this.editObj).forEach(function (key) {
        // console.log(key,_this.editObj[key]);
        for (var i = 0; i < _this.data.length; i++) {
          var selData = _this.data[i];
          if (selData.currentstatu == "01" && _this.selectedRowKeys.indexOf(selData.key) != -1
              && !util.isNull(_this.editObj[key])
          ) {
            selData[key] = _this.editObj[key];
          }
        }
      });
    },
    deleteInputs: function () {
      var _this = this;
      _this.$(_this.$refs.submitting.$el).modal("show");
      var postData = {
        inputIds: this.selectedRowKeys
      }
      this.$axios.post("/task/process/deleteInput", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res) {
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        // _this.$("#submitting").modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    isDisabled: function (record) {
      if (!this.canEdit) {
        return true;
      }
      if (record.currentstatu == "02"
          || record.currentstatu == "03"
          || record.currentstatu == "08"
      ) {
        return true;
      }
      return false;
    },
    downLoad: function () {
      var postData = {
        processId: this.process.id,
        inputIds: JSON.stringify(this.selectedRowKeys)
      }
      var _this = this;
      this.$axios({
        url: "/task/process/downloadSampleInput",
        method: 'post',
        data: postData,
        responseType: 'blob'
      }).then(function (res) {
        let data = res.data;
        if (!data) {
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', '样品录入.xls')
        document.body.appendChild(a)
        a.click() //执行下载
        window.URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
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
    colIsDisabed: function (sampleType, col) {
      if (col == "sampleindex") {
        return true;
      }
      if (
          (
              col == "tissuenumber"
              || col == "bloodvolume"
          )
          && sampleType != "02"
      ) {
        return true;
      } else if (
          (
              col == "concentration"
              || col == "samplevolume"
              || col == "totalnumber"
          )
          && sampleType == "02") {
        return true;
      } else if (
          (
              col == "cellsort"
              || col == "celllife"
          )
          && sampleType != "03"
      ) {
        return true;
      }
      return false;
    },
    subTaskInfo: function () {
      this.$(this.$refs.subTask.$el).modal("show");
      // this.$("#subTaskInfo").modal("show");
    },
    showSubTask: function (subId) {
      // this.$router.push({name:"processDetail",query:{subId : subId}});
      this.subId = subId;
      this.initPage();
    },
    startProcess: function (subProcessName, remarks) {
      this.$(this.$refs.subTask.$el).modal("hide");
      var postData = {
        datas: JSON.stringify(this.selectedRows),
        processId: this.process.id,
        type: "complete",
        subProcessName: subProcessName,
        remarks: remarks
      }

      var _this = this;
      this.$(this.$refs.submitting.$el).modal("show");
      // this.$("#submitting").modal("show");
      this.$axios.post("/task/process/startSubTask", postData).then(function (res) {
        // _this.$("#submitting").modal("hide");
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
        }
      }).catch(function (res) {
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        // _this.$("#submitting").modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    submitData: function (type) {
      var _this = this;
      this.data.forEach(dat => {
        if (dat.species == 'other') {
          dat.species = dat.otherSpecies
        }
      });
      var postData = {
        processId: this.process.id,
        datas: JSON.stringify(this.data),
        type: type
      }
      if (type != "tmp") {
        _this.selectedRows.forEach(dat => {
          if (dat.species == 'other') {
            dat.species = dat.otherSpecies
          }
        })
        postData.datas = JSON.stringify(_this.selectedRows)
      }
      // this.$("#submitting").modal("show");

      if (type == "complete"){
        if (!this.checkNull(this.selectedRows)){
          return ;
        }
      }

      this.$(this.$refs.submitting.$el).modal("show");
      this.$axios.post("/task/process/commitDatas", postData).then(function (res) {
        _this.$(_this.$refs.submitting.$el).modal("hide");
        if (res.data.code != "200") {
          if (res.data.code == "E560") {
            var errMsg = _this.$t("sampleIndex") + _this.$t("repeat") + "：";
            for (var i = 0; i < res.data.retMap.sameList.length; i++) {
              var same = res.data.retMap.sameList[i];
              errMsg += same.sampleindex + ","
            }
            _this.$message.error(errMsg);
            return;
          }
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.initPage();
          // if (type == "pass"){
          //   _this.$confirm({
          //     title: _this.$t("process.passTip") + _this.$t("samplePreparation") + "?",
          //     content: _this.$t("process.passContextTip") + _this.$t("samplePreparation"),
          //     onOk() {
          //       _this.submitData("real");
          //     },
          //     onCancel() {
          //       _this.initPage();
          //     },
          //     class: 'test',
          //   });
          // }else {
          //   _this.initPage();
          // }
        }
      }).catch(function (res) {
        console.log(res);
        _this.$(_this.$refs.submitting.$el).modal("hide");
        _this.$message.error(_this.$t("systemErr"));
      });
    },

    handBeforeUpload: function (file) {
      if (file.name.indexOf("样本录入-") != 0) {
        this.$message.error(this.$t("fileNameErr"));
        return false;
      }
      if (this.process.sampletype == "01" && file.name.indexOf("-核酸-") == -1) {
        this.$message.error(this.$t("fileNameErr"));
        return false;
      } else if (this.process.sampletype == "02" && file.name.indexOf("-组织-") == -1) {
        this.$message.error(this.$t("fileNameErr"));
        return false;
      } else if (this.process.sampletype == "02" && !file.name.indexOf("-组织-") == -1) {
        this.$message.error(this.$t("fileNameErr"));
        return false;
      }
      return true;
    },
    handUnaccept: function () {
      this.$message.error(this.$t("unAcceptFile"));
    },
    handUploadChange: function (dat) {
      if (dat.file.status == "done") {
        this.initPage();
      }
    },
    onDelete(record) {
      this.selectedRows = new Array();
      this.selectedRows.push(record);
      this.selectedRowKeys = new Array();
      this.selectedRowKeys.push(record.id);
      this.deleteInputs();
    },

    checkNull : function (list){
      for (var i=0; i<list.length; i++){
        var rowData = list[0];
        if (this.isNull(rowData.initsample)) {
          this.$message.error(this.$t("initSample") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.sampleindex)) {
          this.$message.error(this.$t("sampleIndex") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.samplename)) {
          this.$message.error(this.$t("sampleName") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.species)) {
          this.$message.error(this.$t("species") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.tissue)) {
          this.$message.error(this.$t("tissue") + this.$t("animal_stock_resource") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.samplemsg)) {
          this.$message.error(this.$t("sampleMsg") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.samplestatu)) {
          this.$message.error(this.$t("sampleStatu") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.databasetype)) {
          this.$message.error(this.$t("databaseType") + this.$t("not_null"));
          return false;
        }
        if (this.isNull(rowData.sequencingplatform)) {
          this.$message.error(this.$t("SequencingPlatform") + this.$t("not_null"));
          return false;
        }
      }
      return true;
    },

    isNull: function (d) {
      if (d == "" || d == null || d == undefined) {
        return true;
      }
      return false;
    },
    initPage: function () {
      this.initColumns(this.process.sampletype);
      if (util.isNull(this.process) || util.isNull(this.process.id)) {
        return;
      }
      var postData = {
        processId: this.process.id,
        curFlag: this.curFlag,
        subId: this.subId
      }
      var _this = this;
      this.tableLoad = true;
      _this.data = new Array();
      this.$axios.post("/task/process/sampleInput", postData).then(function (res) {
        // console.log(res);
        _this.tableLoad = false;
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          if (res.data.retMap.sampleInputs == undefined
              || res.data.retMap.sampleInputs == null
              || res.data.retMap.sampleInputs.length == 0) {
            // _this.handleAdd();
          } else {
            _this.editingKey = "";
            for (var i = 0; i < res.data.retMap.sampleInputs.length; i++) {
              var d = res.data.retMap.sampleInputs[i];
              d.key = d.id;
              _this.data.push(d);
            }
            _this.cacheData = _this.data.map(item => ({...item}));
            console.log(_this.data);
          }
          _this.subs = res.data.retMap.subs;
          _this.operators = res.data.retMap.operators;
          _this.selectedRows = [];
          _this.selectedRowKeys = [];
          // _this.$notification.warning({
          //   key: "step1",
          //   placement: "bottomRight",
          //   message: _this.$t("remind"),
          //   description: _this.$t('processStep1Tip'),
          //   duration: 60,
          //   getContainer: function () {
          //     return _this.$(".process-step1")[0];
          //   }
          // });
        }
      }).catch(function (res) {
        console.log(res);
        _this.tableLoad = false;
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    handleAdd: function () {
      this.editingKey = new Date().getTime();
      const newData = this.createNewRowData();
      newData.key = this.editingKey;
      newData.editable = true;
      newData.add = true;
      this.data = [...this.data, newData];
      this.cacheData = this.data.map(item => ({...item}));
    },
    createNewRowData: function () {
      return {
        index: 1,
        samplename: "",
        species: "",
        tissue: "",
        samplemsg: "",
        samplestatu: "",
        tissuenumber: 0,
        bloodvolume: 0,
        concentration: 0,
        samplevolume: 0,
        totalnumber: 0,
        celllife: "",
        cellsort: "",
        databasetype: "",
        sequencingplatform: "",
        remarks: "",
        files: []
      }
    },
    initColumns: function (type) {
      console.log(type)
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
      // /**批次*/
      // clom.push({
      //   title: this.$t("arrindex"),
      //   dataIndex: 'arrindex',
      //   width: '150px',
      //   scopedSlots: {
      //     filterDropdown: 'filterDropdown',
      //     filterIcon: 'filterIcon',
      //     customRender: 'arrindex'
      //   },
      //   onFilter: (value, record) =>
      //       record.arrindex
      //           .toString()
      //           .toLowerCase()
      //           .includes(value.toLowerCase()),
      //   onFilterDropdownVisibleChange: visible => {
      //     if (visible) {
      //       setTimeout(() => {
      //         this.searchInput.focus();
      //       }, 0);
      //     }
      //   },
      // });
      // scorllLength +=150;
      /**初始样品*/
      clom.push({
        dataIndex: 'initsample',
        width: '150px',
        slots: { title: 'initSampleTitle' },
        scopedSlots: {customRender: 'initsample'},
      });
      scorllLength += 150;
      /**样本名称*/
      clom.push({
        slots: { title: 'sampleNameTitle' },
        dataIndex: 'samplename',
        width: '150px',
        scopedSlots: {
          customRender: 'samplename',
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
        },
        onFilter: (value, record) =>
            record.samplename
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
      scorllLength += 150;
      /**样本编号*/
      clom.push({
        dataIndex: 'sampleindex',
        width: '150px',
        slots: { title: 'sampleIndexTitle' },
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'sampleindex'
        },
        onFilter: (value, record) =>
            record.sampleindex
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
      scorllLength += 150;
      /**物种*/
      clom.push({
        dataIndex: 'species',
        width: '200px',
        slots: { title: 'speciesTitle' },
        scopedSlots: {customRender: 'species'},
      });
      scorllLength += 200;
      /**组织来源*/
      clom.push({
        dataIndex: 'tissue',
        slots: { title: 'tissueTitle' },
        width: '150px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'tissue'
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
      scorllLength += 150;
      /**样本类型*/
      clom.push({
        slots: { title: 'sampleMsgTitle' },
        dataIndex: 'samplemsg',
        width: '150px',
        scopedSlots: {customRender: 'samplemsg'},
      });
      scorllLength += 150;
      /**样本状态*/
      clom.push({
        slots: { title: 'sampleStatuTitle' },
        dataIndex: 'samplestatu',
        width: '150px',
        scopedSlots: {customRender: 'samplestatu'},
      });
      scorllLength += 150;

      // if (type == "02"){
      /** 组织量（g）*/
      clom.push({
        title: this.$t("tissueNumber") + "（g）",
        dataIndex: 'tissuenumber',
        width: '130px',
        scopedSlots: {customRender: 'tissuenumber'},
      });
      scorllLength += 130;
      // }
      // if (type == "02"){
      /** 血液体积(ml)*/
      clom.push({
        title: this.$t("bloodVolume") + "(ml)",
        dataIndex: 'bloodvolume',
        width: '130px',
        scopedSlots: {customRender: 'bloodvolume'},
      });
      scorllLength += 130;
      // }
      // if (type != "02"){
      /** 浓度(ng/ul)/（细胞个数/μl) */
      clom.push({
        title: "浓度",
        dataIndex: 'concentration',
        width: '250px',
        scopedSlots: {customRender: 'concentration'},
      });
      scorllLength += 250;
      // }
      // if (type != "02"){
      /** 样本体积(ul) */
      clom.push({
        title: this.$t("sampleVolume") + "(ul)",
        dataIndex: 'samplevolume',
        width: '130px',
        scopedSlots: {customRender: 'samplevolume'},
      });
      scorllLength += 130;
      // }
      // if (type != "02"){
      /** 核酸/细胞总量（ug/细胞个数） */
      clom.push({
        title: this.totalNumberTitle,
        dataIndex: 'totalnumber',
        width: '130px',
        scopedSlots: {customRender: 'totalnumber'},
      });
      scorllLength += 130;
      // }
      // if (type == "03"){
      /** 细胞活性 */
      clom.push({
        title: this.$t("cellLife"),
        dataIndex: 'celllife',
        width: '100px',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'search',
          customRender: 'celllife'
        },
        onFilter: (value, record) => {
          if (util.isNull(record.celllife)) {
            return false;
          }
          return record.celllife
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
      });
      scorllLength += 100;
      // }
      // if (type == "03"){
      /** 细胞分选法 */
      clom.push({
        title: this.$t("cellSort"),
        dataIndex: 'cellsort',
        width: '200px',
        scopedSlots: {customRender: 'cellsort'},
      });
      scorllLength += 200;
      // }
      /**建库类型*/
      clom.push({
        slots: { title: 'databaseTypeTitle' },
        dataIndex: 'databasetype',
        width: '200px',
        scopedSlots: {customRender: 'databasetype'},
      });
      scorllLength += 200;
      /**测序平台*/
      clom.push({
        slots: { title: 'SequencingPlatformTitle' },
        dataIndex: 'sequencingplatform',
        width: '200px',
        scopedSlots: {customRender: 'sequencingplatform'},
      });
      scorllLength += 200;
      /**备注*/
      clom.push({
        title: this.$t("remarks"),
        dataIndex: 'remarks',
        width: '200px',
        scopedSlots: {customRender: 'remarks'},
      });
      scorllLength += 200;
      /**操作*/
      clom.push({
        slots: { title: 'operationTitle' },
        // title: this.$t("operation"),
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
    },
    showText: function (clo, text, ind, record) {
      if (clo == "samplemsg") {
        for (var index in this.sampletypes(record.initsample)) {
          var item = this.sampletypes[index];
          if (item.key == text) {
            return item.val;
          }
        }
      }

      if (clo == "samplestatu") {
        for (var statuIndex in this.sampleStatu(record.initsample)) {
          var statu = this.sampleStatu[statuIndex];
          if (statu.key == text) {
            return statu.val;
          }
        }
      }

      if (clo == "cellsort") {
        for (var cellSortIndex in this.cellSortMethods) {
          var cellSort = this.cellSortMethods[cellSortIndex];
          if (cellSort.key == text) {
            return cellSort.val;
          }
        }
      }

      if (clo == "databasetype") {
        for (var databaseTypeIndex in this.databaseTypes(record.initsample)) {
          var databaseType = this.databaseTypes[databaseTypeIndex];
          if (databaseType.key == text) {
            return databaseType.val;
          }
        }
      }

      if (clo == "sequencingplatform") {
        for (var seqPlantsIndex in this.seqPlants) {
          var seqPlant = this.seqPlants[seqPlantsIndex];
          if (seqPlant.key == text) {
            return seqPlant.val;
          }
        }
      }

      if (clo == "initSample") {
        for (var initSampleIndex in this.sampleInits) {
          var sampleInit = this.sampleInits[initSampleIndex];
          if (sampleInit.key == sampleInit) {
            return sampleInit.val;
          }
        }
      }

      if (clo == "index") {
        return ind + 1;
      }
      return text;
    },
    sampletypes: function (sampleType) {
      return util.sampletypes(sampleType);
    },
    sampleStatu: function (sampleType) {

      return util.sampleStatu(sampleType);
    },
    databaseTypes: function (sampleType) {
      return util.databaseTypes(sampleType);
    },
  },
  computed: {
    concentrationName: function () {
      if (this.process.sampletype == "01") {
        return this.$t("concentration") + "(ng/ul)";
      } else {
        return this.$t("concentration") + "(" + this.$t("cellNumber") + "/μl)";
      }
    },
    totalNumberTitle: function () {
      if (this.process.sampletype == "01") {
        return this.$t("nucleicAcid") + this.$t("totalNumber") + "(ug)";
      } else {
        return this.$t("cell") + this.$t("totalNumber") + "(" + this.$t("cellNumber") + ")";
      }
    },
    seqPlants: function () {
      return util.seqPlants();
    },
    sampleInits: function () {
      return util.sampleInits();
    },
    cellSortMethods: function () {
      return util.cellSortMethods();
    },
    canOperating: function () {
      if (this.process.taskstatu.startsWith("7")) {
        return false;
      }
      if (!this.$store.getters.isCurrentUser(this.process.sampleinput)
          && !this.isAdmin
      ) {
        return false;
      }
      return true;
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
        getCheckboxProps: record => ({
          props: {
            // Column configuration not to be checked
            disabled: record.currentstatu == '00'
                || record.currentstatu == '09'
                || record.currentstatu == '08',
          },
        }),
      };
    },
    cansubmit() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu != '03') {
          return true;
        }
      }
      return false;
    },
    canDivide() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (!util.isNull(this.selectedRows[item].subid)
            || this.selectedRows[item].currentstatu == "02"
            || this.selectedRows[item].currentstatu == '03'
        ) {
          return true;
        }
      }
      return false;
    },
    canDelete() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu == '02'
            || this.selectedRows[item].currentstatu == '03'
            || this.selectedRows[item].currentstatu == '08'
        ) {
          return true;
        }
      }
      return false;
    },
    canEdit: function () {
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.sampleinput)
      ) {
        return true
      }
      return false;
    },
    isCreater : function (){
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.creater)
      ) {
        return true
      }
      return false;
    },
    canPase: function () {
      if (!this.process.taskstatu.startsWith("7")
          && this.$store.getters.isCurrentUser(this.process.samplepreparation)
      ) {
        return true
      }
      return false;
    },
    disabledPass() {
      if (this.selectedRowKeys.length == 0) {
        return true;
      }
      for (var item in this.selectedRows) {
        if (this.selectedRows[item].currentstatu != '02') {
          return true;
        }
      }
      return false;
    },
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
.editable-row-operations a {
  margin-right: 8px;
}
</style>