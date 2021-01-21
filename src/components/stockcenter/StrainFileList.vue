<template>
  <div class="modal fade"
       id="strainFileListModal"
       tabindex="-1"
       role="dialog"
       aria-labelledby="strainFileListLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="strainFileListLabel">{{$t("fileList")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div style="width: 100%;height: 200px;"
               v-if="isFeeder"
          >
            <a-upload-dragger
                name="file"
                :showUploadList="false"
                :action="uploadUrl"
                :headers="uploadHeader"
                @change="fileChange"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </a-upload-dragger>
          </div>
          <template v-if="fileList.length == 0">
            <a-empty style="margin-top: 20px" />
          </template>
          <template v-else>
            <a-card :style="{ marginTop: '10px' }" hoverable
                    v-for="item in fileList" :key="item.id"
            >
              <a slot="title" href="#" @click="downloadFile(item.id,item.realname)">{{item.realname}}</a>
              <div slot="extra">
                <a-popconfirm
                    v-if="isFeeder"
                    :title="$t('areyousureDelete')"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="confirmDelete(item.id)"
                >
                  <a-icon type="delete"/>
                </a-popconfirm>
              </div>
            </a-card>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/components/publib/util";

export default {
  name: "StrainFileList",
  props : {
    detailId : String
  },
  data : function (){
    return{
      fileList : [],
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    confirmDelete : function (fileId){
      var _this = this;
      this.$axios.post("/file/delete",{fileId : fileId}).then(function (res){
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.initPage();
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    downloadFile : function (fileId,realname){
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
    fileChange : function (evnt){
      console.log(evnt);
      if (evnt.file.status == "done"){
        this.$message.success(this.$t("commitSucc"));
        this.initPage();
      }
    },
    initPage : function (){
      console.log(this.detailId);
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
  },
  computed : {
    uploadUrl: function () {
      return util.commonUploadUrl();
    },
    uploadHeader: function () {
      return {token: this.$cookies.get('token'), detailId: this.detailId}
    },
    isFeeder : function (){
      return this.$store.getters.isFeeder;
    },
  }
}
</script>

<style scoped>

</style>