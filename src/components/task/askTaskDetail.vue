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
                    </div>
                    <div style="text-align: left">
                        实验材料：
                    </div>
                    <ask-task-detail-item v-for="item in rows" :key="item.id" :row="item"></ask-task-detail-item>
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
    import AskTaskDetailItem from "@/components/task/AskTaskDetailItem";
    export default {
        name: "askTaskDetail",
        components: {AskTaskDetailItem},
        props : {
            taskId : String
        },
        data: function(){
          return{
              rows : [],
              ask : {}
          }
        },
        beforeMount : function(){
            this.init();
        },
        methods : {
            init : function () {
                var _this = this;
                var postData = {
                    taskId : this.taskId
                };
                this.$axios.post("/task/askTaskDetail",postData).then(function (res) {
                    console.log(res);
                    if (res.data.code != 200){
                        _this.$toast(_this.$t(res.data.code));
                    }else {
                        _this.rows = res.data.retMap.rows;
                        _this.ask = res.data.retMap.ask;
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$toast(_this.$t("systemErr"));
                })
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