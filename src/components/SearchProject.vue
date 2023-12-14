<template>
  <div class="box-search-project" @click="onClickProject">
    <div class="box-image-search-project">
      <img
        v-if="project.image"
        class="image-search-project"
        :src="'http://localhost:3000/' + project.image"
      />
      <img v-else class="img" src="/img/default-project.png" />
    </div>
    <div class="title-search-project">{{ project.title }}</div>
  </div>
</template>
<script>
export default {
  props: ["project"],
  emits: ["close"],
  methods: {
    onClickProject() {
      this.$emit("close");
      this.$router.push(`/project/${this.project._id}/compaing`);
      // console.log("Click ProjectBox");
    },
  },
};
</script>
<style scoped>
.box-search-project {
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 100px;
  margin-bottom: 12px;
  align-items: center;
}

.box-search-project:last-child {
  margin-bottom: 0px;
}

.box-image-search-project {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 160px;
  margin-right: 36px;
  overflow: hidden;
  background-color: #000;
}

.image-search-project {
  height: 100%;
}

.title-search-project {
  width: 80%;
  flex-grow: 1;
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
  .box-image-search-project {
    width: 160px;
    height: 90px;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .box-image-search-project {
    width: 130px;
    height: 75px;
  }

  .title-search-project {
    font-size: 0.8em;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-image-search-project {
    width: 100px;
    height: 60px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
