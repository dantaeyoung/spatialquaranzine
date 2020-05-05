<template>
    <div id="thumbnail_container"
         ref="scrollcontainer"
         @scroll.passive="scrollHandle">
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
    },
    methods: {
        scrollHandle(event) {
            const container = this.$refs.scrollcontainer;
            const containerTop = container.offsetTop;
            [...container.children].forEach(child => {
                const yDelta = child.offsetTop - containerTop
                if(yDelta < (container.scrollTop+60)) {
                    child.style.opacity = 0;
                } else {
                    child.style.opacity = 1;
                }
            })
        }
    }
};
</script>
<style scoped>
#thumbnail_container .thumbnail {
    transition: all 100ms;
}
</style>