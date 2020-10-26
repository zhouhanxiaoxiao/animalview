<template>
    <div>
        <top-nav></top-nav>
        <div class="task-main">
<!--            <task-table :page-location="'mytask'"></task-table>-->
          <task-table-new :page-location="'mytask'"></task-table-new>
        </div>
    </div>
</template>

<script>
    import TopNav from "@/components/publib/TopNav";
    import TaskTableNew from "@/components/task/taskMain/taskTableNew";
    export default {
        name: "TaskMain",
        components: {TaskTableNew, TopNav}
    }
</script>

<style scoped>
    .task-main{
        background-color: white;
        margin-top: 100px;
        width: 90%;
        margin-left: 5%;
        min-height: 500px;
        border-radius: 5px;
        padding-top: 20px;
        overflow-x: auto;
    }
</style>