<template>
  <div class="modal fade" id="showFileList" tabindex="-1" role="dialog" aria-labelledby="showFileListLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="showFileListLabel">{{$t("fileList")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <a-list item-layout="horizontal" :data-source="fileList" :bordered="true">
            <a-list-item slot="renderItem" slot-scope="item" >
              <a @click="downLoadFile(item.id,item.realname)">{{ item.realname }}</a>
            </a-list-item>
          </a-list>
<!--          <div v-if="fileList.length>0">-->
<!--            <a-tooltip v-for="file in fileList" :key="file.id">-->
<!--              <template slot="title">-->
<!--                {{$t("downLoadTip")}}-->
<!--              </template>-->
<!--              {{ file.realname }}-->
<!--            </a-tooltip>-->
<!--          </div>-->
<!--          <div v-else>-->
<!--            无-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/components/publib/util";

export default {
  name: "showFilelist",
  props : {
    detailId : String
  },
  data : function(){
    return {
      fileList : []
    }
  },
  beforeMount() {
    this.initPage();
  },
  activated() {
    this.initPage();
  },
  methods : {
    downLoadFile : function (fileId,realname){
      console.log(fileId,realname);
      var postData = {
        fileId:fileId
      }
      this.$axios({
        url : "/file/download",
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
        a.setAttribute('download',realname);
        document.body.appendChild(a)
        a.click() //执行下载
        window.URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
      })
    },
    initPage : function (){
      if (util.isNull(this.detailId)){
        return ;
      }
      var _this = this;
      this.$axios.post("/file/showFileList",{detailId:this.detailId}).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.fileList = res.data.retMap.fileList;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch : {
    detailId(){
      this.initPage();
    }
  }
}
</script>

<style scoped>

</style>