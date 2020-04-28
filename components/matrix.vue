<template>
    <div class="wrapper">
        <svg class="mainSvg"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 1200 1500">
            <rect class="bounds"
                  :width="width"
                  :height="height"></rect>
            <theme-header v-for="theme in themes"
                          :theme="theme"
                          :key="theme"
                          :y="80"
                          :x="xPosForTheme(theme)" />
            <ellipse v-for="theme in themes"
                     :key="theme"
                     :cx="xPosForTheme(theme)+60"
                     :cy="100"
                     rx="3"
                     ry="3">

            </ellipse>
            <thumb v-for="(work, wk) in works"
                   :x="xPosForWork(work)"
                   :y="200+110*wk"
                   :key="`w-${wk}`"
                   :work="work"></thumb>
            <student-label v-for="(student, k) in students"
                           :key="`s-${k}`"
                           :x="0"
                           :y="200 + k * 25"
                           :student="student.fields"></student-label>
        </svg>
    </div>
</template>

<script>
module.exports = {
    data() {
        return {
            width: 1200,
            height: 1500,
            labelColWidth: 200,
            themes: ["Space", "Collaboration", "Time", "Agency", "??"]
        };
    },
    props: ["works", "students"],
    components: {
        thumb: httpVueLoader("./thumb.vue"),
        "theme-header": httpVueLoader("./theme-header.vue"),
        "student-label": httpVueLoader("./student-label.vue")
    },
    methods: {
        xPosForTheme(theme) {
            var themeIndex = this.themes.indexOf(theme);
            return this.labelColWidth + (this.width-this.labelColWidth) * (themeIndex / this.themes.length);
        },
        xPosForWork(work) {
            var theme =
                (work.fields["Theme / Week"] &&
                    work.fields["Theme / Week"][0]) ||
                "??";
            return this.xPosForTheme(theme)+60;
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