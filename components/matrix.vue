<template>
    <div class="grid">
        <div class="header">
            <h1 class="skew-15 titlebox">All Work</h1>
        </div>
        <div class="wrapper">
            <svg class="mainSvg"
                 xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink"
                 viewBox="0 0 1500 1200"
                 @mousewheel="scrollHandle">
                <rect class="bounds"
                      :width="width"
                      :height="height"></rect>
                <student-label class="student-label"
                               v-for="(student, k) in studentsSorted"
                               :key="`s-${k}`"
                               :x="xForStudent"
                               :y="yForStudent(k)"
                               :student="student.fields"
                               @mouseover="hoveredStudent = student"
                               @mouseout="hoveredStudent = null"
                               @click="studentClick(student)"
                               :class="{fade: studentFade(student)}"></student-label>
                <g v-for="(student, k) in studentsSorted"
                   :key="`st-${k}`">
                    <path v-for="({workid, path}, key) in pathsForStudent(student, k)"
                          :class="{fade: pathFade(student, workid)}"
                          :key="`path-${key}`"
                          :d="path"
                          stroke="black"
                          fill="transparent" />

                </g>
                <thumb v-for="(work, wk) in worksSorted"
                       :x="xPosForWork(work)"
                       :y="yPosForWork(work)"
                       :key="`w-${wk}`"
                       :work="work"
                       :scroll="scrollY"
                       :selectedstudent="hoveredStudent"
                       :hoveredWork="hoveredWork"
                       :topbuffer="topbuffer"
                       @hover="workHover"></thumb>
                <theme-header v-for="theme in themes"
                              :theme="theme"
                              :key="`t-${theme}`"
                              :y="80+topbuffer"
                              :x="xPosForTheme(theme)+60" />
                <ellipse v-for="theme in themes"
                         :key="theme"
                         :cx="xPosForTheme(theme)+60"
                         :cy="100 + topbuffer"
                         rx="3"
                         ry="3">

                </ellipse>
            </svg>
        </div>
    </div>
</template>

