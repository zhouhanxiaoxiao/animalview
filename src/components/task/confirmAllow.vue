<template>
  <div class="modal fade" id="confirmAllow" tabindex="-1" role="dialog" aria-labelledby="confirmAllowLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmAllowLabel">{{$t("confirm")}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" style="text-align: left">
          <div class="form-group col-md-12">
            <label for="selectRoles">{{$t("selectRoles")}}</label>
            <div id="selectRoles">
              <multiselect
                  v-model="selectRoles"
                  :options="roles"
                  :searchable="true"
                  :close-on-select="true"
                  :allow-empty="false"
                  :show-labels="false"
                  track-by="rolename"
                  label="rolename"
                  required
                  :multiple="true"
                  :taggable="true"
                  :placeholder="$t('selectRoles')"
              ></multiselect>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
          <button type="button" class="btn btn-primary" :disabled="canConfirm" @click="confirmSel">{{$t("confirm")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "confirmAllow",
  props : {
    roles : Array
  },
  data : function (){
    return{
      selectRoles : []
    }
  },
  methods : {
    confirmSel : function (){
      var rolesId = new Array();
      for (var i=0;i<this.selectRoles.length;i++){
        rolesId.push(this.selectRoles[i].id);
      }
      this.$emit("confrimRoles",rolesId);
    }
  },
  computed : {
    canConfirm : function (){
      if (this.selectRoles.length == 0){
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>