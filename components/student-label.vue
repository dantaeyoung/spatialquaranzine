<template>
    <g :style="transformClass">
        <text class="header">{{student["Name"]}}</text>
    </g>
</template>
<script>
module.exports = {
    props: ["student", "x", "y"],
    computed: {
        transformClass() {
            return { transform: `translate(${this.x}px, ${this.y}px)` };
        }
    }
};
</script>
<style scoped>
.header {
    font-size: 20px;
}
</style>