<template>
    <div class="work-details">
        <div class="scrollContainer">
            <div v-if="youtube"
                 class="imageWrapper">
                <iframe class="video-embed"
                        :src="youtube"
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen></iframe>
            </div>
            <div v-else-if="vimeo"
                 class="imageWrapper">
                <iframe :src="vimeo"
                        class="video-embed"
                        frameborder="0"
                        allow="autoplay; fullscreen"
                        allowfullscreen></iframe>
            </div>
             <div v-else-if="insta"
                 class="imageWrapper">
                <iframe :src="otherUrl"
                        :style="{width: '400px'}"
                        height="640"
                        frameborder="0"></iframe>
            </div>
            <div v-else-if="otherUrl"
                 class="imageWrapper">
                <iframe :src="otherUrl"
                        :style="{width: '100%'}"
                        height="640"
                        frameborder="0"></iframe>
            </div>
            <div v-for="(image, key) in images"
                 :key="key"
                 class="imageWrapper">
                <img :src="image"
                     @click="clickedImage = image" />
            </div>
        </div>
        <div class="footer">
            <div style="transform: translate(0px, 100px);">
                <div class="skew-n15 nav-arrows">
                    <div id="left_arrow"
                         class="nav-arrow nav-border"
                         @click="goToWork(-1)">&lt;</div>
                    <div id="current_info"
                         class="nav-border">
                        <div class="title">{{title}}</div>
                        <div class="authors">
                            <span v-for="student in authors"
                                  :key="student.id"
                                  @click="goToStudent(student)">
                                {{student.fields['Name']}}</span></div>
                    </div>
                    <div id="right_arrow"
                         class="nav-arrow nav-border"
                         @click="goToWork(1)">&gt;</div>
                </div>
            </div>
            <div style="transform: translate(0px, 50px);">
                <plan-text-box v-if="work"
                               :class="{hide: !work['Description']}">
                    {{work && work['Description']}}</plan-text-box>
            </div>
        </div>
        <fullscreen-preview v-model="clickedImage" />
    </div>
</template>
<script>
module.exports = {
    components: {
        planTextBox: httpVueLoader("components/plan-text-box.vue"),
        fullscreenPreview: httpVueLoader("components/fullscreen-preview.vue")
    },
    data() {
        return {
            clickedImage: null
        };
    },
    computed: {
        work() {
            if (!this.works || !this.works.length) {
                return null;
            }
            const work = this.works.filter(
                s => s.id == this.$route.params.id
            )[0];
            return { ...work.fields, id: work.id };
        },
        authors() {
            return this.students.filter(
                s =>
                    s.fields["Work"] &&
                    s.fields["Work"].includes(this.$route.params.id)
            );
        },
        title() {
            return this.work && this.work["Title"];
        },
        students() {
            return this.$store.getters.studentsWithWork;
        },
        works() {
            return this.$store.state.works;
        },
        images() {
            return (
                this.work &&
                this.work["Images (PNG, JPG, GIF)"] &&
                this.work["Images (PNG, JPG, GIF)"].length &&
                this.work["Images (PNG, JPG, GIF)"].map(i => i.url)
            );
        },
        insta() {
            return this.work && this.work["Public URL / Video"] && this.work["Public URL / Video"].includes("insta")
        },
        youtube() {
            if (this.work && this.work["Public URL / Video"]) {
                let url = this.work["Public URL / Video"];
                if (url.includes("youtu")) {
                    url = url.replace("https://www.youtube.com/watch?v=", "");
                    url = url.replace("https://youtu.be/", "");
                    if (url.includes("&")) {
                        url = url.split("&")[0];
                    }
                    return `https://www.youtube.com/embed/${url}`;
                }
            }
        },
        vimeo() {
            if (this.work && this.work["Public URL / Video"]) {
                let url = this.work["Public URL / Video"];
                if (url.includes("vimeo")) {
                    url = url.replace("https://vimeo.com/", "");
                    if (url.includes("&")) {
                        url = url.split("&")[0];
                    }
                    return `https://player.vimeo.com/video/${url}`;
                }
            }
        },
        otherUrl() {
            if (this.work && this.work["Public URL / Video"]) {
                return this.work["Public URL / Video"];
            }
        }
    },
    methods: {
        goToStudent(student) {
            this.$router.push({
                name: "student",
                params: {
                    id: student.id,
                    studentName: student.fields["Name"].replace(" ", "")
                }
            });
        },
        goToWork(delta) {
            const allIds = this.works.map(w => w.id);
            const thisIndex = allIds.indexOf(this.work.id);
            const newIndex =
                (thisIndex + delta + this.works.length) % this.works.length;
            this.$router.push({
                name: "work",
                params: { id: allIds[newIndex] }
            });
        }
    },
    created() {
        this.$store.dispatch("fetch");
    }
};
</script>
<style scoped>
.text-wrapper {
    max-height: 230px;
    overflow-y: scroll;
}

.hide {
    opacity: 0;
}

.authors span {
    cursor: pointer;
    padding-left: 5px;
}

.imageWrapper {
    margin: 10px;
    max-height: 100%;
    max-width: 100%;
}

.work-details {
    display: grid;
    grid-template-rows: 10px auto;
    height: 100vh;
}

.nav-arrows {
    max-width: 600px;
    min-width: 400px;
}

p {
    width: 400px;
}

img {
    margin: auto;
    max-height: 100%;
    max-width: 100%;
    width: auto;
}

.video-embed {
    height: 500px;
    width: 100%;
}

.footer {
    display: flex;
    grid-row: 1;
}

.visible {
    opacity: 1;
    pointer-events: all;
}
</style>