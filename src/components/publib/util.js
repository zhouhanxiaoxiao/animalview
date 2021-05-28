import i18n from "@/i18n";
import $axios from "axios";
import $ from "jquery";
import {message as $message} from "ant-design-vue";
import pinyin from 'js-pinyin';

var util = {
    alicdnIcon: "//at.alicdn.com/t/font_2031063_n09nbpzcld.js",
    casLoginUrl : "http://119.90.33.35:8065/?service=",
    casOutUrl : "http://119.90.33.35:8065/logout",
    localUrl : "http://seq.cibr.ac.cn/",
    // localUrl : "http://119.90.33.35:3566/",
    initSampleList : [],
    sampleTypeList : [],
    sampleStatuList : [],
    cellSortList : [],
    databaseList : [],
    seqPlantList : [],
    extractList : [],
    checkResultList : [],
    upPlantList : [],
    SUCCESS : "200",
    catchErr : function (res){
        console.log(res);
        this.error("systemErr");
    },
    success : function (){
        $message.success(i18n.t("commitSucc"));
    },
    error : function (message){
        $message.error(i18n.t(message));
    },
    initSelect : function (selectMap){
        this.initSampleList = selectMap.initSamples;
        this.sampleTypeList = selectMap.sampleTypes;
        this.sampleStatuList = selectMap.sampleStatus;
        this.cellSortList = selectMap.cellSorts;
        this.databaseList = selectMap.database;
        this.seqPlantList = selectMap.seqPlants;
        this.extractList = selectMap.extracts;
        this.checkResultList = selectMap.checkResults;
        this.upPlantList = selectMap.upPlants;
    },

    convertToPy : function (val){
      return pinyin.getFullChars(val);
    },
    onFilter : function (val1,val2){
      if (val1 == undefined || val2 == undefined){
          return false;
      }else {
          return val1.indexOf(val2) === 0;
      }
    },
    sorter : function (a,b){
      if (a == undefined){
          return 1;
      }
      if (b == undefined){
          return -1
      }
      var index = 0;
      a = this.convertToPy(a);
      b = this.convertToPy(b);
      while (index < a.length && index < b.length){
          var chara = a.codePointAt(index);
          var charb = b.codePointAt(index);
          if (chara == charb){
              index ++;
              continue;
          }else {
              return chara - charb;
          }
      }
      return chara.length - charb.length;
    },
    isNull: function (obj) {
        if (obj == null) {
            return true;
        }
        if (obj == undefined) {
            return true;
        }
        if (obj === "" ) {
            return true
        }
        if (obj.length == 0) {
            return true;
        }
        return false;
    },
    sampletypes: function (sampletype) {
        var array = new Array();
        // if (sampletype == "01") {
        //     /** 核酸样本类型 */
        //     array.push({key: "01", val: "基因组DNA"});
        //     array.push({key: "02", val: "total RNA"});
        //     array.push({key: "03", val: "PCR产物"});
        //     array.push({key: "04", val: "chip-seq DNA"});
        //     array.push({key: "05", val: "单细胞扩增产物"});
        //     array.push({key: "06", val: "FFPE"});
        //     array.push({key: "00", val: "其它"});
        // } else if (sampletype == "02") {
        //     /** 组织样本类型 */
        //     array.push({key: "21", val: "组织"});
        //     array.push({key: "22", val: "全血"});
        //     array.push({key: "23", val: "石蜡组织"});
        //     array.push({key: "24", val: "血清"});
        //     array.push({key: "25", val: "口腔拭子"});
        //     array.push({key: "26", val: "菌体"});
        //     array.push({key: "20", val: "其它"});
        // } else if (sampletype == "03") {
        //     /** 细胞样本类型 */
        //     array.push({key: "41", val: "单细胞悬液"})
        //     array.push({key: "40", val: "其他"})
        // }
        for (var i = 0; i < this.sampleTypeList.length; i++){
            var item = this.sampleTypeList[i];
            if (item.parentid == sampletype){
                array.push({ key: item.id, val: item.name });
            }
        }
        return array;
    },
    sampleStatu: function (sampletype) {
        var array = new Array();
        // if (sampletype == "01") {
        //     /** 核酸样本类型 */
        //     array.push({key: "01", val: "溶于纯水"});
        //     array.push({key: "02", val: "溶于TE"});
        //     array.push({key: "03", val: "溶于无Rnase水"});
        //     array.push({key: "04", val: "溶于EB"});
        //     array.push({key: "05", val: "干粉"});
        //     array.push({key: "00", val: "其它"});
        // } else if (sampletype == "02") {
        //     /** 组织样本类型 */
        //     array.push({key: "21", val: "速冻组织"});
        //     array.push({key: "22", val: "活体"});
        //     array.push({key: "23", val: "RNAlater保存"});
        //     array.push({key: "24", val: "Trlzol保存"});
        //     array.push({key: "20", val: "其它"});
        // } else if (sampletype == "03") {
        //     /** 细胞样本类型 */
        //     array.push({key: "41", val: "裂解液"});
        //     array.push({key: "42", val: "液氮速冻"});
        //     array.push({key: "40", val: "其它"});
        // }
        for (var i = 0; i < this.sampleStatuList.length; i++){
            var item = this.sampleStatuList[i];
            if (item.parentid == sampletype){
                array.push({ key: item.id, val: item.name });
            }
        }
        return array;
    },
    cellSortMethods: function () {
        // return [
        //     {key: "01", val: "过筛网"},
        //     {key: "02", val: "磁珠分选"},
        //     {key: "03", val: "口吸管法"},
        //     {key: "04", val: "BD流式分选"},
        //     {key: "05", val: "NanoCellect 流式分选"}
        // ]
        var array = new Array();
        for (var i = 0; i < this.cellSortList.length; i++){
            var item = this.cellSortList[i];
            array.push({ key: item.id, val: item.name });
        }
        return array;
    },
    databaseTypes: function (sampletype) {
        var array = new Array();
        // if (sampletype == "01") {
        //     /** 核酸样本类型 */
        //     array.push({key: "01", val: "DNA常规小片段"});
        //     array.push({key: "02", val: "DNA非常规小片段"});
        //     array.push({key: "03", val: "人外显子"});
        //     array.push({key: "04", val: "PCR-free文库"});
        //     array.push({key: "05", val: "真核普通转录组"});
        //     array.push({key: "06", val: "真核链特异性"});
        //     array.push({key: "07", val: "LncRNA"});
        // } else if (sampletype == "02") {
        //     /** 组织样本类型 */
        //     array.push({key: "21", val: "10X单细胞转录组"});
        //     array.push({key: "34", val: "10X VDJ"});
        //     array.push({key: "22", val: "10X空间转录组"});
        //     array.push({key: "23", val: "10X ATAC"});
        //     array.push({key: "24", val: "smart-seq"});
        //     array.push({key: "25", val: "ATAC"});
        //     array.push({key: "26", val: "HI-C"});
        //     array.push({key: "27", val: "DNA常规小片段"});
        //     array.push({key: "28", val: "DNA非常规小片段"});
        //     array.push({key: "29", val: "人外显子"});
        //     array.push({key: "30", val: "PCR-free文库"});
        //     array.push({key: "31", val: "真核普通转录组"});
        //     array.push({key: "32", val: "真核链特异性"});
        //     array.push({key: "33", val: "LncRNA"});
        //     array.push({key: "35", val: "WGS"});
        // } else if (sampletype == "03") {
        //     /** 细胞样本类型 */
        //     array.push({key: "41", val: "10X单细胞转录组"});
        //     array.push({key: "46", val: "10X VDJ"});
        //     array.push({key: "42", val: "10X ATAC"});
        //     array.push({key: "43", val: "smart-seq"});
        //     array.push({key: "44", val: "ATAC"});
        //     array.push({key: "45", val: "HI-C"});
        // }
        for (var i = 0; i < this.databaseList.length; i++){
            var item = this.databaseList[i];
            if (item.parentid == sampletype){
                array.push({ key: item.id, val: item.name });
            }
        }
        return array;
    },
    sequencePlant: function () {
        var array = new Array();
        for (var i = 0; i < this.upPlantList.length; i++){
            var item = this.upPlantList[i];
            array.push({ key: item.id, val: item.name });
        }
        return array;
    },
    seqPlants: function () {
        var array = new Array();
        // array.push({key: "01", val: "Hiseq-SE50"});
        // array.push({key: "02", val: "Hiseq-PE150"});
        // array.push({key: "03", val: "Hiseq-PE250"});
        // array.push({key: "00", val: "其它"});
        for (var i = 0; i < this.seqPlantList.length; i++){
            var item = this.seqPlantList[i];
            array.push({ key: item.id, val: item.name });
        }
        return array;
    },
    extractmethods: function () {
        var array = new Array();
        // array.push({key: "01", val: "柱提法"});
        // array.push({key: "02", val: "磁珠提法"});
        // array.push({key: "00", val: "其它"});
        for (var i = 0; i < this.extractList.length; i++){
            var item = this.extractList[i];
            array.push({ key: item.id, val: item.name });
        }
        return array;
    },
    checkresults: function () {
        var array = new Array();
        // array.push({key: "01", val: "合格"});
        // array.push({key: "02", val: "风险"});
        // array.push({key: "03", val: "不合格"});
        for (var i = 0; i < this.checkResultList.length; i++){
            var item = this.checkResultList[i];
            array.push({ key: item.id, val: item.name });
        }
        return array;
    },
    sampleInits: function () {
        var array = new Array();
        // array.push({key: "01", val: i18n.t("nucleicAcid") + i18n.t("sample")});
        // array.push({key: "02", val: i18n.t("tissue") + i18n.t("sample")});
        // array.push({key: "03", val: i18n.t("cell") + i18n.t("sample")});
        for (var i = 0; i < this.initSampleList.length; i++){
            var item = this.initSampleList[i];
            array.push({ key: item.id, val: item.name });
        }
        return array;
    },
    commonUploadUrl: function () {
        return $axios.defaults.baseURL + 'file/import/uploadFile';
    },
    commonPost : function (url,postData,callBak,submitting){
        $(submitting).modal("show");
        $axios.post(url,postData).then(function (res){
            $(submitting).modal("hide");
            if (res.data.code != "200"){
                $message.error(i18n.t(res.data.code));
            }else {
                $message.success(i18n.t("commitSucc"));
                callBak();
            }
        }).catch(function (res){
            $(submitting).modal("hide");
            console.log(res);
            $message.error(i18n.t("systemErr"));
        });
    },
    commonHandleUploadChange: function (ret) {
        if (ret.file.status == "uploading") {
            $("#submitting").modal("show");
        } else {
            $("#submitting").modal("hide");
            if (ret.file.status == "error") {
                $message.error(i18n.t("systemErr"));
            } else if (ret.file.status == "done") {
                window.location.reload();
            }
        }
    },
    downLoad: function (postData, url, fileName) {
        $axios({
            url: url,
            data: postData,
            method: 'post',
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
            a.setAttribute('download', fileName);
            document.body.appendChild(a)
            a.click() //执行下载
            window.URL.revokeObjectURL(a.href)
            document.body.removeChild(a)
        })
    },
    getuserIdByRole : function (users,role){
        for (var i=0;i<users.length;i++){
            for (var j=0;j<users[i].roles.length;j++){
                if (users[i].roles[j].roletype == role){
                    return users[i].id;
                }
            }
        }
        return "";
    },
    getuserIdByName : function (users,name){
        for (var i=0;i<users.length;i++){
            if (users[i].name == name){
                return users[i].id;
            }
        }
        return "";
    },
    isAnimalSystem : function (flag){
        if (flag == "animal" || flag == "local"){
            return true;
        }
        return false;
    },
    isSeqproSystem : function (flag){
        if (flag == "seqpro" || flag == "local"){
            return true;
        }
        return false;
    },
    initInputCols : function (){
        var scorllLength = 0;
        var clom = new Array();
        /**序号*/
        clom.push({
            title: i18n.t("index"),
            dataIndex: 'index',
            width: '50px',
            fixed: 'left',
            scopedSlots: {customRender: 'index'},
        });
        scorllLength += 50;
        // /**批次*/
        // clom.push({
        //   title: i18n.t("arrindex"),
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
            width: '200px',
            scopedSlots: {
                customRender: 'samplename',
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
            },
            // sorter: (a, b) => {
            //     var count = 0;
            //     while (count < a.length && count < b.length){
            //
            //     }
            // },
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
        scorllLength += 200;
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
            title: i18n.t("tissueNumber") + "（g）",
            dataIndex: 'tissuenumber',
            width: '130px',
            scopedSlots: {customRender: 'tissuenumber'},
        });
        scorllLength += 130;
        // }
        // if (type == "02"){
        /** 血液体积(ml)*/
        clom.push({
            title: i18n.t("bloodVolume") + "(ml)",
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
            title: i18n.t("sampleVolume") + "(ul)",
            dataIndex: 'samplevolume',
            width: '130px',
            scopedSlots: {customRender: 'samplevolume'},
        });
        scorllLength += 130;
        // }
        // if (type != "02"){
        /** 核酸/细胞总量（ug/细胞个数） */
        clom.push({
            title: "核酸/细胞总量（ug/细胞个数）",
            dataIndex: 'totalnumber',
            width: '130px',
            scopedSlots: {customRender: 'totalnumber'},
        });
        scorllLength += 130;
        // }
        // if (type == "03"){
        /** 细胞活性 */
        clom.push({
            title: i18n.t("cellLife"),
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
            title: i18n.t("cellSort"),
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

        /**建库类型*/
        clom.push({
            slots: { title: 'uploadplatformTitle' },
            dataIndex: 'uploadplatform',
            width: '200px',
            scopedSlots: {customRender: 'uploadplatform'},
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
            title: i18n.t("remarks"),
            dataIndex: 'remarks',
            width: '400px',
            scopedSlots: {customRender: 'remarks'},
        });
        scorllLength += 400;
        /**操作*/
        clom.push({
            slots: { title: 'operationTitle' },
            // title: i18n.t("operation"),
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 150;
        var columnNames = new Array();
        for (var item in clom) {
            columnNames.push(clom[item].dataIndex);
        }
        return {
            clom : clom,
            scorllLength : scorllLength,
            columnNames : columnNames
        }
    },
    initMakesCols : function (){
        var scorllLength = 0;
        var clom = new Array();
        /**序号*/
        clom.push({
            title: i18n.t("index"),
            dataIndex: 'index',
            width: '50px',
            fixed: 'left',
            scopedSlots: {customRender: 'index'},
        });
        scorllLength += 50;
        /**初始样本*/
        clom.push({
            title: i18n.t("initSample"),
            dataIndex: 'initsample',
            width: '150px',
            scopedSlots: { customRender: 'initsample' },
        });
        scorllLength +=150;
        /**转化样本*/
        clom.push({
            // title: i18n.t("transformSample"),
            slots : {title : "transformSampleTitle"},
            dataIndex: 'transform',
            width: '150px',
            scopedSlots: { customRender: 'transform' },
        });
        scorllLength +=150;
        /**样本名称*/
        clom.push({
            title: i18n.t("sampleName"),
            dataIndex: 'samplename',
            width: '200px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'samplename'
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
        scorllLength += 200;
        /**样本编号*/
        clom.push({
            title: i18n.t("sampleIndex"),
            dataIndex: 'selfnumber',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'selfnumber'
            },
            onFilter: (value, record) => {
                if (util.isNull(record.selfnumber)){
                    return false;
                }
                return record.selfnumber
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
        scorllLength += 150;
        /**样本衍生编号*/
        clom.push({
            dataIndex: 'derivativeindex',
            width: '150px',
            slots : {title : "derivativeindexTitle"},
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'derivativeindex'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.derivativeindex)){
                    return false;
                }
                return record.derivativeindex
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
        scorllLength += 150;
        /**物种*/
        clom.push({
            title: i18n.t("species"),
            dataIndex: 'species',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'species'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.species)){
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
        });
        scorllLength += 150;
        /**组织来源*/
        clom.push({
            title: i18n.t("tissue") + i18n.t("animal_stock_resource"),
            dataIndex: 'tissue',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'tissue'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.tissue)){
                    return false;
                }
                return record.tissue
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
        scorllLength += 150;
        /**检测日期*/
        clom.push({
            slots : {title : "testDateTitle"},
            dataIndex: 'testdate',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'testdate'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.testdate)){
                    return false;
                }
                return record.testdate
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
        scorllLength += 150;
        /** 浓度(ng/ul)/（细胞个数/μl) */
        clom.push({
            // title: this.concentrationName,
            slots : {title : "concentrationTitle"},
            dataIndex: 'concentration',
            width: '250px',
            scopedSlots: {customRender: 'concentration'},
        });
        scorllLength += 250;
        /** 样本体积(ul) */
        clom.push({
            // title: i18n.t("sampleVolume") + "(ul)",
            slots : {title : "sampleVolumeTitle"},
            dataIndex: 'samplevolume',
            width: '150px',
            scopedSlots: {customRender: 'samplevolume'},
        });
        scorllLength += 150;
        /** 核酸/细胞总量（ug/细胞个数） */
        clom.push({
            // title: this.totalNumberTitle,
            slots : {title : "totalNumberTitle"},
            dataIndex: 'totalnumber',
            width: '150px',
            scopedSlots: {customRender: 'totalnumber'},
        });
        scorllLength += 150;

        /** 260/280 */
        clom.push({
            title: "260/280",
            dataIndex: 'm260280',
            width: '150px',
            scopedSlots: {customRender: 'm260280'},
        });
        scorllLength += 150;
        /** 260/230 */
        clom.push({
            title: "260/230",
            dataIndex: 'm260230',
            width: '150px',
            scopedSlots: {customRender: 'm260230'},
        });
        scorllLength += 150;
        /** RQN */
        clom.push({
            title: "RQN",
            dataIndex: 'rqn',
            width: '150px',
            scopedSlots: {customRender: 'rqn'},
        });
        scorllLength += 150;

        // if (type == "03") {
        /** 细胞活性 */
        clom.push({
            // title: i18n.t("cellLife"),
            slots : {title : "cellLifeTitle"},
            dataIndex: 'celllife',
            width: '200px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'celllife'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.celllife)){
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
        scorllLength += 200;
        // }
        // if (type == "03") {
        /** 细胞分选法 */
        clom.push({
            title: i18n.t("cellSort"),
            dataIndex: 'cellsort',
            width: '200px',
            scopedSlots: {customRender: 'cellsort'},
        });
        scorllLength += 200;
        // }
        // if (type == "02") {
        /** 提取方法 */
        clom.push({
            title: i18n.t("extractMethod"),
            dataIndex: 'extractmethod',
            width: '150px',
            scopedSlots: {customRender: 'extractmethod'},
        });
        // }
        scorllLength += 150;
        /** 检测结果 */
        clom.push({
            // title: i18n.t("checkResult"),
            slots : {title : "checkResultTitle"},
            dataIndex: 'checkresult',
            width: '150px',
            scopedSlots: {customRender: 'checkresult'},
        });
        scorllLength += 150;
        /** 检测备注 */
        clom.push({
            title: i18n.t("checkRemarks"),
            dataIndex: 'checkremarks',
            width: '300px',
            scopedSlots: {customRender: 'checkremarks'},
        });
        scorllLength += 300;
        /** 检测员 */
        clom.push({
            // title: i18n.t("checkUser"),
            slots : {title : "checkUserTitle"},
            dataIndex: 'checkuser',
            width: '150px',
            scopedSlots: {customRender: 'checkuser'},
        });
        scorllLength += 150;
        /** 审核人 */
        clom.push({
            // title: i18n.t("reviewer"),
            slots : {title : "reviewerTitle"},
            dataIndex: 'reviewer',
            width: '150px',
            scopedSlots: {customRender: 'reviewer'},
        });
        scorllLength += 150;
        /**建库类型*/
        clom.push({
            // title: i18n.t("databaseType"),
            slots : {title : "databaseTypeTitle"},
            dataIndex: 'databasetype',
            width: '200px',
            scopedSlots: {customRender: 'databasetype'},
        });
        scorllLength += 200;
        /**测序平台*/
        clom.push({
            title: i18n.t("SequencingPlatform"),
            dataIndex: 'sequencingplatform',
            width: '200px',
            scopedSlots: {customRender: 'sequencingplatform'},
        });
        scorllLength += 200;
        /**剩余量*/
        clom.push({
            title: i18n.t("remaining"),
            dataIndex: 'remaining',
            width: '200px',
            scopedSlots: {customRender: 'remaining'},
        });
        scorllLength += 200;
        /**备注*/
        clom.push({
            title: i18n.t("remarks"),
            dataIndex: 'remarks',
            width: '300px',
            scopedSlots: {customRender: 'remarks'},
        });
        scorllLength += 300;
        /**上传*/
        clom.push({
            title: i18n.t("upload"),
            dataIndex: 'upload',
            width: '200px',
            scopedSlots: {customRender: 'upload'},
        });
        scorllLength += 200;

        /**操作*/
        clom.push({
            // title: i18n.t("operation"),
            slots : {title : "operationTitle"},
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 150;

        return {
            clom : clom,
            scorllLength : scorllLength
        }
    },

    initLibsClom : function (){
        var scorllLength = 0;
        var clom = new Array();
        /**序号*/
        clom.push({
            title: i18n.t("index"),
            dataIndex: 'index',
            width: '50px',
            fixed: 'left',
            scopedSlots: {customRender: 'index'},
        });
        scorllLength += 50;
        /**建库时间*/
        clom.push({
            // title: i18n.t("createdbtime"),
            slots : {title : "createdbtimeTitle"},
            dataIndex: 'createdbtime',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'createdbtime'
            },
            onFilter: (value, record) => {
                if (util.isNull(record.createdbtime)) {
                    return false;
                }
                return record.createdbtime
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
        scorllLength += 150;
        /**样本编号*/
        clom.push({
            title: i18n.t("sampleIndex"),
            dataIndex: 'selfnumber',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'selfnumber'
            },
            onFilter: (value, record) => {
                if (util.isNull(record.selfnumber)) {
                    return false;
                }
                return record.selfnumber
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
        scorllLength += 150;
        /**中间产物编号*/
        clom.push({
            title: i18n.t("middleIndex"),
            dataIndex: 'middleindex',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'middleindex'
            },
            onFilter: (value, record) => {
                if (util.isNull(record.middleindex)) {
                    return false;
                }
                return record.middleindex
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
        scorllLength += 150;
        /**样本名称*/
        clom.push({
            title: i18n.t("sampleName"),
            dataIndex: 'samplename',
            width: '200px',
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
        });
        scorllLength += 200;
        /**物种*/
        clom.push({
            title: i18n.t("species"),
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
        });
        scorllLength += 150;

        /**组织来源*/
        clom.push({
            title: i18n.t("tissue") + i18n.t("animal_stock_resource"),
            dataIndex: 'tissue',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'tissue'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.tissue)){
                    return false;
                }
                return record.tissue
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
        scorllLength += 150;

        /** 浓度(ng/ul)/（细胞个数/μl) */
        clom.push({
            title: "浓度",
            dataIndex: 'concentration',
            width: '250px',
            scopedSlots: {customRender: 'concentration'},
        });
        scorllLength += 250;
        /** 核酸/细胞总量（ug/细胞个数） */
        clom.push({
            title: "核酸/细胞总量（ug/细胞个数）",
            dataIndex: 'totalnumber',
            width: '150px',
            scopedSlots: {customRender: 'totalnumber'},
        });
        scorllLength += 150;
        /** 细胞活性 */
        clom.push({
            title: i18n.t("cellLife"),
            dataIndex: 'celllife',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
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
        scorllLength += 150;
        /** 样本使用量(ug)/细胞使用量（细胞个数） */
        clom.push({
            // title: i18n.t("useNumber"),
            slots : {title : "useNumberTitle"},
            dataIndex: 'usenumber',
            width: '200px',
            scopedSlots: {customRender: 'usenumber'},
        });
        scorllLength += 200;
        /** 片段大小（bp） */
        clom.push({
            // title: i18n.t("partsize"),
            slots : {title : "partsizeTitle"},
            dataIndex: 'partsize',
            width: '150px',
            scopedSlots: {customRender: 'partsize'},

        });
        scorllLength += 150;
        /** index */
        clom.push({
            // title: "index",
            slots : {title : "indexTitle"},
            dataIndex: 'libindex',
            width: '150px',
            scopedSlots: {customRender: 'libindex'},
        });
        scorllLength += 150;
        /** barcode */
        clom.push({
            title: "barcode",
            dataIndex: 'libbarcode',
            width: '150px',
            scopedSlots: {customRender: 'libbarcode'},
        });
        scorllLength += 150;
        /** 常规PCR循环数 */
        clom.push({
            // title: i18n.t("cyclenumber"),
            slots : {title : "cyclenumberTitle"},
            dataIndex: 'cyclenumber',
            width: '150px',
            scopedSlots: {customRender: 'cyclenumber'},
        });
        scorllLength += 150;
        /** 文库类型 */
        clom.push({
            // title: i18n.t("databasetype2"),
            slots : {title : "databasetype2Title"},
            dataIndex: 'databasetype',
            width: '200px',
            scopedSlots: {customRender: 'databasetype'},
        });
        scorllLength += 200;
        /** 文库编号 */
        clom.push({
            // title: i18n.t("databaseindex"),
            slots : {title : "databaseindexTitle"},
            dataIndex: 'databaseindex',
            width: '200px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'databaseindex'
            },
            onFilter: (value, record) => {
                if (util.isNull(record.databaseindex)) {
                    return false;
                }
                return record.databaseindex
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
        scorllLength += 200;
        /** 建库人 */
        clom.push({
            // title: i18n.t("createdbuser"),
            slots : {title : "createdbuserTitle"},
            dataIndex: 'createdbuser',
            width: '150px',
            scopedSlots: {customRender: 'createdbuser'},
        });
        scorllLength += 150;
        /** 审核人 */
        clom.push({
            // title: i18n.t("reviewer"),
            slots : {title : "reviewerTitle"},
            dataIndex: 'reviewer',
            width: '150px',
            scopedSlots: {customRender: 'reviewer'},
        });
        scorllLength += 150;
        /** Qubit浓度 */
        clom.push({
            // title: i18n.t("qbit"),
            slots : {title : "qbitTitle"},
            dataIndex: 'qbit',
            width: '150px',
            scopedSlots: {customRender: 'qbit'},
        });
        scorllLength += 150;
        /** 文库体积（ul） */
        clom.push({
            // title: i18n.t("libsize"),
            slots : {title : "libsizeTitle"},
            dataIndex: 'libsize',
            width: '150px',
            scopedSlots: {customRender: 'libsize'},
        });
        scorllLength += 150;
        /** 文库体积（ul） */
        clom.push({
            // title: i18n.t("seqmethods"),
            slots : {title : "seqmethodsTitle"},
            dataIndex: 'seqmethods',
            width: '150px',
            scopedSlots: {customRender: 'seqmethods'},
        });
        scorllLength += 150;
        /** 上机数据量 */
        clom.push({
            // title: i18n.t("uploadsize"),
            slots : {title : "uploadsizeTitle"},
            dataIndex: 'uploadsize',
            width: '150px',
            scopedSlots: {customRender: 'uploadsize'},
        });
        scorllLength += 150;
        /** 数据量单位 */
        clom.push({
            // title: i18n.t("databaseunit"),
            slots : {title : "databaseunitTitle"},
            dataIndex: 'databaseunit',
            width: '150px',
            scopedSlots: {customRender: 'databaseunit'},
        });
        scorllLength += 150;
        /** 上机备注 */
        clom.push({
            title: i18n.t("uploadremark"),
            dataIndex: 'uploadremark',
            width: '300px',
            scopedSlots: {customRender: 'uploadremark'},
        });
        scorllLength += 300;
        /** 建库备注 */
        clom.push({
            title: i18n.t("libremark"),
            dataIndex: 'libremark',
            width: '300px',
            scopedSlots: {customRender: 'libremark'},
        });
        scorllLength += 300;
        /**上传*/
        clom.push({
            title: i18n.t("upload"),
            dataIndex: 'upload',
            width: '200px',
            scopedSlots: {customRender: 'upload'},
        });
        scorllLength += 200;
        /**操作*/
        clom.push({
            slots : {title : "operationTitle"},
            // title: i18n.t("operation"),
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 150;

        return {
            clom : clom,
            scorllLength : scorllLength
        }
    },
    initDisClom : function (){
        var scorllLength = 0;
        var clom = new Array();
        /**序号*/
        clom.push({
            title: i18n.t("index"),
            dataIndex: 'index',
            width: '50px',
            fixed: 'left',
            scopedSlots: {customRender: 'index'},
        });
        scorllLength += 50;
        /**样本编号*/
        clom.push({
            title: i18n.t("sampleIndex"),
            dataIndex: 'sampleindex',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'sampleindex'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.sampleindex)){
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
        });
        scorllLength += 150;
        /**样本名称*/
        clom.push({
            title: i18n.t("sampleName"),
            dataIndex: 'samplename',
            width: '200px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'samplename'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.samplename)){
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
        });
        scorllLength += 200;
        /**物种*/
        clom.push({
            title: i18n.t("species"),
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
        });
        scorllLength += 150;

        /**组织来源*/
        clom.push({
            title: i18n.t("tissue") + i18n.t("animal_stock_resource"),
            dataIndex: 'tissue',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'tissue'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.tissue)){
                    return false;
                }
                return record.tissue
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
        scorllLength += 150;
        // if (this.isJYZXZZ){
        //   /**供应商数据账号*/
        //   clom.push({
        //     title: i18n.t("support") + i18n.t("dateaccount"),
        //     dataIndex: 'superaccount',
        //     width: '150px',
        //     scopedSlots: {
        //       filterDropdown: 'filterDropdown',
        //       filterIcon: 'filterIcon',
        //       customRender: 'superaccount'
        //     },
        //     onFilter: (value, record) =>{
        //       if (util.isNull(record.superaccount)){
        //         return false;
        //       }
        //       return record.superaccount
        //           .toString()
        //           .toLowerCase()
        //           .includes(value.toLowerCase());
        //     },
        //     onFilterDropdownVisibleChange: visible => {
        //       if (visible) {
        //         setTimeout(() => {
        //           this.searchInput.focus();
        //         }, 0);
        //       }
        //     },
        //   });
        //   scorllLength += 150;
        //   /**供应商数据密码*/
        //   clom.push({
        //     title:i18n.t("support") + i18n.t("datepassword"),
        //     dataIndex: 'superpwd',
        //     width: '150px',
        //     scopedSlots: {customRender: 'superpwd'},
        //   });
        //   scorllLength += 150;
        //   /**供应商数据目录*/
        //   clom.push({
        //     title: i18n.t("support") +i18n.t("datepath"),
        //     dataIndex: 'superpath',
        //     width: '300px',
        //     scopedSlots: {
        //       filterDropdown: 'filterDropdown',
        //       filterIcon: 'filterIcon',
        //       customRender: 'superpath'
        //     },
        //     onFilter: (value, record) =>{
        //       if (util.isNull(record.superpath)){
        //         return false;
        //       }
        //       return record.superpath
        //           .toString()
        //           .toLowerCase()
        //           .includes(value.toLowerCase());
        //     },
        //     onFilterDropdownVisibleChange: visible => {
        //       if (visible) {
        //         setTimeout(() => {
        //           this.searchInput.focus();
        //         }, 0);
        //       }
        //     },
        //   });
        //   scorllLength += 300;
        // }

        /**数据账号*/
        clom.push({
            title: i18n.t("dateaccount"),
            dataIndex: 'dateaccount',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'dateaccount'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.dateaccount)){
                    return false;
                }
                return record.dateaccount
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
        scorllLength += 150;
        /**数据密码*/
        clom.push({
            title: i18n.t("datepassword"),
            dataIndex: 'datepassword',
            width: '150px',
            scopedSlots: {customRender: 'datepassword'},
        });
        scorllLength += 150;
        /**数据目录*/
        clom.push({
            title: i18n.t("datepath"),
            dataIndex: 'datepath',
            width: '400px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'datepath'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.datepath)){
                    return false;
                }
                return record.datepath
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
        scorllLength += 400;
        /**测序平台*/
        clom.push({
            title: i18n.t("SequencingPlatform"),
            dataIndex: 'sequencingplatform',
            width: '200px',
            scopedSlots: {customRender: 'sequencingplatform'},
        });
        scorllLength += 200;

        /**备注*/
        clom.push({
            // title: i18n.t("overDate"),
            slots : {title : "overDateTip"},
            dataIndex: 'lasttime',
            width: '300px',
            scopedSlots: {customRender: 'lasttime'},
        });
        scorllLength += 300;

        /**备注*/
        clom.push({
            title: i18n.t("remarks"),
            dataIndex: 'remarks',
            width: '200px',
            scopedSlots: {customRender: 'remarks'},
        });
        scorllLength += 200;

        /**操作*/
        clom.push({
            // title: i18n.t("operation"),
            slots : {title : "operationTitle"},
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 150;

        return {
            clom :clom,
            scorllLength : scorllLength
        }
    },
    initBioClom : function (){
        var scorllLength = 0;
        var clom = new Array();
        /**序号*/
        clom.push({
            title: i18n.t("index"),
            dataIndex: 'index',
            width: '50px',
            fixed: 'left',
            scopedSlots: {customRender: 'index'},
        });
        scorllLength += 50;
        /**样本编号*/
        clom.push({
            title: i18n.t("sampleIndex"),
            dataIndex: 'sampleindex',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'sampleindex'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.sampleindex)){
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
        });
        scorllLength += 150;
        /**样本名称*/
        clom.push({
            title: i18n.t("sampleName"),
            dataIndex: 'samplename',
            width: '200px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'samplename'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.samplename)){
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
        });
        scorllLength += 200;

        /**物种*/
        clom.push({
            title: i18n.t("species"),
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
        });
        scorllLength += 150;

        /**组织来源*/
        clom.push({
            title: i18n.t("tissue") + i18n.t("animal_stock_resource"),
            dataIndex: 'tissue',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'tissue'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.tissue)){
                    return false;
                }
                return record.tissue
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
        scorllLength += 150;
        // /**结果主路径*/
        // clom.push({
        //   title: i18n.t("resultpath"),
        //   dataIndex: 'resultpath',
        //   width: '300px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'resultpath'
        //   },
        //   onFilter: (value, record) =>{
        //     if (util.isNull(record.resultpath)){
        //       return false;
        //     }
        //     return record.resultpath
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
        // });
        // scorllLength += 300;
        /**报告地址*/
        clom.push({
            title: i18n.t("reportpath"),
            dataIndex: 'reportpath',
            width: '600px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'reportpath'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.reportpath)){
                    return false;
                }
                return record.reportpath
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
        scorllLength += 600;
        // /**分析流程/参数*/
        // clom.push({
        //   title: i18n.t("args"),
        //   dataIndex: 'args',
        //   width: '300px',
        //   scopedSlots: {
        //     filterDropdown: 'filterDropdown',
        //     filterIcon: 'filterIcon',
        //     customRender: 'args'
        //   },
        //   onFilter: (value, record) =>{
        //     if (util.isNull(record.args)){
        //       return false;
        //     }
        //     return record.args
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
        // });
        // scorllLength += 300;
        /**分析人*/
        clom.push({
            title: i18n.t("analyst"),
            dataIndex: 'analyst',
            width: '150px',
            scopedSlots: {customRender: 'analyst'},
        });
        scorllLength += 150;
        /**备注*/
        clom.push({
            title: i18n.t("remarks"),
            dataIndex: 'remarks',
            width: '200px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'remarks'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.remarks)){
                    return false;
                }
                return record.remarks
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
        scorllLength += 200;

        /**上传*/
        clom.push({
            title: i18n.t("upload"),
            dataIndex: 'upload',
            width: '200px',
            scopedSlots: {customRender: 'upload'},
        });
        scorllLength += 200;

        /**操作*/
        clom.push({
            title: i18n.t("operation"),
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 150;

        return {
            clom : clom,
            scorllLength : scorllLength
        }
    },
    initConfrimClom : function (){
        var scorllLength = 0;
        var clom = new Array();
        /**序号*/
        clom.push({
            title: i18n.t("index"),
            dataIndex: 'index',
            width: '50px',
            fixed: 'left',
            scopedSlots: {customRender: 'index'},
        });
        scorllLength += 50;

        /**建库时间*/
        clom.push({
            title: i18n.t("createdbtime"),
            dataIndex: 'createdbtime',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'createdbtime'
            },
            onFilter: (value, record) => {
                if (util.isNull(record.createdbtime)) {
                    return false;
                }
                return record.createdbtime
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
        scorllLength += 150;

        /**样本编号*/
        clom.push({
            title: i18n.t("sampleIndex"),
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
        });
        scorllLength += 150;

        /**样本名称*/
        clom.push({
            title: i18n.t("sampleName"),
            dataIndex: 'samplename',
            width: '200px',
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
        });
        scorllLength += 200;
        /**物种*/
        clom.push({
            title: i18n.t("species"),
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
        });
        scorllLength += 150;

        /**组织来源*/
        clom.push({
            title: i18n.t("tissue") + i18n.t("animal_stock_resource"),
            dataIndex: 'tissue',
            width: '150px',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'tissue'
            },
            onFilter: (value, record) =>{
                if (util.isNull(record.tissue)){
                    return false;
                }
                return record.tissue
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
        scorllLength += 150;

        /** 文库编号 */
        clom.push({
            title: i18n.t("databaseindex"),
            dataIndex: 'libindex',
            width: '200px',
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
        });
        scorllLength += 200;

        /** 文库类型 */
        clom.push({
            title: i18n.t("databasetype2"),
            dataIndex: 'libtype',
            width: '200px',
            scopedSlots: {customRender: 'libtype'},
        });
        scorllLength += 200;

        /** Index序列 */
        clom.push({
            title: "index序列",
            dataIndex: 'confirmindex',
            width: '200px',
            scopedSlots: {customRender: 'confirmindex'},
        });
        scorllLength += 200;

        /** Peak size(bp) */
        clom.push({
            title: "Peak size(bp)",
            dataIndex: 'peaksize',
            width: '200px',
            scopedSlots: {customRender: 'peaksize'},
        });
        scorllLength += 200;

        /** QPCR摩尔浓度(nmol/L) */
        clom.push({
            // title: "QPCR摩尔浓度(nmol/L)",
            slots : {title : "qpcrTitle"},
            dataIndex: 'qpcr',
            width: '200px',
            scopedSlots: {customRender: 'qpcr'},
        });
        scorllLength += 200;

        /** 峰图描述 */
        clom.push({
            // title: "峰图描述",
            slots : {title : "peakDescTitle"},
            dataIndex: 'peakdesc',
            width: '200px',
            scopedSlots: {customRender: 'peakdesc'},
        });
        scorllLength += 200;

        /** 库检综合结果 */
        clom.push({
            // title: "库检综合结果",
            slots : {title : "checkResultTitle"},
            dataIndex: 'libcheckresult',
            width: '200px',
            scopedSlots: {customRender: 'libcheckresult'},
        });
        scorllLength += 200;

        /** 测序策略 */
        clom.push({
            // title: i18n.t("seqmethods"),
            slots : {title : "seqmethodsTitle"},
            dataIndex: 'seqmethod',
            width: '200px',
            scopedSlots: {customRender: 'seqmethod'},
        });
        scorllLength += 200;

        /** 上机平台 */
        clom.push({
            slots : {title : "sequenceTitle"},
            dataIndex: 'seqplant',
            width: '200px',
            scopedSlots: {customRender: 'seqplant'},
        });
        scorllLength += 200;

        /** 上机数据量 */
        clom.push({
            // title: i18n.t("uploadsize"),
            slots : {title : "uploadsizeTitle"},
            dataIndex: 'uploadsize',
            width: '150px',
            scopedSlots: {customRender: 'uploadsize'},
        });
        scorllLength += 150;
        /** 数据量单位 */
        clom.push({
            // title: i18n.t("databaseunit"),
            slots : {title : "databaseunitTitle"},
            dataIndex: 'uploadunit',
            width: '150px',
            scopedSlots: {customRender: 'uploadunit'},
        });
        scorllLength += 150;

        /** 数据量单位 */
        clom.push({
            title: i18n.t("canDivide"),
            dataIndex: 'candivide',
            width: '150px',
            scopedSlots: {customRender: 'candivide'},
        });
        scorllLength += 150;

        /** 上机备注 */
        clom.push({
            title: i18n.t("uploadremark"),
            dataIndex: 'uploadremark',
            width: '300px',
            scopedSlots: {customRender: 'uploadremark'},
        });
        scorllLength += 300;

        /**上传*/
        clom.push({
            title: i18n.t("upload"),
            dataIndex: 'upload',
            width: '200px',
            scopedSlots: {customRender: 'upload'},
        });
        scorllLength += 200;

        /**操作*/
        clom.push({
            // title: i18n.t("operation"),
            slots : {title : "operationTitle"},
            dataIndex: 'operation',
            width: '150px',
            fixed: 'right',
            scopedSlots: {customRender: 'operation'},
        });
        scorllLength += 150;

        return {
            clom : clom,
            scorllLength :scorllLength
        }
    }
}

export default util;