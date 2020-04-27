<template>
    <!-- normally I would use a <g> instead of nested SVG but the http-vue-loader was having trouble
    with the image tag unless the xml namespace was specified in the same component -->
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         height="300"
         width="300"
         viewBox="-150 -150 300 300"
         :x="x-150"
         :y="y-150">
        <rect x="-50"
              y="-50"
              width="100"
              height="100"
              class="thumb background skew-15"
              :class="{'unskew': hovered}"
              @mouseover="hovered = true"
              @mouseout="hovered = false" />
        <image v-if="smallThumb"
               :href="smallThumb"
               x="-50"
               y="-50"
               height="100px"
               width="100px"
               class="thumb skew-15"
               :class="{'unskew': hovered}"
               @mouseover="hovered = true"
               @mouseout="hovered = false" />
        <rect x="-50"
              y="-50"
              width="100"
              height="100"
              class="thumb border skew-15"
              :class="{'unskew': hovered}"
              @mouseover="hovered = true"
              @mouseout="hovered = false" />
    </svg>
    <!-- <image v-if="smallThumb"
               :href="smallThumb"
               x="-50"
               y="-50"
               height="100px"
               width="100px"
               class="skew-15"
               :class="{'unskew': hovered}"
               @mouseover="hovered = true"
               @mouseout="hovered = false" /> 
        <rect x="-50"
              y="-50"
              width="100"
              height="100"
              class="thumb skew-15"
              :class="{'unskew': hovered}"
              @mouseover="hovered = true"
              @mouseout="hovered = false" /> -->

</template>
<script>
module.exports = {
    data() {
        return {
            hovered: false
        };
    },
    props: ["work", "x", "y"],
    computed: {
        transformClass() {
            return { transform: `translate(${this.x}px, ${this.y}px)` };
        },
        firstImage() {
            const images = this.work.fields["Images (PNG, JPG, GIF)"];
            return images ? images[0] : null;
        },
        smallThumb() {
            return this.firstImage && this.firstImage.thumbnails
                ? this.firstImage.thumbnails.large.url
                : null;
        }
    }
};
</script>
<style lang="css" scoped>
.wrapper {
    transform: translate(300px, 300px);
}

.thumb {
    transition: all 500ms;
}

.background {
    fill: white;
}

.border {
    fill: none;
    stroke: black;
    stroke-width: 4px;
}
</style>