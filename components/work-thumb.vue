<template>
    <div class="thumbnail skewhover skew-n15" @click="goToWork">
        <img class="image" :src="smallThumb" />
        <div class="work_names">{{ work.fields['Names'] }}</div>
        <div class="work_title">{{ work.fields['Title'] }}</div>
        <div class="work_url">{{ work.fields['Url'] }}</div>
    </div>
</template>
<script>
module.exports = {
    data() {
        return {
            hovered: false
        };
    },
    props: ["work"],
    methods: {
        enterHover() {
            this.hovered = true;
            this.$emit("hover", this.work);
        },
        leaveHover() {
            this.hovered = false;
            this.$emit("hover", null);
        },
        goToWork() {
            this.$router.push({ name: "work", params: { id: this.work.id } });
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
            const smallThumb =
                this.firstImage && this.firstImage.thumbnails
                    ? this.firstImage.thumbnails.large.url
                    : null;
            if (smallThumb == null) {
                return this.firstImage.url;
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
<style scoped>
.thumbnail {
    cursor: pointer;
}
</style>