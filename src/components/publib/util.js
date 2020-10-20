import i18n from "@/i18n";
import $axios from "axios";
import $ from "jquery";
import {message as $message} from "ant-design-vue";

var util = {
    alicdnIcon : "//at.alicdn.com/t/font_2031063_1mutltdz0v2.js",
    isNull: function (obj) {
        if (obj == null) {
            return true;
        }
        if (obj == undefined) {
            return true;
        }
        if (obj == "") {
            return true
        }
        if (obj.length == 0) {
            return true;
        }
        // if (obj >= 0){
        //     return true;
        // }
        return false;
    },
    sampletypes : function (sampletype){
        var array = new Array();
        if (sampletype == "01"){
            /** 核酸样本类型 */
            array.push({key:"01",val:"基因组DNA"});
            array.push({key:"02",val:"total RNA"});
            array.push({key:"03",val:"PCR产物"});
            array.push({key:"04",val:"chip-seq DNA"});
            array.push({key:"05",val:"单细胞扩增产物"});
            array.push({key:"06",val:"FFPE"});
            array.push({key:"00",val:"其它"});
        }else if (sampletype == "02"){
            /** 组织样本类型 */
            array.push({key:"21",val:"组织"});
            array.push({key:"22",val:"全血"});
            array.push({key:"23",val:"石蜡组织"});
            array.push({key:"24",val:"血清"});
            array.push({key:"25",val:"口腔拭子"});
            array.push({key:"26",val:"菌体"});
            array.push({key:"20",val:"其它"});
        }else if (sampletype == "03"){
            /** 细胞样本类型 */
            array.push({key:"41",val:"单细胞悬液"})
            array.push({key:"40",val:"其他"})
        }
        return array;
    },
    sampleStatu : function (sampletype){
        var array = new Array();
        if (sampletype == "01"){
            /** 核酸样本类型 */
            array.push({key:"01",val:"溶于纯水"});
            array.push({key:"02",val:"溶于TE"});
            array.push({key:"03",val:"溶于无Rnase水"});
            array.push({key:"04",val:"溶于EB"});
            array.push({key:"05",val:"干粉"});
            array.push({key:"00",val:"其它"});
        }else if (sampletype == "02"){
            /** 组织样本类型 */
            array.push({key:"21",val:"速冻组织"});
            array.push({key:"22",val:"活体"});
            array.push({key:"23",val:"RNAlater保存"});
            array.push({key:"24",val:"Trlzol保存"});
            array.push({key:"20",val:"其它"});
        }else if (sampletype == "03"){
            /** 细胞样本类型 */
            array.push({key:"41",val:"裂解液"});
            array.push({key:"42",val:"液氮速冻"});
            array.push({key:"40",val:"其它"});
        }
        return array;
    },
    cellSortMethods : function (){
        return[
            {key:"01",val:"过筛网"},
            {key:"02",val:"磁珠分选"},
            {key:"03",val:"口吸管法"},
            {key:"04",val:"BD流式分选"},
            {key:"05",val:"NanoCellect 流式分选"}
        ]
    },
    databaseTypes : function (sampletype){
        var array = new Array();
        if (sampletype == "01"){
            /** 核酸样本类型 */
            array.push({key:"01",val:"DNA常规小片段"});
            array.push({key:"02",val:"DNA非常规小片段"});
            array.push({key:"03",val:"人外显子"});
            array.push({key:"04",val:"PCR-free文库"});
            array.push({key:"05",val:"真核普通转录组"});
            array.push({key:"06",val:"真核链特异性"});
            array.push({key:"07",val:"LncRNA"});
        }else if (sampletype == "02"){
            /** 组织样本类型 */
            array.push({key:"21",val:"10X单细胞转录组"});
            array.push({key:"22",val:"10X空间转录组"});
            array.push({key:"23",val:"10X ATAC"});
            array.push({key:"24",val:"smart-seq"});
            array.push({key:"25",val:"ATAC"});
            array.push({key:"26",val:"HI-C"});
            array.push({key:"27",val:"DNA常规小片段"});
            array.push({key:"28",val:"DNA非常规小片段"});
            array.push({key:"29",val:"人外显子"});
            array.push({key:"30",val:"PCR-free文库"});
            array.push({key:"31",val:"真核普通转录组"});
            array.push({key:"32",val:"真核链特异性"});
            array.push({key:"33",val:"LncRNA"});
        }else if (sampletype == "03"){
            /** 细胞样本类型 */
            array.push({key:"41",val:"10X单细胞转录组"});
            array.push({key:"42",val:"10X ATAC"});
            array.push({key:"43",val:"smart-seq"});
            array.push({key:"44",val:"ATAC"});
            array.push({key:"45",val:"HI-C"});
        }
        return array;
    },
    seqPlants : function (){
        var array = new Array();
        array.push({key:"01",val:"Hiseq-SE50"});
        array.push({key:"02",val:"Hiseq-PE150"});
        array.push({key:"03",val:"Hiseq-PE250"});
        array.push({key:"00",val:"其它"});
        return array;
    },
    extractmethods : function (){
        var array = new Array();
        array.push({key:"01",val:"柱提法"});
        array.push({key:"02",val:"磁珠提法"});
        array.push({key:"00",val:"其它"});
        return array;
    },
    checkresults : function (){
        var array = new Array();
        array.push({key:"01",val:"合格"});
        array.push({key:"02",val:"风险"});
        array.push({key:"03",val:"不合格"});
        return array;
    },
    sampleInits : function (){
        var array = new Array();
        array.push({key:"01",val:i18n.t("nucleicAcid") + i18n.t("sample")});
        array.push({key:"02",val:i18n.t("tissue") + i18n.t("sample")});
        array.push({key:"03",val:i18n.t("cell") + i18n.t("sample")});
        return array;
    },
    commonUploadUrl : function (){
        return $axios.defaults.baseURL + '/file/import/uploadFile';
    },
    commonHandleUploadChange : function (ret){
        if (ret.file.status == "uploading"){
            $("#submitting").modal("show");
        }else {
            $("#submitting").modal("hide");
            if (ret.file.status == "error"){
                $message.error(i18n.t("systemErr"));
            }else if (ret.file.status == "done"){
                window.location.reload();
            }
        }
    },
    downLoad : function (postData,url,fileName){
        $axios({
            url : url,
            data : postData,
            method : 'post',
            responseType : 'blob'
        }).then(function (res){
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
    }
}

export default util;