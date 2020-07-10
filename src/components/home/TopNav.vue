<template>
    <div class="nav-container">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link to="/home">
                <a class="navbar-brand" href="#">
                    <img src="../../assets/login.png" width="250px">
                </a>
            </router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item active">
                        <router-link to="/home"><a class="nav-link" href="#">{{$t("nav_home")}}</a></router-link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Features</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Pricing</a>
                    </li>
                </ul>
            </div>
            <div>
                <language></language>
            </div>
            <div class="personal-info">
                {{$t("nav_hello") + " , " + user.name}}
            </div>
        </nav>
    </div>
</template>

<script>
    import Language from "@/components/language";
    export default {
        name: "TopNav",
        data:function(){
            return {
                user :{
                    name : ""
                }
            }
        },
        beforeMount : function(){
            this.$("body").css("background-image","none");
            if (this.$cookies.get("user")){
                this.user = this.$cookies.get("user");
            }
        },
        components: {Language}
    }
</script>


<style scoped>
    .nav-container{
        position: fixed;
        width: 100%;
        top: 0px;
    }
    li{
        margin-left: 50px;
    }
    .personal-info{
        margin-left: 20px;
        margin-right: 20px;
    }
</style>