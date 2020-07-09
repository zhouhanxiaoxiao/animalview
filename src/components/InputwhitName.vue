<template>
    <div class="form-row input-line">
<!--        <label for="validationServer01">{{inpData.inputLabel}}</label>-->
        <input :type="inpData.inputType"
               class="form-control form-control-sm"
               :class="isValidClass"
               v-model="inputValue"
               :placeholder="inpData.inputLabel"
               @change="updatethisdata()"
               required>
        <div :class="showClass">
            {{inpData.checkMsg}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "inputLabel",
        props : {
            inpData:{
                inputLabel : String,
                inputType : String,
                inputName : String,
                checkMsg : String,
                isValid : String,
            },
        },
        data:function(){
                return{
                    inputValue : '',
                    isValidClass:'',
                    showClass:''
                }
        },
        methods : {
            updatethisdata : function () {
                this.$emit("updateData", {ipkey:this.inpData.inputName,ipvalue:this.inputValue});
            }
        },
        watch:{
            inpData : {
                handler(newMsg) {
                    if (newMsg.isValid == '1'){
                        this.isValidClass = "is-valid";
                        this.showClass =  "valid-feedback";
                    }else if (newMsg.isValid == '2'){
                        this.isValidClass = "is-invalid";
                        this.showClass =  "invalid-feedback";
                    }else {
                        this.isValidClass = '';
                        this.showClass = '';
                    }
                },
                deep:true
            },
            checkMsg(newMsg){
                console.log(newMsg);
            }
        }
    }
</script>

<style scoped>
    .input-line{
        margin-top: 10px;
        text-align: left;
        width: 100%;
        height: 50px;
        font-size: 16px;
    }
</style>