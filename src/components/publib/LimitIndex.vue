<template>
    <div class="page-index-container">
        <nav aria-label="Page navigation example " class="page-index">
            <ul class="pagination">
                <li class="page-item" @click="updateTable(currentPage - 1)"><a class="page-link">{{$t("previous")}}</a></li>
                <li class="page-item" :class="currentPage + 1 == item ? 'active':'' "
                    v-for="item in pageTotal" :key="item"
                    @click="updateTable(item - 1)"
                >
                    <a class="page-link">{{item}}</a>
                </li>
                <li class="page-item" @click="updateTable(currentPage + 1)"><a class="page-link">{{$t("next")}}</a></li>
            </ul>
        </nav>
    </div>
</template>

<script>
    export default {
        name: "LimitIndex",
        props : {
            currentPage : Number,
            pageSize : Number,
            total : Number,
            updateTableDate : Function
        },
        methods : {
            updateTable : function (pageNumber) {
                if (pageNumber <0){
                    return;
                }
                if (pageNumber >= Math.ceil(this.total/this.pageSize)){
                    return;
                }
                this.$emit("updateTableDate",pageNumber);
            },
        },
        computed : {
            pageTotal : function () {
                if (this.total <1){
                    return new Array();
                }
                var pages = Math.ceil(this.total/this.pageSize);
                var pageArry = new Array();
                for (var i = 0;i<pages;i++){
                    pageArry.push(i+1);
                }
                return pageArry;
            }
        }
    }
</script>

<style scoped>
    .page-index-container{
        display: inline-block;
        margin-top: 10px;
    }
</style>