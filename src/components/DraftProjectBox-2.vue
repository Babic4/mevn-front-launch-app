<template>
  <div class="box-draft-project" @click="onClickDraftProject">
    <div class="box-image-draft-project">
      <img
        v-if="project.image"
        :src="'http://localhost:3000/' + project.image"
      />
      <img v-else src="/img/default-project.png" />
    </div>
    <div v-if="project.title" class="title-draft-project">
      {{ project.title }}
    </div>
    <div v-else class="title-draft-project">project/{{ project._id }}</div>
  </div>
</template>
<script>
export default {
  props: ["project"],
  methods: {
    onClickDraftProject() {
      // console.log("Click DraftProjectBox" + " " + this.project._id);
      this.$router.push(`/update-project/${this.project._id}/basics`);
    },
  },
};
</script>
<style scoped>
.box-draft-project {
  display: flex;
  height: 150px;
  width: 100%;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.box-image-draft-project {
  background-color: #000;
  height: 100%;
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  overflow: hidden;
}

.box-image-draft-project > img {
  height: 100%;
}

.title-draft-project {
  font-size: 1.2em;
  font-weight: 600;
  flex-grow: 1;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .box-draft-project {
    height: 90px;
  }

  .title-draft-project {
    font-size: 0.9em;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-draft-project {
    height: 60px;
  }

  .title-draft-project {
    width: 160px;
    padding-right: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
