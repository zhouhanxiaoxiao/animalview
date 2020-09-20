<template>
  <div class="nav-container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/home">
        <a class="navbar-brand" href="#">
          <img src="../../assets/login.png" width="250px">
        </a>
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
              aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav" style="font-size: 20px">
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
              <!--                            <a class="dropdown-item">{{$t("newStrain")}}</a>-->
              <!--                            <a class="dropdown-item">{{$t("useTask")}}</a>-->
              <router-link to="/task/process"><a class="dropdown-item">{{ $t("processHandle") }}</a></router-link>
              <router-link to="/task/resourceOrder"><a class="dropdown-item">{{ $t("resourceOrder") }}</a></router-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="personal" role="button" data-toggle="dropdown"
               aria-haspopup="true" aria-expanded="false">
              {{ $t("nav_stock") }}
            </a>
            <div class="dropdown-menu" aria-labelledby="personal">
              <router-link to="/stock/currentStrain"><a class="dropdown-item">{{ $t("current_strain") }}</a>
              </router-link>
<!--              <router-link to="/personal/animalStock"><a class="dropdown-item">{{ $t("current_stock") }}</a>-->
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
        <div style="display: inline-block;margin-right: 10px"><a-avatar :size="50" :src="userHeadSrc" @click="personalPage"/></div>
        <div class="dropdown" style="display: inline-block">
          <button class="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenuButton"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ $t("nav_hello") + " , " + userName }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a class="dropdown-item" id="personalPage" @click="personalPage">{{ $t("nav_personal") }}</a>
            <a class="dropdown-item" id="exit" @click="sysExit">{{ $t("exit") }}</a>
          </div>
        </div>
      </div>
    </nav>
    <div>
    </div>
  </div>
</template>

<script>
import Language from "@/components/language";

export default {
  name: "TopNav",
  components: {Language},
  data: function () {
    return {
      user: {
        name: ""
      }
    }
  },
  methods: {
    sysExit: function () {
      var _this = this;
      this.$axios({
        url: "/system/exit",
        method: "post"
      }).then(function (res) {
        if (res.data.code != "200") {
          _this.$message.error(_this.$t(res.data.code));
        } else {
          _this.$cookies.remove("token");
          _this.$router.push("/login");
        }
      }).catch(function (res) {
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    personalPage: function () {
      this.$router.push("/personal/main");
    }
  },
  beforeMount: function () {
    this.$("body").css("background-image", "none");
    this.$("body").css("background-color", "#e9ecef");
  },
  computed: {
    userName: function () {
      // console.log(this.$store.getters.getUser);
      return this.$store.getters.getUser.name;
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
.nav-container {
  position: fixed;
  width: 100%;
  top: 0px;
  z-index: 99;
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