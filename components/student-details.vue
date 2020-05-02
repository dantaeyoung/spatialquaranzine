<template>
    <div>
        <h1>{{ name }}</h1>
    </div>
</template>
<script>
module.exports = {
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
        }
    },
    created() {
        this.$store.dispatch("fetch");
    }
};
</script>