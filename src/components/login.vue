<template>
  <div style="width: 100%">
    <div class="form-group form-contains">
      <div>
        <img src="../assets/login.png" width="100%">
      </div>
      <br/><br/><br/>
      <InputwhitName ref="loginEmail" :inp-data="loginEmailData" @updateData="updateLogin"></InputwhitName>
      <InputwhitName v-if="loginflag" ref="loginPwd" :inp-data="loginPwdData" @updateData="updateLogin"></InputwhitName>
      <div class="form-row" style="font-size: 16px">
        <div v-if="!loginflag" class="input-group input-group-sm mb-3" style="margin-top: 10px">
          <input type="text" class="form-control" :placeholder="$t('verification')" aria-label="输入验证码"
                 aria-describedby="get-verification-code" v-model="verificationCode">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary btn-primary" style="color: white" @click="getVerification"
                    type="button" id="get-verification-code">{{ $t('getverification') }}
            </button>
          </div>
        </div>
      </div>
      <div class="noPassword">
        <a @click="changeLoginMethod">{{loginflag ? "验证码登录" : "密码登录"}}</a>
      </div>
      <div class="but-div">
        <button type="button" class="btn btn-primary login-btn" @click="submitLogin">{{ $t('userLogin') }}</button>
        <br/>
        <button type="button" class="btn btn-light login-btn" @click="userRegister()">{{ $t('userRegister') }}</button>
      </div>
    </div>
    <language></language>
    <submitting :title="$t('submitting')"></submitting>
  </div>
</template>

<script>
import InputwhitName from "@/components/InputwhitName";
import Language from "@/components/language";
import Submitting from "@/components/publib/submitting";
import loginBack from "@/assets/login-back.jpg";
import util from "@/components/publib/util";

export default {
  name: "login",
  data: function () {
    return {
      errMsg: "",
      loginEmailData: {
        inputLabel: this.$t('userEmail'),
        inputType: "text",
        inputName: "loginEmail",
        checkMsg: "",
        isValid: "0"
      },
      loginPwdData: {
        inputLabel: this.$t('userPwd'),
        inputType: "password",
        inputName: "loginPwd",
        checkMsg: "",
        isValid: "0"
      },
      loginEmail: '',
      loginPwd: '',
      backgroundImage : `url(${loginBack})`,
      loginflag : true,
      verificationCode : "",
      regetSec: 120,
    }
  },
  beforeMount() {
    this.$("body").css("background-image", this.backgroundImage);
  },
  methods: {
    changeLoginMethod : function (){
      this.loginflag = !this.loginflag;
    },
    getVerification : function (){
      var _this = this;
      var reg = /^\w{3,}@cibr\.ac\.cn$/;
      if (util.isNull(this.loginEmail)){
        this.$message.error(this.$t("userEmailNull"));
        return
      }
      if (!reg.test(this.loginEmail)) {
        this.$message.error(this.$t("userEmailReg"));
        return;
      }
      this.$("#submitting").modal("show");
      this.$axios({
        method: "post",
        url: "/login/getVerification",
        params: {
          "loginEmail": this.loginEmail,
        }
      }).then(function (res) {
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.waitReCode();
          _this.codeTimer = setInterval(function () {
            _this.waitReCode();
          }, 1000);
        }
      }).catch(function (e) {
        _this.$("#submitting").modal("hide");
        console.log(e);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    waitReCode: function () {
      var codeBtn = this.$("#get-verification-code").eq(0);
      if (codeBtn.attr("disabled") == "" || codeBtn.attr("disabled") == undefined) {
        codeBtn.attr("disabled", "disabled");
      }
      if (!codeBtn.hasClass("reCode")) {
        codeBtn.addClass("reCode");
      }
      codeBtn.text(this.regetSec + "秒后重新获取");
      this.regetSec--;
      if (this.regetSec < 1) {
        clearInterval(this.codeTimer);
        codeBtn.removeAttr("disabled");
        codeBtn.removeClass("reCode");
        codeBtn.text(this.$t('getverification'));
      }
    },
    submitLogin: function () {
      var _this = this;
      this.$axios({
        method: "post",
        url: "/login",
        params: {
          "loginEmail": this.loginEmail,
          "password": this.$md5(this.loginPwd),
          "verification" : this.verificationCode,
          "loginFlag" : this.loginflag
        }
      }).then(function (res) {
        console.log(res);
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$cookies.set("token", res.data.retMap.token, '1d');
          _this.$cookies.set("user", res.data.retMap.user, '1d');
          _this.$store.commit("saveUser", res.data.retMap.user);
          _this.$("body").css("background-image", "none");
          _this.$router.push("/home");
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    updateLogin: function (data) {
      this[data.ipkey] = data.ipvalue;
    },
    userRegister: function () {
      this.$router.push("/register");
    }
  },
  components: {Submitting, Language, InputwhitName}
}
</script>

<style scoped>
.login-div {
  display: inline;
}
.reCode {
  color: black !important;
}
.language-select {
  margin-top: 100px;
}

.btn-link {
  color: white !important;
}

.noPassword {
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  color: #4e555b;
}
</style>