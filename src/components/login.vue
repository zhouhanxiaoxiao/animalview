<template>
    <div style="width: 100%">
        <div class="form-group form-contains">
            <div>
                <img src="../assets/login.png" width="100%">
            </div>
            <br/><br/><br/>
            <InputwhitName ref="loginEmail" :inp-data="loginEmailData" @updateData="updateLogin"></InputwhitName>
            <InputwhitName ref="loginPwd" :inp-data="loginPwdData" @updateData="updateLogin"></InputwhitName>
            <div class="but-div">
                <button type="button" class="btn btn-primary login-btn" @click="submitLogin">{{$t('userLogin')}}</button>
                <br/>
                <button type="button" class="btn btn-light login-btn" @click="userRegister()">{{$t('userRegister')}}</button>
            </div>
        </div>
        <language></language>
    </div>
</template>

<script>
    import InputwhitName from "@/components/InputwhitName";
    import Language from "@/components/language";

    export default {
        name: "login",
        data:function(){
          return{
              errMsg:"",
              loginEmailData:{
                  inputLabel : this.$t('userEmail'),
                  inputType : "text",
                  inputName : "loginEmail",
                  checkMsg : "",
                  isValid : "0"
              },
              loginPwdData:{
                  inputLabel : this.$t('userPwd'),
                  inputType : "password",
                  inputName : "loginPwd",
                  checkMsg : "",
                  isValid : "0"
              },
              loginEmail:'',
              loginPwd:''
          }
        },
        methods:{
            submitLogin : function () {
                var _this = this;
                this.$axios({
                    method : "post",
                    url : "/login",
                    params : {
                        "loginEmail" : this.loginEmail,
                        "password" : this.$md5(this.loginPwd)
                    }
                }).then(function (res) {
                    console.log(res);
                    if (res.data.code != "200"){
                        _this.$toast(_this.$t(res.data.code));
                    }else {
                        _this.$cookies.set("token",res.data.retMap.token,'1d');
                        _this.$cookies.set("user",res.data.retMap.user,'1d');
                        _this.$("body").css("background-image","none");
                        _this.$router.push("/home");
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$toast(_this.$t("systemErr"));
                });
            },
            updateLogin:function (data) {
                this[data.ipkey] = data.ipvalue;
            },
            userRegister : function () {
                this.$router.push("/register");
            }
        },
        components: {Language, InputwhitName}
    }
</script>

<style scoped>
    .login-div{
        display: inline;
    }
    .language-select{
        margin-top: 100px;
    }
    .btn-link{
        color: white !important;
    }
</style>