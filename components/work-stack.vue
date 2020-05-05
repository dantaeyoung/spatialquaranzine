<template>
    <div @click="goToWork"
         class="work-thumb skew-n15">
        <div class="stack"
             :class="{'hover': hovered}"
             @mouseover="enterHover"
             @mouseleave="leaveHover">
            <div v-for="(layer, k) in otherImages"
                 :key="k"
                 class="stackbump">
                <img class="image"
                     :src="layer"
                     :style="offset(k)" />
            </div>
            <div class="stackbump">
                <img class="image"
                     :style="offset(otherImages && otherImages.length)"
                     :src="smallThumb" />
            </div>
            <div v-if="work && work.fields && work.fields['Description']" class="work-desc">{{work.fields['Description']}}</div>
           <h2 v-if="work && work.fields && work.fields['Title']" class="titlebox work-title" >{{ work.fields['Title'] }}</h2>
            <!-- <img v-for="(layer, k) in otherImages"
                 :key="k"
                 class="image"
                 :src="layer"
                 :style="`transform: translate(10px 10px);`" />
            <img class="image"
                 :src="smallThumb" /> -->
        </div>

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
        },
        thumbForImage(image) {
            const smallThumb =
                image && image.thumbnails ? image.thumbnails.large.url : null;
            if (smallThumb == null && image) {
                return image.url;
            }
            return smallThumb;
        },
        smallThumbForImage(image) {
            const smallThumb =
                image && image.thumbnails ? image.thumbnails.small.url : null;
            if (smallThumb == null && image) {
                return image.url;
            }
            return smallThumb;
        },
        offset(k) {
            const offset = (k + 1) * (this.hovered ? 16 : 10);
            return `margin-left: ${offset}px`;
        }
    },
    computed: {
        firstImage() {
            const images = this.work.fields["Images (PNG, JPG, GIF)"];
            return images ? images[0] : null;
        },
        otherImages() {
            const images = this.work.fields["Images (PNG, JPG, GIF)"];
            if (images && images.length > 1) {
                const otherImages = images.slice(1);
                return otherImages.map(i => this.smallThumbForImage(i));
            }
        },
        smallThumb() {
            return this.thumbForImage(this.firstImage);
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
.stack {
    display: block;
    height: 550px;
    position: relative;
}

.stackbump {
    height: 10px;
}

.hover .stackbump {
    height: 16px;
}

.image {
    background: white;
    border: 6px solid black;
    bottom: 0;
    height: 512px;
    left: 0;
    object-fit: cover;
    position: relative;
    right: 0;
    top: 0;
    transition: all 300ms;
    width: 512px;
}

.work-title {
    left: 600px;
    position: absolute;
}

.work-desc {
    background: white;
    border: 3px solid black;
    left: 500px;
    margin-top: 200px;
    max-height: 200px;
    overflow-y: scroll;
    padding: 10px;
    position: absolute;
    width: 300px;
}

.thumbnail {
    cursor: pointer;
}

.work-thumb {
    cursor: pointer;
    margin-bottom: 20px;
    padding-bottom: 50px;
    transition: all 300ms;
}
</style>