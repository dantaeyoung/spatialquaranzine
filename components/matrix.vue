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
                           v-for="(student, k) in studentsSorted"
                           :key="`s-${k}`"
                           :x="200"
                           :y="200 + k * studentSpacing - scrollY * studentScrollMultiplier"
                           :student="student.fields"
                           @mouseover="hoveredStudent = student"
                           @mouseout="hoveredStudent = null"
                           :class="{fade: studentFade(student)}"></student-label>
            <thumb v-for="(work, wk) in worksSorted"
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
            studentSpacing: 25,
            workSpacing: 110,
            labelColWidth: 200,
            themes: ["Space", "Collaboration", "Time", "Agency", "??"],
            scrollY: 0,
            scrollX: 0,
            maxScrollX: 100,
            hoveredStudent: null,
            hoveredWork: null,
            studentsSorted: [],
            worksSorted: [],
            tallestColumn: 0,
            includeStudentsWithNoWork: false
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
            const vSpacing = this.workSpacing;
            const vIndex = this.yPositionsForWork[work.id] || 0;
            return offset + vSpacing * vIndex - this.scrollY;
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
        },
        processStudentsAndWorks() {
            if (!this.students || !this.works) {
                return;
            }
            let studentsToSort = [...this.students];
            let worksToSort = [...this.works];
            const studentsOrdered = [];
            const worksOrdered = [];
            const processWork = work => {
                console.log(`processing work ${work.fields.Title}`);
                if (work.id == "rec6JiLeophyM8M6b") {
                    console.log(worksToSort.map(w => w.fields.Title));
                }
                //exit if we've run out of works
                if (
                    !worksToSort.length ||
                    !work ||
                    worksOrdered.includes(work)
                ) {
                    return;
                }
                // remove this work from the list remaining
                worksToSort = worksToSort.filter(w => w.id != work.id);
                if (work.id == "rec6JiLeophyM8M6b") {
                    console.log(worksToSort.map(w => w.fields.Title));
                }
                // add this work to the list
                worksOrdered.push(work);

                // get the other students
                var studentsForWork = studentsToSort.filter(s =>
                    work.fields["Students"].includes(s.id)
                );

                // process them
                studentsForWork.forEach(processStudent);
            };
            const processStudent = student => {
                console.log(`processing student ${student.fields.Name}`);
                //exit if we've run out of students
                if (
                    !studentsToSort.length ||
                    !student ||
                    (!student.fields.Work && !this.includeStudentsWithNoWork)
                ) {
                    return;
                }
                // remove this student from the list remaining
                studentsToSort = studentsToSort.filter(s => s.id != student.id);
                // add this student to the sorted list
                studentsOrdered.push(student);
                // get this student's works
                const worksForStudent = worksToSort.filter(w =>
                    w.fields["Students"].includes(student.id)
                );
                // process this student's works
                worksForStudent.forEach(processWork);
            };

            while (studentsToSort.length) {
                processStudent(studentsToSort.pop());
            }

            this.studentsSorted = studentsOrdered;
            this.worksSorted = worksOrdered;
        }
    },
    computed: {
        viewbox() {
            return `0 0 ${this.width} ${this.height}`;
        },
        yPositionsForWork() {
            if (!this.themes || !this.worksSorted) return {};
            var themeDict = {};
            var yPosDict = {};
            for (let theme of this.themes) {
                themeDict[theme] = 0;
            }
            this.worksSorted.forEach(work => {
                var workTheme = this.themeForWork(work);
                const themeWorkCount = themeDict[workTheme];
                yPosDict[work.id] = themeWorkCount;
                themeDict[workTheme] += 1;
                if (themeDict[workTheme] > this.tallestColumn) {
                    this.tallestColumn = themeDict[workTheme];
                }
            });
            return yPosDict;
        },
        maxHeightStudents() {
            return this.studentsSorted.length * this.studentSpacing;
        },
        maxHeightWorks() {
            return this.tallestColumn * this.workSpacing;
        },
        maxScrollY() {
            return this.maxHeightWorks - window.innerHeight + 400;
        },
        studentScrollMultiplier() {
            var winHeight = window.innerHeight - 400;
            return (
                (this.maxHeightStudents - winHeight) /
                (this.maxHeightWorks - winHeight)
            );
        }
    },
    watch: {
        works() {
            this.processStudentsAndWorks();
        },
        students() {
            this.processStudentsAndWorks();
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