<template>
  <div id="app">
    <transition :name="transitionName">
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
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > from.meta.index){
        //设置动画名称
        this.transitionName = 'slide-left';
      }else{
        this.transitionName = 'slide-right';
      }
    }
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
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-50%, 50%,50%);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(50%, 50%,50%);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(50%, 50%, 50%);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-50%, 50%, 50%);
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
