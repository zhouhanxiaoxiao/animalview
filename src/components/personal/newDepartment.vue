<template>
  <div id="newDepartment" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("newDepartment") }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group row">
            <label for="staticEmail" class="col-sm-4 col-form-label">{{$t("departmentName")}}</label>
            <div class="col-sm-8">
              <a-input v-model="group.name" id="staticEmail" style="width: 100%"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-4 col-form-label">{{$t("principal")}}</label>
            <div class="col-sm-8">
              <a-select id="inputPassword"
                        v-model="group.groupAdmin"
                        style="width: 100%">
                <a-select-option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="form-group row">
            <label for="userName" class="col-sm-4 col-form-label">{{$t("userName")}}</label>
            <div class="col-sm-8">
              <a-input v-model="userName" id="userName" style="width: 100%"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="userEmail" class="col-sm-4 col-form-label">{{$t("userEmail")}}</label>
            <div class="col-sm-8">
              <a-input v-model="userEmail" id="userEmail" style="width: 100%"/>
            </div>
          </div>
          <div class="form-group row">
            <label for="userPwd" class="col-sm-4 col-form-label">{{$t("userPwd")}}</label>
            <div class="col-sm-8">
              <a-input v-model="userPwd" id="userPwd" style="width: 100%"/>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
          <button type="button" class="btn btn-primary" @click="submitData">{{$t("confirm")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/components/publib/util";

export default {
  name: "newDepartment",
  props : {
    users : Array
  },
  data : function (){
    return {
      group : {
        name : "",
        groupAdmin : ""
      },
      userName : "",
      userEmail: "",
      userPwd : ""
    }
  },
  methods : {
    submitData : function (){
      if (util.isNull(this.group.name)){
        this.$message.error(this.$t("departmentName") + this.$t("not_null"));
        return ;
      }
      var postData = {
        name : this.group.name,
        groupAdmin : this.group.groupAdmin,
        userName : this.userName,
        userEmail : this.userEmail,
        userPwd : this.$md5(this.userPwd)
      }
      this.$emit("submitDepart",postData);
    }
  }
}
</script>

<style scoped>

</style>