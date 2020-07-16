<template>
    <div class="task-container">
        <table class="table table-striped table-hover">
            <thead class="task-head">
            <tr>
                <th scope="col" width="5%">#</th>
                <th scope="col" width="15%">任务类型</th>
                <th scope="col" width="15%">当前状态</th>
                <th scope="col" width="15%">创建人</th>
                <th scope="col" width="15%">创建时间</th>
                <th scope="col" width="20%">备注</th>
                <th scope="col" width="15%">详情</th>
            </tr>
            </thead>
            <tbody class="task-body">
            <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "TaskTable",

    }
</script>

<style scoped>
    .task-container{
        width: 90%;
        margin-left: 5%;
        margin-top: 20px;
    }
    .task-head{
        font-size: 14px;
    }
    .task-body{
        font-size: 12px;
    }
    .task-handle{
        width: 100%;
        text-align: right;
        margin: 20px 0px;
        font-size: 14px;
    }
    .display-none {
        display: none;
    }
</style>