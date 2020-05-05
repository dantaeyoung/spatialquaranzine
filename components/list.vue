<template>
    <div class="grid">
        <div class="header">
            <h1 class="skew-15 titlebox">All Work</h1>
        </div>
        <thumb-gallery />
    </div>
</template>
<script>
const AllThumbs = httpVueLoader("components/all-thumbs.vue");
module.exports = {
    components: {
        "thumb-gallery": AllThumbs
    }
};
</script>
<style scoped>
.titlebox {
    position: absolute;
    right: 40px;
}

.header {
    grid-row: 0;
    
}

.grid {
    display: grid;
    grid-template-rows: 160px auto;
    height: 100vh;
}
</style>