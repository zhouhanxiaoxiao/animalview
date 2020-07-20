<template>
    <div class="RadioStyle">
        <div class="switch-all Block PaddingL">
            <input type="checkbox" id="love1" v-model="value" @change="returnValue"/>
            <label for="love1">{{text}}</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SwitchboxCont",
        props : {
            text:String
        },
        data:function () {
            return{
                value: false
            }
        },
        methods : {
            returnValue : function () {
                this.$emit('getValue',this.value);
            }
        }

    }
</script>

<style scoped>
    .clear {
        clear: both
    }
    .RadioStyle input {
        display: none
    }
    .RadioStyle label {
        border: 1px solid #CCC;
        color: #666;
        padding: 2px 10px 2px 5px;
        line-height: 28px;
        min-width: 80px;
        text-align: center;
        float: left;
        margin: 2px;
        border-radius: 4px
    }
    .RadioStyle input:checked + label {
        background: url(../../assets/ico_checkon.svg) no-repeat right bottom;
        border: 1px solid #00a4ff;
        background-size: 21px 21px;
        color: #00a4ff
    }
    .RadioStyle input:disabled + label {
        opacity: 0.7;
    }
</style>