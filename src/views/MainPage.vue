<template>
  <div class="middle">
    <div class="preview-box">
      <div class="text-preview">Что-то великое</div>
      <div class="statistik-box">
        <div class="stat">
          <div class="stat-name">Количество проектов</div>
          <div class="stat-value">100</div>
        </div>
        <div class="stat">
          <div class="stat-name">Общая сумма инвестиции</div>
          <div class="stat-value">1 000 000$</div>
        </div>
        <div class="stat">
          <div class="stat-name">Инвесторов</div>
          <div class="stat-value">100</div>
        </div>
      </div>
    </div>
    <div class="top-project" v-if="publishedProjects.length">
      <div class="top-box">Популярные</div>
      <div class="bottom-box">
        <div class="left-top-project">
          <ProjectBox :project="publishedProjects[1]" />
        </div>
        <div class="right-top-project">
          <ProjectBox :project="publishedProjects[1]" />
          <ProjectBox :project="publishedProjects[1]" />
        </div>
      </div>
    </div>
    <div class="new-projects-box">
      <Slider
        v-if="filmProject.length"
        title="Новые"
        filter="music"
        :projectsP="filmProject"
      />
    </div>
    <div class="about-box">
      <h2>О нас</h2>
      <div>
        Информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация информация информация информация информация информация
        информация
      </div>
    </div>
  </div>
</template>
<script>
import Slider from "@/components/Slider";
import ProjectBox from "@/components/ProjectBox";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  methods: {
    ...mapActions({
      fetchPublishedProjects: "fetchPublishedProjects",
    }),
  },
  computed: {
    ...mapState({
      publishedProjects: (state) => state.project.publishedProjects,
    }),
    ...mapGetters({
      filmProject: "filmProject",
    }),
  },
  mounted() {
    this.fetchPublishedProjects();
  },
  components: {
    Slider,
    ProjectBox,
  },
};
</script>
<style scoped>
.middle {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  padding: 0 12px;
}

.preview-box {
  margin: 12px;
  border-radius: 10px;
  padding: 150px 150px;
  width: 100%;
  color: #fff;
  background-color: #0000c5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.text-preview {
  font-size: 5em;
  font-size: 600;
  margin-bottom: 50px;
}

.statistik-box {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-name {
  font-size: 0.9em;
}

.stat-value {
  font-size: 1.5em;
}

.top-project {
  display: flex;
  flex-direction: column;
  background-color: rgba(21, 0, 255, 0.1);
  border-radius: 10px;
  padding: 100px 150px;
}

.top-box {
  padding-bottom: 24px;
  font-size: 1.1em;
  font-weight: 600;
}

.bottom-box {
  display: flex;
  justify-content: space-between;
}

.left-top-project {
  display: flex;
  width: 65%;
}

.right-top-project {
  display: flex;
  flex-direction: column;
  width: 35%;
}

.new-projects-box {
  width: 100%;
  margin: 100px 0;
}

.about-box {
  margin: 12px 0;
  background-color: white;
  border-radius: 10px;
  padding: 100px 150px;
}

.about-box > div {
  font-size: 0.9em;
}

.project-box {
  background-color: #fff;
  border-radius: 10px;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  /* */
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .input {
    padding: 0 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
