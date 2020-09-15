<template>
  <div style="text-align: left">
    <br/><br/>
    <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item :label="$t('userHead')">
        <div>
          <a-tooltip placement="topLeft">
            <template slot="title">
              <span>点击更换头像</span>
            </template>
            <a-upload
                name="file"
                :showUploadList="false"
                :action="this.$axios.defaults.baseURL + 'file/import/userImage'"
                :headers="{token : this.$cookies.get('token')}"
                @change="headUpload"
            >
              <a-avatar :size="50" :src="userHeadSrc"/>
            </a-upload>
          </a-tooltip>
        </div>
      </a-form-item>

      <a-form-item :label="$t('userName')">
        <a-input id="userName" v-model="user.name" disabled/>
      </a-form-item>
      <a-form-item :label="$t('userPwd')">
        <a-input-password id="userPwd" v-model="user.password" :disabled="!isEditPwd"/>
        <a-input-password id="userPwd2" v-model="passwd2" v-if="isEditPwd"/>
        <a-input v-model="vid" placeholder="输入验证码" v-if="isEditPwd"/>
        <a-button v-if="isEditPwd" @click="comfirmPwd">{{$t("confirm")}}</a-button>
        <a-button v-if="isEditPwd" @click="cancelClick">{{$t("cancel")}}</a-button>
        <a-button @click="editPassword" v-if="!isEditPwd">修改密码</a-button>
      </a-form-item>
      <a-form-item :label="$t('userEmail')">
        <a-input id="userEmail" v-model="user.email" disabled/>
      </a-form-item>
      <a-form-item :label="$t('role')">
        <a-tag v-for="role in roles" :key="role.id" color="#87d068">
          {{role.rolename}}
        </a-tag>
      </a-form-item>
    </a-form>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";
export default {
  name: "personalInfo",
  components: {Submitting},
  data : function (){
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      user : {},
      isEditPwd : false,
      passwd2 : "",
      vid:""
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      this.isEditPwd = false;
      this.user = this.$store.getters.getUser;
    },
    headUpload : function (info){
      console.log(info);
      if (info.file.status == "done"){
        window.location.reload();
      }
    },
    cancelClick : function (){
      window.location.reload();
    },
    comfirmPwd : function (){
      if (util.isNull(this.user.password)){
        this.$message.error(this.$t("userPwdNull"));
        return ;
      }
      if (util.isNull(this.passwd2)){
        this.$message.error(this.$t("userPwd2Null"));
        return ;
      }
      if (this.user.password != this.passwd2){
        this.$message.error(this.$t("userPwd2NotSame"));
        return ;
      }
      if (util.isNull(this.vid)){
        this.$message.error(this.$t("verification"));
        return
      }
      var _this = this;
      var post = {
        password : this.$md5(this.passwd2),
        vid : this.vid
      }
      this.$("#submitting").modal("show");
      this.$axios.post("/personal/editPassword/confirm",post).then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success("修改成功！");
          _this.isEditPwd = false;
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    editPassword : function (){
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios.post("/personal/editPwd/sendVid").then(function (res){
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.success("验证码已发送至您的邮箱！");
          _this.isEditPwd = true;
          _this.user.password = "";
        }
      }).catch(function (res){
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  computed : {
    roles : function (){
      return this.$store.getters.getUser.roles;
    },
    userId : function (){
      return this.$store.getters.getUser.id;
    },
    userHeadSrc : function (){
      return this.$axios.defaults.baseURL + 'user/userHead/' + this.userId + '.png';
    }
  }
}
</script>

<style scoped>

</style>