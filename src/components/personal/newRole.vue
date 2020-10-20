<template>
  <div id="newRole" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("newRole") }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <label for="roleName" class="col-sm-4 col-form-label">{{ $t("roleName") }}</label>
            <div class="col-sm-8">
              <a-input v-model="role.name" id="roleName" style="width: 100%"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="roleIndex" class="col-sm-4 col-form-label">{{ $t("roleIndex") }}</label>
            <div class="col-sm-8">
              <a-input v-model="role.index" id="roleIndex" style="width: 100%"/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ $t("cancel") }}</button>
          <button type="button" class="btn btn-primary" @click="submitData">{{ $t("confirm") }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/components/publib/util";

export default {
  name: "newRole",
  data : function (){
    return {
      role :{
        name : "",
        index : ""
      }
    }
  },
  methods : {
    submitData : function (){
      if (util.isNull(this.role.name)){
        this.$message.error(this.$t("roleName") + this.$t("not_null"));
        return ;
      }
      if (util.isNull(this.role.index)){
        this.$message.error(this.$t("roleIndex") + this.$t("not_null"));
        return ;
      }
      this.$emit("sumintNewRole",this.role);
    }
  }
}
</script>

<style scoped>

</style>