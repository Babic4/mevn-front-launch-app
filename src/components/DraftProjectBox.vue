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
  height: 25px;
  width: 100%;
  align-items: center;
  cursor: pointer;
  margin-bottom: 6px;
  overflow: hidden;
}

.box-image-draft-project {
  background-color: #000;
  height: 100%;
  width: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  overflow: hidden;
}

.box-image-draft-project > img {
  height: 100%;
}

.title-draft-project {
  font-size: 0.8em;
  width: 80%;
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
