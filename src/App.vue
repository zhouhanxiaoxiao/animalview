<template>
  <div id="app">
    <transition name="fade">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App',
  data:function() {
      return {
      transitionName:"slide-right"
    }
  },
  components: {
  },
  watch:{

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 50px;
}
  body{
    background-image: url("./assets/login-back.jpg");
    -moz-background-size:100%;
    background-size:100%;
  }
  input{
    height: 30px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .but-div{
  }
  .form-contains{
    background-color: white;
    text-align: center;
    width: 350px;
    height: 500px;
    padding: 20px 20px;
    border-radius: 2px;
    display: inline-block;
  }
  .login-btn{
    width: 100%;
    margin-top: 10px;
  }
  .input-line{
    margin-top: 10px;
    text-align: left;
    width: 100%;
    height: 50px;
    font-size: 16px;
  }
</style>