<script>
module.exports = {
    data() {
        return {
            topbuffer: 160,
            width: 1500,
            height: 1200,
            studentSpacing: 25,
            workSpacing: 110,
            labelColWidth: 150,
            themes: ["Space", "Collaboration", "Time", "Agency"],
            scrollY: 0,
            scrollX: 0,
            maxScrollX: 100,
            hoveredStudent: null,
            hoveredWork: null,
            studentsSorted: [],
            worksSorted: [],
            tallestColumn: 0,
            themeDict: {},
            includeStudentsWithNoWork: false,
            xForStudent: 200
        };
    },
    components: {
        thumb: httpVueLoader("./thumb.vue"),
        "theme-header": httpVueLoader("./theme-header.vue"),
        "student-label": httpVueLoader("./student-label.vue")
    },
    methods: {
        xPosForTheme(theme) {
            var themeIndex = this.themes.indexOf(theme);
            return (
                this.xForStudent +
                100 +
                (this.width - this.labelColWidth) *
                    (themeIndex / this.themes.length)
            );
        },
        themeForWork(work) {
            const index = this.works.map(w => w.id).indexOf(work.id);
            return this.$store.state.workThemes[index];
            // const themes = this.themesForWork(work);
            // return (themes && themes[0]) || "??";
        },
        themesForWork(work) {
            if (!work) return [];
            return work.fields["Theme / Week"] && work.fields["Theme / Week"];
        },
        xPosForWork(work) {
            var theme = this.themeForWork(work);
            return this.xPosForTheme(theme) + 60;
        },
        yPosForWork(work) {
            const offset = 200 + this.topbuffer;
            const vSpacing = this.workSpacing;
            const vIndex =
                (this.yPositionsForWork && this.yPositionsForWork[work.id]) ||
                0;
            return (
                offset +
                vSpacing * vIndex -
                this.scrollY * this.scrollRatioForWork(work)
            );
        },
        scrollRatioForWork(work) {
            const theme = this.themeForWork(work);
            const themeIndex = this.themes.indexOf(theme);
            return this.themeScrollRatios[themeIndex];
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
        pathFade(student, workid) {
            if (this.hoveredStudent) {
                return this.hoveredStudent.id != student.id;
            } else if (this.hoveredWork) {
                return this.hoveredWork.id != workid;
            }
            return true;
        },
        workHover(work) {
            this.hoveredWork = work;
        },
        workForId(workid) {
            const matching = this.works.filter(w => w.id == workid)
            if(matching.length) {
                return matching[0]
            } else {
                return null
            }
        },
        pathsForStudent(student, k) {
            const xForStudent = this.xForStudent + 5;
            const yForStudent = this.yForStudent(k);
            const x2 = xForStudent + 100;
            const paths = [] 
            student.fields["Work"].forEach(workid => {
                
                const work = this.workForId(workid);
                if(!work) return;
                const xForWork = this.xPosForWork(work);
                const yForWork = this.yPosForWork(work);
                const x3 = xForWork - 100;
                paths.push({
                    workid: workid,
                    path: `M ${xForStudent} ${yForStudent} C ${x2} ${yForStudent}, ${x3} ${yForWork}, ${xForWork} ${yForWork}`
                });
            });
            return paths;
        },
        yForStudent(i) {
            return (
                200 + this.topbuffer +
                i * this.studentSpacing -
                this.scrollY * this.studentScrollMultiplier
            );
        },
        studentClick(student) {
            this.$router.push({
                name: "student",
                params: {
                    id: student.id,
                    studentName: student.fields["Name"].replace(" ", "")
                }
            });
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
                    (!student.fields.Work && !this.includeStudentsWithNoWork) ||
                    studentsOrdered.includes(student)
                ) {
                    return;
                }
                // remove this student from the list remaining
                studentsToSort = studentsToSort.filter(s => s.id != student.id);
                // add this student to the sorted list
                studentsOrdered.push(student);
                // get this student's works
                const worksForStudent = worksToSort.filter(
                    w =>
                        w.fields["Students"] &&
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
        students() {
            return this.$store.getters.studentsWithWork;
        },
        works() {
            return this.$store.state.works;
        },
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
            this.themeDict = themeDict;
            return yPosDict;
        },
        maxHeightStudents() {
            return this.studentsSorted.length * this.studentSpacing;
        },
        maxHeightWorks() {
            return this.tallestColumn * this.workSpacing;
        },
        maxScrollY() {
            return this.maxHeightWorks - this.height + 400;
        },
        studentScrollMultiplier() {
            var winHeight = this.height - 400;
            return (
                (this.maxHeightStudents - winHeight) /
                (this.maxHeightWorks - winHeight)
            );
        },
        themeScrollRatios() {
            const ratios = this.themes.map(
                t => this.themeDict[t] / this.tallestColumn
            );

            return ratios;
        }
    },
    watch: {
        works() {
            this.processStudentsAndWorks();
        },
        students() {
            this.processStudentsAndWorks();
        }
    },
    created() {
        this.$store.dispatch("fetch");
    },
    mounted() {
        this.processStudentsAndWorks();
    }
};
</script>

<style scoped>
.student-label {
    transition: opacity 100ms;
}

path.fade {
    opacity: 0.1;
}

.fade {
    opacity: 0.4;
}

.bounds {
    fill: none;
    /* stroke: black;
    stroke-dasharray: 5, 5;
    stroke-width: 1px; */
}

.wrapper {
    height: 100%;
    position: relative;
    width: 100%;
}

.mainSvg {
    height: 100%;
    position: absolute;
    width: 100%;
}

.titlebox {
    position: absolute;
    right: 40px;
}

.header {
    grid-row: 0;
    
}

.grid {
    display: grid;
    grid-template-rows: 10px auto;
    height: 100vh;
}
</style>