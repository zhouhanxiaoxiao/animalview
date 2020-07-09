<template>
    <div class="language-select">
        <div class="btn-group btn-group-sm btn-group-toggle" data-toggle="buttons">
            <label class="btn btn-link active">
                <input type="radio" name="options" id="option1" checked @click="changeLanguage('zh')"> 中文
            </label>
            <label class="btn btn-link">
                <input type="radio" name="options" id="option3" @click="changeLanguage('en')"> English
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "language",
        methods:{
            changeLanguage:function (tar) {
                localStorage.setItem('local',tar);
                window.location.reload();
            }
        }
    }
</script>

<style scoped>
    .btn-link{
        color: white;
    }
    .language-select{
        margin-top: 100px;
    }
</style>