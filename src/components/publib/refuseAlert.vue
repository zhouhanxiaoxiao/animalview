<template>
    <div class="modal" tabindex="-1" role="dialog" id="refuseAlert">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{modalTitle}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="text-align: left">
                    <div class="form-group">
                        <label for="reason">{{$t("reason")}}</label>
                        <textarea class="form-control" id="reason" rows="3" v-model="reason"></textarea>
                    </div>
                    <div class="form-group">
                      <label for="reason">{{$t("remarks")}}</label>
                      <textarea class="form-control" id="remarks" rows="3" v-model="remarks"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">{{$t("cancel")}}</button>
                    <button type="button" class="btn btn-primary"
                    :disabled="isCanConfirm" @click="commitReason">{{$t("confirm")}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "refuseAlert",
        props : {
            modalTitle : String,
        },
        data : function () {
            return{
              reason:"",
              remarks:""
            }
        },
        methods:{
            commitReason : function () {
                this.$emit("confirmFun", this.reason, this.remarks);
            }
        },
        computed : {
            isCanConfirm : function () {
                return this.reason == "";
            }
        }
    }
</script>

<style scoped>

</style>