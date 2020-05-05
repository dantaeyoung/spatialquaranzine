<template>
    <div class="fullscreen-preview"
         @click="$emit('input', null)"
         :class="{visible: value}">
        <slot>
            <img :src="value"
                 alt="">
        </slot>
    </div>
</template>
<script>
module.exports = {
    props: ["value"]
};
</script>
<style scoped>

.visible {
    opacity: 1;
    pointer-events: all;
}
</style>