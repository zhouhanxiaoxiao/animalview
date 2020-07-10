<template>
    <div>
        <top-nav></top-nav>
        <mainpage></mainpage>
    </div>
</template>

<script>
    import TopNav from "@/components/home/TopNav";
    import Mainpage from "@/components/home/Mainpage";
    export default {
        name: "home",
        components: {Mainpage, TopNav}
    }
</script>

<style scoped>
    .home-page{
        margin-top: 100px;
        width: 100%;
        text-align: center;
    }
</style>