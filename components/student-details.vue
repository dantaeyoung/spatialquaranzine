<template>
    <div>
        <h1>{{ name }}</h1>
        <thumb v-for="(work, k) in worksForStudent"
               :key="k" :work="work" />
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
            return this.students.filter(s => s.id == this.$route.params.id)[0]
                .fields;
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
            return this.works.filter(w =>
                w.fields["Students"].includes(this.$route.params.id)
            );
        }
    },
    created() {
        this.$store.dispatch("fetch");
    }
};
</script>