<template>
  <div style="width: 100%">
    <div class="form-group form-contains">
      <div>
        <img src="../assets/login.png" width="100%">
      </div>

      <InputwhitName ref="registerName" :inp-data="registerNameData" @updateData="updateRegister"></InputwhitName>

      <InputwhitName ref="registerEmail" :inp-data="registerEmailData" @updateData="updateRegister"></InputwhitName>

      <InputwhitName ref="registerPwd" :inp-data="registerPwdData" @updateData="updateRegister"></InputwhitName>

      <InputwhitName ref="registerPwd2" :inp-data="registerPwd2Data" @updateData="updateRegister"></InputwhitName>

      <div class="form-row ">
        <a-tooltip placement="topLeft" :title="$t('groupTip')">
          <a-select style="width: 95%"
                    :placeholder="$t('selectGroup')"
                    v-model="usergroup">
            <a-select-option value="">
              {{ $t('selectGroup') }}
            </a-select-option>
            <a-select-option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.groupname }}
            </a-select-option>
          </a-select>
        </a-tooltip>
      </div>

      <div class="form-row input-group mb-3" style="margin-top: 20px">
        <input type="text" class="form-control" :placeholder="$t('verification')" aria-label="输入验证码"
               aria-describedby="get-verification-code" v-model="verificationCode">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary btn-primary" style="color: white" @click="getVerification"
                  type="button" id="get-verification-code">{{ $t('getverification') }}
          </button>
        </div>
      </div>
      <div :class="codeShowClass">
        {{ codeStatu }}
      </div>
      <div class="but-div">
        <button type="button" class="btn btn-primary login-btn" @click="userRegister()">{{ $t('userRegister') }}
        </button>
        <br/>
        <button type="button" class="btn btn-light login-btn" @click="userLogin()">{{ $t('userLogin') }}</button>
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

