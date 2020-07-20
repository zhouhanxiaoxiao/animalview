<template>
    <div class="form-group-sm col-md-3 was-validated dropdown">
        <label for="studyDirector">{{$t("studyDirector")}}</label>
        <input type="search" class="form-control" role="combobox" id="studyDirector" required v-model="studyDirector" placeholder="例：曲素素">
        <div class="dropdown-menu" aria-labelledby="studyDirector">
            <button class="dropdown-item" type="button">Action</button>
            <button class="dropdown-item" type="button">Another action</button>
            <button class="dropdown-item" type="button">Something else here</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "searchInput"
    }
</script>

<style scoped>

</style>