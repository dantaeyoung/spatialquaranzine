<template>
    <g :style="transformClass"
       @mouseover="$emit('mouseover')"
       @mouseout="$emit('mouseout')"
       @click="$emit('click')">
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
    cursor: pointer;
    font-size: 18px;
    text-anchor: end;
}
</style>