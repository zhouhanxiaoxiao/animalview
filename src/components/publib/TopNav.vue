<template>
  <div class="nav-container">
    <nav style="height: 100%" class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/home">
        <a class="navbar-brand" href="#">
          <img src="../../assets/login.png" width="250px">
        </a>
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <router-link to="/home"><a class="nav-link" href="#">{{ $t("nav_home") }}</a></router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="task" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              {{ $t("nav_task") }}
            </a>
            <div class="dropdown-menu" aria-labelledby="task">
              <router-link to="/task"><a class="dropdown-item">{{ $t("nav_mytask") }}</a></router-link>
              <router-link to="/task/process" v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local'"><a
                  class="dropdown-item">{{ $t("processHandle") }}</a></router-link>
              <router-link to="/task/resourceOrder" v-if="this.$systemFlag == 'animal' || this.$systemFlag == 'local'">
                <a class="dropdown-item">{{ $t("workReservation") }}</a></router-link>
            </div>
          </li>
          <li class="nav-item dropdown" v-if="showUpdata">
            <a class="nav-link dropdown-toggle" href="#" id="seq" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              {{ $t("seqwait.menuName") }}
            </a>
            <div class="dropdown-menu" aria-labelledby="task">
              <router-link to="/seqOrder" v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local' "><a
                  class="dropdown-item">{{ $t("seqwait.waitSample") }}</a></router-link>
              <router-link to="/seqwait/upmac" v-if="this.$systemFlag == 'seqpro' || this.$systemFlag == 'local' "><a
                  class="dropdown-item">{{ $t("seqwait.seqing") }}</a></router-link>
            </div>
          </li>
          <li class="nav-item dropdown" v-if="this.$systemFlag == 'animal' || this.$systemFlag == 'local'">
            <a class="nav-link dropdown-toggle" href="#" id="personal" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              {{ $t("nav_stock") }}
            </a>
            <div class="dropdown-menu" aria-labelledby="personal">
              <router-link to="/stock/currentStrain"><a class="dropdown-item">{{ $t("current_strain") }}</a>
              </router-link>
              <router-link to="/stock/currentStock"><a class="dropdown-item">{{ $t("current_stock") }}</a>
              </router-link>
            </div>
          </li>
          <li class="nav-item active">
            <router-link to="/about"><a class="nav-link" href="#">{{ $t("about") }}</a></router-link>
          </li>
        </ul>
      </div>
      <div>
        <language></language>
      </div>
      <div class="personal-info">
        <!--        <div style="display: inline-block;margin-right: 10px"><a-avatar :size="50" :src="userHeadSrc" @click="personalPage"/></div>-->
        <div class="dropdown" style="display: inline-block">
          <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ $t("nav_hello") + " , " + userName }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
<!--            <a class="dropdown-item" id="personalPage" @click="personalPage">{{ $t("nav_personal") }}</a>-->
            <a class="dropdown-item" id="exit" @click="sysExit">{{ $t("exit") }}</a>
          </div>
        </div>
      </div>
    </nav>
    <submitting ref="loading" :title="$t('loading')"></submitting>
  </div>
</template>

<script>
import Language from "@/components/language";
import Submitting from "@/components/publib/submitting";
import util from "@/components/publib/util";

export default {
  name: "TopNav",
  components: {Submitting, Language},
  data: function () {
    return {
      user: {
        name: ""
      }
    }
  },
  beforeMount: function () {
    this.$("body").css("background-image", "none");
    this.$("body").css("background-color", "#e9ecef");
    this.initPage();
  },
  methods: {
    initPage: function () {
      var _this = this;
      this.$axios.post("/user/getUser").then(function (res) {
        if (res.data.code !== "200") {
          _this.$message.error(res.data.code);
        } else {
          _this.$cookies.set("user", res.data.retMap.user, '1d');
          _this.$store.commit("saveUser", res.data.retMap.user);
        }
      }).catch(function (res) {
        console.log(res)
        _this.$message.error(_this.$t("systemErr"));
      });
    },
    sysExit: function () {
      // var _this = this;
      // this.$axios({
      //   url: "/system/exit",
      //   method: "post"
      // }).then(function (res) {
      //   if (res.data.code != "200") {
      //     _this.$message.error(_this.$t(res.data.code));
      //   } else {
      //     _this.$cookies.remove("token");
      //     _this.$router.push("/login");
      //   }
      // }).catch(function (res) {
      //   console.log(res);
      //   _this.$message.error(_this.$t("systemErr"));
      // })
      this.loading = true;
      this.$(this.$refs.loading.$el).modal("show");
      window.open(util.casOutUrl);
      setTimeout(function () {
        window.location.reload();
      }, 5000);
    },
    personalPage: function () {
      this.$router.push("/personal/main");
    }
  },
  computed: {
    userName: function () {
      // console.log(this.$store.getters.getUser);
      return this.$store.getters.getUser.name;
    },
    userId: function () {
      return this.$store.getters.getUser.id;
    },
    userHeadSrc: function () {
      return this.$axios.defaults.baseURL + 'user/userHead/' + this.userId + '.png';
    },
    showUpdata: function () {
      if (this.$systemFlag == 'seqpro' || this.$systemFlag == 'local') {
        if (this.$store.getters.isUpDataUser) {
          return true;
        }
      }
      return false;
    }
  }
}
</script>


<style scoped>
.nav-container {
  position: fixed;
  font-size: 20px !important;
  width: 100%;
  top: 0px;
  z-index: 99;
  box-shadow: 0 5px 4px -4px #C0C0C0;
}

li {
  margin-left: 50px;
}

.personal-info {
  margin-left: 20px;
  margin-right: 20px;
}

a {
  text-decoration: none;
  color: black;
}

</style>