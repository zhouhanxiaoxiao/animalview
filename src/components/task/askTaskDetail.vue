<template>
    <div class="modal fade"
         id="askTaskDetail" tabindex="-1" role="dialog" aria-labelledby="askTaskDetailLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="askTaskDetailLabel">{{$t("detail")}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-row" style="text-align: left">
                        <div class="form-group col-md-3">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <input type="text" class="form-control" disabled="disabled" id="expectedTime">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <input type="text" class="form-control" disabled="disabled" id="expectedTime">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <input type="text" class="form-control" disabled="disabled" id="expectedTime">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <input type="text" class="form-control" disabled="disabled" id="expectedTime">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <input type="text" class="form-control" disabled="disabled" id="expectedTime">
                        </div>
                        <div class="form-group col-md-3">
                            <label for="expectedTime">{{$t("expectedTime")}}</label>
                            <input type="text" class="form-control" disabled="disabled" id="expectedTime">
                        </div>
                    </div>
                    <div>
                        实验材料：
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Send message</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "askTaskDetail",
        components: {},
        props : {
            taskId : String
        },
        beforeMount : function(){
            this.init();
        },
        methods : {
            init : function () {
                return "xx";
            }
        },
        watch : {
            taskId(){
                this.init();
            }
        }
    }
</script>

<style scoped>

</style>