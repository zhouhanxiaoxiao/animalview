<template>
    <div class="current-strain">
        <top-nav></top-nav>
        <div class="current-strain-container">
            <div class="sumarry-info">
                <div class="input-group mb-3 page-size-select">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="pageSizeSelect">共{{total}}条，每页显示：</label>
                    </div>
                    <select class="custom-select" @change="updateTable(currentPage)" id="pageSizeSelect" v-model="pageSize">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                    </select>
                </div>
            </div>
            <div class="strain-table">
                <table class="table table-striped table-hover">
                    <thead class="table-head">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">stock id</th>
                        <th scope="col">genotype</th>
                        <th scope="col">resource</th>
                    </tr>
                    </thead>
                    <tbody class="table-body">
                    <tr v-for="(item,index) in strains" v-bind:key="item.id">
                        <th scope="row">{{index + 1 + currentPage*pageSize}}</th>
                        <td>{{item.stockId}}</td>
                        <td>{{item.genotype}}</td>
                        <td>{{item.resource}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="page-index-container">
                <nav aria-label="Page navigation example " class="page-index">
                    <ul class="pagination">
                        <li class="page-item" @click="updateTable(currentPage - 1)"><a class="page-link">Previous</a></li>
                        <li class="page-item" :class="currentPage + 1 == item ? 'active':'' "
                            v-for="item in pageTotal" :key="item"
                            @click="updateTable(item - 1)"
                        >
                            <a class="page-link">{{item}}</a>
                        </li>
                        <li class="page-item" @click="updateTable(currentPage + 1)"><a class="page-link">Next</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    import TopNav from "@/components/publib/TopNav";
    export default {
        name: "CurrentStrain",
        components: {TopNav},
        data : function(){
            return {
                strains : [],
                pageSize : 10,
                total : 0,
                currentPage : 0
            }
        },
        beforeMount : function () {
            this.initTable();
        },
        methods : {
            initTable : function () {
                var _this = this;
                var postData = {
                    pageSize : this.pageSize,
                    currentPage : this.currentPage
                };
                this.$axios.post(
                    "/stock/allStrain",postData
                ).then(function (res) {
                    console.log(res);
                    if (res.data.code != "200"){
                        _this.$toast(_this.$t(res.data.code));
                    }else {
                        _this.strains = res.data.retMap.strains;
                        _this.total = res.data.retMap.totalnumber;
                    }
                }).catch(function (res) {
                    console.log(res);
                    _this.$toast(_this.$t("systemErr"));
                })
            },
            updateTable : function (currentPage) {
                if (currentPage <0){
                    return;
                }
                if (currentPage >= Math.ceil(this.total/this.pageSize)){
                    return;
                }
                this.currentPage = currentPage;
                this.initTable();
            }
        },
        computed : {
            pageTotal : function () {
                var pages = Math.ceil(this.total/this.pageSize);
                var pageArry = new Array();
                for (var i = 0;i<pages;i++){
                    pageArry.push(i+1);
                }
                return pageArry;
            }
        },
        watch : {
            pageSize(){
                this.currentPage = 0;
                this.initTable();
            }
        }
    }
</script>

<style scoped>
    .current-strain-container{
        margin-top: 100px;
        width: 90%;
        margin-left: 5%;
        background-color: white;
        border-radius: 5px;
        min-height: 500px;
    }
    .strain-table {
        width: 90%;
        margin-left: 5%;
        padding: 10px 10px;
    }
    .table-head{
        font-size: 14px;
    }
    .table-body{
        font-size: 12px;
    }
    .page-index-container {
        width: 100%;
        margin: 10px 0px;
        text-align: center;
    }
    .page-index{
        display: inline-block;
    }
    .sumarry-info{
        width: 30%;
        margin-left: 5%;
        padding-top: 10px;
    }
    .page-size-select{
        margin-top: 10px;
    }
</style>