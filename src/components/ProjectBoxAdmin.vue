<template>
  <div class="box-project">
    <div class="box-image-project">
      <img
        v-if="project.image"
        :src="'http://localhost:3000/' + project.image"
      />
      <img v-else src="/img/default-project.png" />
    </div>
    <div v-if="project.title" class="title-project">
      {{ project.title }}
    </div>
    <div v-else class="title-project">
      project/{{ project._id.slice(0, 7) + "..." }}
    </div>
  </div>
</template>
<script>
export default {
  props: ["project"],
};
</script>
<style scoped>
.box-project {
  display: flex;
  height: 40px;
  width: 100%;
  align-items: center;
  cursor: pointer;
  margin-bottom: 6px;
  overflow: hidden;
}

.box-image-project {
  background-color: #000;
  height: 100%;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  overflow: hidden;
}

.box-image-project > img {
  height: 100%;
}

.title-project {
  font-size: 0.75em;
  width: 100%;
}
</style>
