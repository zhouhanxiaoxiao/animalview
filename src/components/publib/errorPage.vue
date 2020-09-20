<template>
  <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
    <template #extra>
      <a-button type="primary" @click="backHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: "errorPage",
  beforeMount() {
    this.$("body").css("background-image", "none");
  },
  methods : {
    backHome : function (){
      this.$router.push("/home");
    }
  }
}
</script>

<style scoped>

</style>