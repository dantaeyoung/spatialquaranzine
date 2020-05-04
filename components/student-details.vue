<template>
    <div class="workDetails">
        <h1>{{ name }}</h1>
        <div class="scrollContainer">
            <thumb class="work-thumb unskew"
                   v-for="(work, k) in worksForStudent"
                   :key="k"
                   :work="work" />
        </div>
    </div>
</template>
<script>
module.exports = {
    components: {
        thumb: httpVueLoader("./work-thumb.vue")
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
    grid-template-rows: 100px auto;
    height: 100vh;
}

.work-thumb {
    padding-bottom: 50px;
}
</style>