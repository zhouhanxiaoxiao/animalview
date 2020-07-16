<template>
    <div class="num-contain">
        <div class="number-size">
            {{number}}
        </div>
        <div class="number-name">
            {{numName}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "NumberAndName",
        props:{
            number : Number,
            numName : String
        },
        data:function () {
            return{

            }
        }
    }
</script>

<style scoped>
    .num-contain{
        text-align: center;
        display: inline-block;
        padding: 20px 20px;
    }
    .number-size{
        font-size: 50px;
    }
</style>