<template>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="../../assets/CIBR-icon.png" class="rounded mr-2 cibr-icon" alt="...">
            <strong class="mr-auto">{{toastTitle}}</strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            {{toastMsg}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "CibrToasts",
        props:{
            toastMsg : String,
            toastTitle : String
        }
    }
</script>

<style scoped>
    .toast{
        position: fixed;
    }
    .cibr-icon{
        width: 40px;
    }
</style>