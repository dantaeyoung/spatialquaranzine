<template>
<div id="workdisplay" v-if="currentWorkData">

  <div id="work_info">
    <div class="title">{{ currentWorkData.fields.Title}}</div>
    <div class="description">{{ currentWorkData.fields.Description}}</div>
    <div class="keywords">{{ currentWorkData.fields["Keywords (Hashtags!)"] }}</div>
    <div class="theme">{{ currentWorkData.fields["Theme/Week"] }}</div>
    <div id="authors">
      <div v-for="(student, k) in currentStudentData" >{{student.fields.Name}} </div>
    </div> 
  </div>

  <div id="work_embed">
    <div class="work_image" v-for="(img, i) in currentImages"><img :src="img.url" /></div>
    <div class="public_url">{{ currentWorkData.fields["Public URL / Video"] }}</div>
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
    props: ["works", "students", "currentwork"],
    components: {
        thumb: httpVueLoader("./thumb.vue"),
    },
    methods: {
      thumbnailClasses(work) {
        return { 
          "isClicked" : work.id == this.clickedWorkID
        };
      },
      smallThumb(work) {
        try {
          return work.fields["Images (PNG, JPG, GIF)"][0]['thumbnails']['large']['url'] ;
        } catch {
          return "";
        }
      },
    },
    computed: {
      currentWorkData() {
        try {
          let currentworkID = this.currentwork;
          let matchingworks = this.works.filter((work) => {
            return work.id === currentworkID;
          });
          return matchingworks[0];
        } catch {
          return null; 
        }
      },
      currentStudentData() {
        try {
          let currentStudentIDs = this.currentWorkData.fields.Students;
          let matchingStudents= this.students.filter((student) => {
            return currentStudentIDs.includes(student.id)
          });
          console.log(matchingStudents);
          return matchingStudents;
        } catch {
          return [];
        }
      },
      currentImages() {
        try {
          let data = this.currentWorkData.fields["Images (PNG, JPG, GIF)"];
          return data.map((img) => {
            return img.thumbnails["full"];
          });
        } catch {
          return null;
        }
      },
    }
};
</script>

<style scoped>
#workdisplay {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  padding: 0 20px;
  justify-content: center;
}


.work_image {
  margin: 0px 20px;
}

.work_image img {
  max-width: 100%;
  max-height: 50vh;
  margin, padding: 0px;
}

</style>
