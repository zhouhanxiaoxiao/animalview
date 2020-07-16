<template>
    <div>
        <top-nav></top-nav>
        <div class="main-page">
            <div class="summary-container">
                <number-and-name num-name="待处理" number="55"></number-and-name>
                <number-and-name num-name="流转中" number="22"></number-and-name>
                <number-and-name :num-name="$t('current_strain')" number="88"></number-and-name>
            </div>
            <task-table></task-table>
        </div>
    </div>
</template>

<script>
    import TopNav from "@/components/publib/TopNav";
    import NumberAndName from "@/components/home/NumberAndName";
    import TaskTable from "@/components/task/TaskTable";
    export default {
        name: "home",
        components: {TaskTable, NumberAndName, TopNav}
    }
</script>

<style scoped>
    .main-page{
        margin-top: 100px;
        /*padding-top: 100px;*/
        background-color: white;
        width: 90%;
        margin-left: 5%;
        min-height: 500px;
        border-radius: 5px;
    }
    .summary-container{
        width: 90%;
    }

</style>