<template>
    <div class="wrapper">
        <svg class="mainSvg"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink"
             viewBox="0 0 1500 1000"
             @mousewheel="scrollHandle">
            <rect class="bounds"
                  :width="width"
                  :height="height"></rect>
            <student-label class="student-label"
                           v-for="(student, k) in students"
                           :key="`s-${k}`"
                           :x="200"
                           :y="200 + k * 25 - scrollY"
                           :student="student.fields"
                           @mouseover="hoveredStudent = student"
                           @mouseout="hoveredStudent = null"
                           :class="{fade: studentFade(student)}"></student-label>
            <thumb v-for="(work, wk) in works"
                   :x="xPosForWork(work)"
                   :y="yPosForWork(work)"
                   :key="`w-${wk}`"
                   :work="work"
                   :scroll="scrollY"
                   :selectedstudent="hoveredStudent"
                   @hover="workHover"></thumb>
            <theme-header v-for="theme in themes"
                          :theme="theme"
                          :key="`t-${theme}`"
                          :y="80"
                          :x="xPosForTheme(theme)+60" />
            <ellipse v-for="theme in themes"
                     :key="theme"
                     :cx="xPosForTheme(theme)+60"
                     :cy="100"
                     rx="3"
                     ry="3">

            </ellipse>
        </svg>
    </div>
</template>

<script>
module.exports = {
    data() {
        return {
            width: 1500,
            height: 1000,
            labelColWidth: 200,
            themes: ["Space", "Collaboration", "Time", "Agency", "??"],
            scrollY: 0,
            scrollX: 0,
            maxScrollX: 100,
            maxScrollY: 1500,
            hoveredStudent: null,
            hoveredWork: null
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
            return (
                this.labelColWidth +
                (this.width - this.labelColWidth) *
                    (themeIndex / this.themes.length)
            );
        },
        themeForWork(work) {
            return (
                (work.fields["Theme / Week"] &&
                    work.fields["Theme / Week"][0]) ||
                "??"
            );
        },
        xPosForWork(work) {
            var theme = this.themeForWork(work);
            return this.xPosForTheme(theme) + 60;
        },
        yPosForWork(work) {
            const offset = 200;
            const vSpacing = 110;
            const vIndex = this.yPositionsForWork[work.id] || 0;
            return offset + vSpacing * vIndex - this.scrollY * 0.3;
        },
        clamp(value, max, min) {
            return Math.min(Math.max(value, max), min);
        },
        scrollHandle(event) {
            this.scrollY += event.deltaY;
            this.scrollY = this.clamp(this.scrollY, 0, this.maxScrollY);
            this.scrollX += event.deltaX;
            event.preventDefault();
        },
        studentFade(student) {
            if (this.hoveredStudent) {
                return this.hoveredStudent.id != student.id;
            } else if (this.hoveredWork) {
                return !this.hoveredWork.fields["Students"].includes(
                    student.id
                );
            }
            return false;
        },
        workHover(work) {
            this.hoveredWork = work;
        }
    },
    computed: {
        viewbox() {
            return `0 0 ${this.width} ${this.height}`;
        },
        yPositionsForWork() {
            if (!this.themes || !this.works) return {};
            var themeDict = {};
            var yPosDict = {};
            for (let theme of this.themes) {
                themeDict[theme] = 0;
            }
            this.works.forEach(work => {
                var workTheme = this.themeForWork(work);
                const themeWorkCount = themeDict[workTheme];
                yPosDict[work.id] = themeWorkCount;
                themeDict[workTheme] += 1;
            });
            return yPosDict;
        }
    }
};
</script>

<style scoped>
.student-label {
    transition: opacity 100ms;
}

.fade {
    opacity: 0.4;
}

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