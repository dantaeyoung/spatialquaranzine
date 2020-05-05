<template>
    <div class="about-text-box"
         @mouseover="hovered = true"
         @mouseleave="hovered = false"
         :class="{unskew: hovered, 'skew-15': !negative, 'skew-n15': negative}">
        <img class="img"
             src="/assets/images/textbox.svg" />
        <div class="text-wrapper">
            <div class="text">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
module.exports = {
    props: ["negative"],
    data() {
        return {
            hovered: false
        };
    }
};
</script>
<style scoped>
.text {
    padding-top: 10px;
}

.text-wrapper {
    max-height: 230px;
    overflow-y: scroll;
}
</style>