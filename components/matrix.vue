<template>
    <div class="wrapper">
        <svg class="mainSvg"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 1000 1500">
            <rect class="bounds"
                  width="1000"
                  height="1500"></rect>
            <theme-header v-for="theme in themes"
                          :theme="theme"
                          :key="theme"
                          :y="80"
                          :x="xPosForTheme(theme)" />
            <ellipse v-for="theme in themes"
                     :key="theme"
                     :cx="xPosForTheme(theme)"
                     :cy="100"
                     rx="10"
                     ry="10"
                     >

            </ellipse>
            <thumb v-for="(work, key) in works"
                   :x="xPosForWork(work)"
                   :y="200+110*key"
                   :key="key"
                   :work="work"></thumb>
        </svg>
    </div>
</template>

<script>
module.exports = {
    data() {
        return {
            width: 1000,
            height: 1500,
            themes: ["Space", "Collaboration", "Time", "Agency", "??"]
        };
    },
    props: ["works", "students"],
    components: {
        thumb: httpVueLoader("./thumb.vue"),
        "theme-header": httpVueLoader("./theme-header.vue")
    },
    methods: {
        xPosForTheme(theme) {
            var themeIndex = this.themes.indexOf(theme);
            console.log(theme);
            console.log(themeIndex);
            return this.width * (themeIndex / this.themes.length);
        },
        xPosForWork(work) {
            var theme =
                (work.fields["Theme / Week"] &&
                    work.fields["Theme / Week"][0]) ||
                "??";
            return this.xPosForTheme(theme);
        }
    },
    computed: {
        viewbox() {
            return `0 0 ${this.width} ${this.height}`;
        }
    }
};
</script>

<style scoped>
.bounds {
    fill: none;
    stroke: black;
    stroke-dasharray: 5, 5;
    stroke-width: 1px;
}

.wrapper {
    height: 100%;
    position: absolute;
    width: 100%;
}

.mainSvg {
    height: 100%;
    width: 100%;
}
</style>