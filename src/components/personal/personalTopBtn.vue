<template>
    <div class="btn-group btn-group-toggle personal-btn-group" data-toggle="buttons">
        <label class="btn btn-secondary" :class="btnActiv == 'enterAnimalStock' ? 'active' : ''" @click="clickBtn('/personal')">
            <input type="radio" name="personal-btn" id="enter"> {{$t("personnal_btn_enter")}}
        </label>
        <label class="btn btn-secondary" :class="btnActiv == 'animalStock' ? 'active' : ''" @click="clickBtn('/personal/animalStock')">
            <input type="radio" name="personal-btn" id="stock"> {{$t("personnal_btn_stock")}}
        </label>
        <label class="btn btn-secondary" :class="btnActiv == 3 ? 'active' : '' " >
            <input type="radio" name="personal-btn" id="option3"> Radio
        </label>
    </div>
</template>

<script>
    export default {
        name: "personalTopBtn",
        props:{
          btnActiv : String
        },
        methods : {
            clickBtn: function (rot) {
                this.$router.push(rot);
            }
        },
        computed : {

        }
    }
</script>

<style scoped>
    .personal-btn-group{
        padding-left: 20px;
    }
</style>