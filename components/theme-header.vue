<template>
    <g :style="transformClass">

        <text class="header skew-15">{{theme}}</text>
    </g>
</template>
<script>
module.exports = {
    props: ["theme", "x", "y"],
    computed: {
        transformClass() {
            return { transform: `translate(${this.x}px, ${this.y}px)` };
        }
    }
};
</script>
<style scoped>
.header {
    font-size: 30px;
}
</style>