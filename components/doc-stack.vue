<template>
    <div @click="openDoc"
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
            <div v-if="document && document['Description']"
                 class="work-desc">{{document['Description']}}</div>
            <h2 v-if="document&& document['Name']"
                class="titlebox work-title">{{ document['Name'] }}</h2>
        </div>

    </div>
</template>
<script>
module.exports = {
    data() {
        return {
            hovered: false,
            index: 0
        };
    },
    props: ["document"],
    methods: {
        openDoc() {
            this.$emit("click", this.document);
        },
        enterHover() {
            this.hovered = true;
        },
        leaveHover() {
            this.hovered = false;
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
            const images = this.document["Images"];
            return images ? images[0] : null;
        },
        otherImages() {
            const images = this.document["Images"];
            if (images && images.length > 1) {
                const otherImages = images.slice(1);
                return otherImages.map(i => this.smallThumbForImage(i));
            }
        },
        smallThumb() {
            return this.thumbForImage(this.firstImage);
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
    margin-right: 150px;
    padding-bottom: 50px;
    transition: all 300ms;
}
</style>