<template>
  <div
    class="project-box"
    :class="{ favorit: fav && isFavorit }"
    @click="onClickProject"
  >
    <div class="img-box">
      <img
        v-if="project.image"
        class="img"
        :src="'http://localhost:3000/' + project.image"
      />
      <img v-else class="img" src="/img/default-project.png" />
    </div>
    <div class="info-project">
      <div class="top-block">
        <div class="title">{{ project.title }}</div>
        <div class="description">{{ project.description }}</div>
      </div>
      <div class="bottom-block">
        <div class="name-creator">Создатель {{ project.ownerId.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: ["project", "fav"],
  methods: {
    onClickProject() {
      this.$router.push(`/project/${this.project._id}/compaing`);
      // console.log("Click ProjectBox");
    },
  },
  computed: {
    ...mapState({
      favorits: (state) => state.favorit.favorits,
    }),
    isFavorit() {
      for (let i = 0; i < this.favorits.length; i++) {
        if (this.favorits[i].projectId._id == this.project._id) return true;
      }
      return false;
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

.top-block,
.bottom-block {
  display: flex;
  flex-direction: column;
}

.title {
  padding-bottom: 5px;
  font-size: 0.9em;
  color: #1400ff;
  font-weight: 600;
}

.description {
  font-size: 0.75em;
  font-weight: 300;
}

.name-creator {
  margin-top: 12px;
  font-size: 0.7em;
  font-weight: 300;
  font-style: italic;
}

.favorit {
  outline: 4px solid rgba(255, 204, 96, 0.4);
  border: 3px solid #ffcc60;
}
</style>
