<template>
    <div class="workDetails">
        <div class="scrollContainer">
            <workstack
                   v-for="(work, k) in worksForStudent"
                   :key="k"
                   :work="work" />
        </div>
        <div class="header" style="grid-row: 1;">
        <h2 class="titlebox skew-15" >{{ name }}</h2>
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
    created() {
        this.$store.dispatch("fetch");
    }
};
</script>
<style scoped>
.workDetails {
    display: grid;
    grid-template-rows: 10px auto;
    height: 100vh;
}

.work-thumb:first-of-type {
    padding-top: 200px;
}
</style>