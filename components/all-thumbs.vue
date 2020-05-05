<template>
    <div id="thumbnail_container">
        <thumb v-for="(work, key) in works"
               :work="work"
               :key="key" />
    </div>
</template>
<script>
const Thumb = httpVueLoader("components/work-thumb.vue");

module.exports = {
    components: {
        thumb: Thumb
    },
    computed: {
        ...Vuex.mapState(["works"])
    }
};
</script>
<style scoped>
</style>