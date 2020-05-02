<template>
<div class="thumbnailnav">

  <div id="nav_arrows" class="skew-n15">
    <div id="left_arrow" class="nav-arrow nav-border">&lt;</div>
    <div id="current_info" class="nav-border">
      <div class="title">House vs. Quarantine House</div>
      <div class="authors">Cara DePippo</div>
    </div>
    <div id="right_arrow" class="nav-arrow nav-border">&gt;</div>
  </div>

  <div id="thumbnail_container">
    <div class="thumbnail skewhover skew-15" v-for="(work, wk) in works" v-on:click="thumbclicked" :id="work.id" :class="thumbnailClasses(work)">
      <!--<div class="work_title">{{ work.fields.Title }}</div>-->
      <div class="work_image"><img :src="smallThumb(work)" /></div>
    </div>
  </div> 

</div>
</template>
 

<script>
module.exports = {
    data: function () {
      return {
        clickedWorkID: null,
      }
    },
    props: ["works", "students"],
    components: {
        thumb: httpVueLoader("./thumb.vue"),
    },
    methods: {
      thumbnailClasses(work) {
        return { 
          "isClicked" : work.id == this.clickedWorkID
        };
      },
      thumbclicked(event) {
        this.clickedWorkID = event.currentTarget.id;
        this.$emit('thumbclicked', event.currentTarget.id);
      },
      smallThumb(work) {
        try {
          return work.fields["Images (PNG, JPG, GIF)"][0]['thumbnails']['large']['url'] ;
        } catch {
          return "";
        }
      }
    },
    computed: {
    }
};
</script>

<style scoped>
#thumbnail_container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  padding: 0 20px;
  justify-content: center;
}

.thumbnail {
  border: 2px solid black;
  height: 100px;
  width: 100px !important;
  margin: 2px;
}

.thumbnail:hover {
    transform: skew(0deg, 0deg) rotate(0deg) scale(1, 1) !important;
    border: 3px solid #32A198;
    margin: 4px;
  }

.work_image {height: 100%; object-fit: cover;  width: 100%; }
.work_image img {height: 100%; object-fit: cover;  width: 100%; }

.isClicked {
  margin: 0px;
  border: 4px solid #2E8CCF;
  transform: skew(0deg, 0deg) rotate(0deg) scale(1, 1) !important;
}

</style>