export default {
  name: "register",
  data: function () {
    return {
      errMsg: "",
      toastsMsg: '',
      codeTimer: '',
      regetSec: 120,
      verificationCode: "",
      codeShowClass: "",
      codeStatu: "",
      registerNameData: {
        inputLabel: this.$t('realName'),
        inputType: "text",
        inputName: "registerName",
        checkMsg: "",
        isValid: "0"
      },
      registerEmailData: {
        inputLabel: this.$t('userEmail'),
        inputType: "text",
        inputName: "registerEmail",
        checkMsg: "",
        isValid: "0"
      },
      registerPwdData: {
        inputLabel: this.$t('userPwd'),
        inputType: "password",
        inputName: "registerPwd",
        checkMsg: "",
        isValid: "0"
      },
      registerPwd2Data: {
        inputLabel: this.$t('userPwd2'),
        inputType: "password",
        inputName: "registerPwd2",
        checkMsg: "",
        isValid: "0"
      },
      registerName: '',
      registerEmail: '',
      registerPwd: '',
      registerPwd2: '',
      usergroup: "",
      groups: []
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods: {
    initPage: function () {
      var _this = this;
      this.$axios.post("/register/getGroups").then(function (res) {
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.groups = res.data.retMap.groups;
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    userLogin: function () {
      this.$router.push("/login");
    },
    updateRegister: function (data) {
      this[data.ipkey] = data.ipvalue;
      // this.checkData();
    },
    getVerification: function () {
      var _this = this;
      var reg = /^\w{3,}@cibr\.ac\.cn$/;
      var regnibs = /^\w{3,}@nibs\.ac\.cn$/;
      if (!reg.test(this.registerEmail)) {
        if (!regnibs.test(this.registerEmail)) {
          this.registerEmailData.isValid = "2";
          this.registerEmailData.checkMsg = this.$t('userEmailErr');
          return;
        }
      }

      this.$("#submitting").modal("show");
      this.$axios({
        method: "post",
        url: "/register/getVerification",
        params: {
          "registerName": this.registerName,
          "registerEmail": this.registerEmail,
          "registerPwd": this.$md5(this.registerPwd)
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
    checkData: function () {
      return this.registerNameData.isValid == "1"
          && this.registerEmailData.isValid == "1"
          && this.registerPwdData.isValid == "1"
          && this.registerPwd2Data.isValid == "1";
    },
    userRegister: function () {
      if (this.verificationServerCode != this.verificationCode) {
        this.codeShowClass = "invalid-feedback";
        this.codeStatu = this.$t("verificationStatuOK");
      } else {
        this.codeShowClass = "invalid-feedback";
        this.codeStatu = this.$t("verificationStatuErr");
      }
      if (this.usergroup == "") {
        this.$message.error(this.$t("selectGroup"));
        return;
      }
      var _this = this;
      this.$("#submitting").modal("show");
      this.$axios({
        method: "post",
        url: "/register/submit",
        params: {
          "registerName": this.registerName,
          "registerEmail": this.registerEmail,
          "registerPwd": this.$md5(this.registerPwd),
          "verificationCode": this.verificationCode,
          "usergroup": this.usergroup
        }
      }).then(function (res) {
        _this.$("#submitting").modal("hide");
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$message.error(_this.$t("registerSucc"));
          _this.$router.push("/login");
        }
      }).catch(function (res) {
        _this.$("#submitting").modal("hide");
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      });
    }
  },
  watch: {
    registerName(newValue, oldValue) {//校验用户名是否正确
      if (newValue == "" && oldValue != "") {
        //0-无提示 1-正确提示 2-错误提示
        this.registerNameData.isValid = "2";
        this.registerNameData.checkMsg = this.$t('userNameNull');
      } else if (newValue != "") {
        var uPattern = /^[0-9a-zA-Z\u4E00-\u9FA5]{2,16}$/
        if (!uPattern.test(newValue)) {
          this.registerNameData.isValid = "2";
          this.registerNameData.checkMsg = this.$t('userNameErr');
          return;
        }
        this.registerNameData.isValid = "1";
        this.registerNameData.checkMsg = '';
      }
    },
    registerEmail(newValue, oldValue) {//校验邮箱是否正确
      if (newValue == "" && oldValue != "") {
        //0-无提示 1-正确提示 2-错误提示
        this.registerEmailData.isValid = "2";
        this.registerEmailData.checkMsg = this.$t('userEmailNull');
      } else if (newValue != "") {
        var reg = /^\w{3,}@cibr\.ac\.cn$/;
        var nibs = /^\w{3,}@nibs\.ac\.cn$/;
        if (!reg.test(newValue)) {
          if (!nibs.test(newValue)) {
            this.registerEmailData.isValid = "2";
            this.registerEmailData.checkMsg = this.$t('userEmailErr');
            return;
          }
        }
        this.registerEmailData.isValid = "1";
        this.registerEmailData.checkMsg = '';
      }
    },
    registerPwd(newValue, oldValue) {//校验密码是否正确
      if (newValue == "" && oldValue != "") {
        //0-无提示 1-正确提示 2-错误提示
        this.registerPwdData.isValid = "2";
        this.registerPwdData.checkMsg = this.$t('userPwdNull');
      } else if (newValue != "") {
        var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        if (newValue == this.registerPwd2) {
          this.registerPwd2Data.isValid = "1";
          this.registerPwd2Data.checkMsg = '';
        } else if (this.registerPwd2 != "") {
          this.registerPwd2Data.isValid = "2";
          this.registerPwd2Data.checkMsg = this.$t('userPwd2NotSame');
        }
        if (!reg.test(newValue)) {
          this.registerPwdData.isValid = "2";
          this.registerPwdData.checkMsg = this.$t('userPwdRegErr');
          return;
        }
        this.registerPwdData.isValid = "1";
        this.registerPwdData.checkMsg = '';
      }
    },
    registerPwd2(newValue, oldValue) {//校验密码是否正确
      if (newValue == "" && oldValue != "") {
        //0-无提示 1-正确提示 2-错误提示
        this.registerPwd2Data.isValid = "2";
        this.registerPwd2Data.checkMsg = this.$t('userPwd2Null');
      } else if (newValue != "") {
        if (newValue != this.registerPwd) {
          this.registerPwd2Data.isValid = "2";
          this.registerPwd2Data.checkMsg = this.$t('userPwd2NotSame');
          return;
        }
        this.registerPwd2Data.isValid = "1";
        this.registerPwd2Data.checkMsg = '';
      }
    }
  },
  components: {Submitting, Language, InputwhitName}
}
</script>

<style scoped>
.reCode {
  color: black !important;
}

.language-select {
  margin-top: 100px;
}

.btn-link {
  color: white;
}
</style>