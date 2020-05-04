<template>
    <section>
        <h1>About Spatial Quaranzine</h1>
        <plan-text-box :negative="true"> Spatial Quaranzine is an ongoing online publication / zine by Columbia GSAPP students about our
            present moment and near future, using spatial and architectural representations.

            Spatial Quaranzine was made as part of Architectural Drawing and Representation 2, a class taught in
            Spring 2020 by
            Dan Taeyoung, Andrew Heumann, Lexi Tsien-Shiang, Quentin Yiu, and Violet Whitney.</plan-text-box>
        <h1>About ADR2</h1>
        <section class="about-adr2">
            <plan-text-box> As architects, drawing and representation is one of our primary mediums. We draw futures that don't exist, spaces that haven't been changed yet. We draw and visualize and represent and render new possibilities, new futures, new kinds of spaces, new imaginations. The tools we use to design, architecture, shape our understanding of what architecture is. Drawing and representation are not just ways of putting our thoughts into the world. They are also ways of shaping our thoughts and our beliefs, and in turn, what we decide to design and in turn, what architecture we believe should be designed.</plan-text-box>
            <plan-text-box :negative="true">What is the role of architectural drawing and representation in relation to our built environment? What are the tools that are used to draw and represent? How have they and will they shape the way we draw and design architecture? How can we find ways of drawing that can enable us to be thoughtful and exploratory designers?</plan-text-box>
            <plan-text-box>Architectural Drawing and Representation 2 is a class about drawing and representation, and it's also a class about thinking about drawing and representation. The ultimate goal of ADR2 is to incubate your personal relationship with drawing, representation, and architecture by considering <strong>drawing as a practice.</strong>​ You are invited to develop your own style, and to invent your own drawing tools and representational processes. ADR2 is our opportunity to play, explore new methods of representation, consider diverse points of view, test alternative outcomes, and to experiment with how our methods of representation shapes our relationship to architecture.</plan-text-box>
        </section>
    </section>
</template>
<script>
module.exports = {
    components: {
        planTextBox: httpVueLoader("components/plan-text-box.vue")
    }
};
</script>
<style scoped>
.about-adr2 {
    display: flex;
}

.spacer {
    height: 300px;
}
</style>