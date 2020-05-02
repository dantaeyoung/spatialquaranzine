<template>
    <!-- normally I would use a <g> instead of nested SVG but the http-vue-loader was having trouble
    with the image tag unless the xml namespace was specified in the same component -->
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         height="300"
         width="300"
         viewBox="-150 -150 300 300"
         :x="x-150"
         :y="y-150"
         :style="{opacity: opacityForScroll}">
        <rect x="-50"
              y="-50"
              width="100"
              height="100"
              class="thumb background skew-15"
              :class="skewClass"
              @mouseover="enterHover"
              @mouseout="leaveHover" />
        <image v-if="smallThumb"
               :href="smallThumb"
               x="-50"
               y="-50"
               height="100px"
               width="100px"
               class="thumb skew-15"
               :class="skewClass"
               @mouseover="enterHover"
               @mouseout="leaveHover" />
        <rect x="-50"
              y="-50"
              width="100"
              height="100"
              class="thumb border skew-15"
              :class="skewClass" />
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
    props: ["work", "x", "y", "scroll", "selectedstudent", "hoveredwork"],
    methods: {
        enterHover() {
            this.hovered = true;
            this.$emit("hover", this.work);
        },
        leaveHover() {
            this.hovered = false;
            this.$emit("hover", null);
        }
    },
    computed: {
        transformClass() {
            return { transform: `translate(${this.x}px, ${this.y}px)` };
        },
        skewClass() {
            return {
                unskew: this.hovered,
                "scale-up": this.hovered,
                clickable: this.hovered
            };
        },
        firstImage() {
            const images = this.work.fields["Images (PNG, JPG, GIF)"];
            return images ? images[0] : null;
        },
        smallThumb() {
            const smallThumb = this.firstImage && this.firstImage.thumbnails
                ? this.firstImage.thumbnails.large.url
                : null;
                if(smallThumb == null) {
                    return this.firstImage.url
                }
                return smallThumb;
        },
        opacityForScroll() {
            let scroll = this.y;
            const startFade = 200;
            const endFade = 100;
            scroll = Math.min(startFade, scroll);
            scroll = Math.max(endFade, scroll);
            scroll = (scroll - endFade) / (startFade - endFade); //remap to 1-0
            if (this.selectedstudent) {
                if (
                    this.work.fields["Students"].includes(
                        this.selectedstudent.id
                    )
                ) {
                    return 1.0;
                } else {
                    return 0.2 * scroll;
                }
            } else if (this.hovered) {
                return 1.0;
            } else if (this.hoveredwork) {
                return 0.2 * scroll;
            }

            return scroll;
        }
    }
};
</script>
<style lang="css" scoped>
svg {
    transition: all 100ms;
}

.scale-up {
    transform: scale(1.5) !important;
}

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