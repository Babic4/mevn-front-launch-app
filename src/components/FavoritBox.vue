<template>
  <div class="project-box" @click="onClickProject">
    <div class="img-box">
      <img
        v-if="favorit.projectId.image"
        class="img"
        :src="'http://localhost:3000/' + favorit.projectId.image"
      />
      <img v-else class="img" src="/img/default-project.png" />
    </div>
    <div class="info-project">
      <div class="top-block">
        <div class="title">{{ favorit.projectId.title }}</div>
        <div class="description">{{ favorit.projectId.description }}</div>
      </div>
      <div class="bottom-block">
        <div class="name-creator">Создатель {{ favorit.userId.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["favorit"],
  methods: {
    onClickProject() {
      this.$router.push(`/project/${this.favorit.projectId._id}/compaing`);
    },
  },
};
</script>

<style scoped>
/* 'http://localhost:3000/'  */

.img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 45%;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
}

.img {
  width: 100%;
}

.info-project {
  flex-grow: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  padding-bottom: 5px;
  font-size: 0.9em;
  color: #1400ff;
  font-weight: 600;
}

.description {
  font-size: 0.8em;
  font-weight: 300;
}

.name-creator {
  margin-top: 12px;
  font-size: 0.7em;
  font-weight: 300;
  font-style: italic;
}

.top-block,
.bottom-block {
  display: flex;
  flex-direction: column;
}

.favorit {
  outline: 3px solid rgba(255, 204, 96, 0.4);
  border: 2px solid #ffcc60;
}
</style>
