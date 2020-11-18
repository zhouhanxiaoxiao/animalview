<template>
  <div class="form-row">
    <div class="col-md-12">
      <a-card hoverable style="width: 100%">
        <a-result
            slot="cover"
            status="500"
            :title="$t('isComplete') + '?'"
            sub-title="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        >
          <template #extra>
            <a-button key="console" type="primary">
              {{ $t("yes") }}
            </a-button>
            <a-button key="buy">
              {{ $t("no") }}
            </a-button>
          </template>
        </a-result>
<!--        <a-card-meta title="Europe Street beat" style="width:100%;text-align: center;">-->
<!--          <template slot="description">-->
<!--            www.instagram.com-->
<!--          </template>-->
<!--        </a-card-meta>-->
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "askStep3",
  props : {
    taskId : String,
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage : function (){

    }
  },
  watch : {
    taskId(){
      this.initPage();
    }
  },
}
</script>

<style scoped>

</style>