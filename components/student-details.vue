<template>
    <div class="workDetails">
        <div class="scrollContainer">
            <workstack v-for="(work, k) in worksForStudent"
                       :key="k"
                       :work="work" />
        </div>
        <div class="header"
             style="grid-row: 1;">
            <div class="nav-arrows skew-15">
                <div id="left_arrow"
                     @click="goToStudent(-1)"
                     class="nav-arrow nav-border">&lt;</div>
                <h2 class="titlebox ">{{ name }}</h2>

                <div id="right_arrow"
                     @click="goToStudent(1)"
                     class="nav-arrow nav-border">&gt;</div>
            </div>
        </div>
    </div>
</template>
<script>
module.exports = {
    components: {
        workstack: httpVueLoader("./work-stack.vue")
    },
    data() {
        return {};
    },
    computed: {
        student() {
            if (!this.students || !this.students.length) {
                return null;
            }
            const foundStudent = this.students.filter(
                s => s.id == this.$route.params.id
            );
            return foundStudent[0] && foundStudent[0].fields;
        },
        name() {
            return this.student && this.student["Name"];
        },
        students() {
            return this.$store.state.students;
        },
        works() {
            return this.$store.state.works;
        },
        worksForStudent() {
            return this.works.filter(
                w =>
                    w.fields["Students"] &&
                    w.fields["Students"].includes(this.$route.params.id)
            );
        }
    },
    methods: {
        goToStudent(delta) {
            const allIds = this.students.map(w => w.id);
            const thisIndex = allIds.indexOf(this.$route.params.id);
            const newIndex =
                (thisIndex + delta + this.students.length) %
                this.students.length;
            this.$router.push({
                name: "student",
                params: {
                    id: allIds[newIndex],
                    studentName: this.students[newIndex].fields["Name"].replace(" ", "")
                }
            });
        }
    },
    created() {
        this.$store.dispatch("fetch");
    }
};
</script>
<style scoped>
.header {
    padding-top: 100px;
}

.header h2 {
    text-align: center;
    width: 300px;
}

.nav-arrows {
    margin-top: 80px;
}

.nav-arrow {
    margin-bottom: 80px;
    margin-top: 80px;
}

.workDetails {
    display: grid;
    grid-template-rows: 10px auto;
    height: 100vh;
}
</style>