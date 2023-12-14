<template>
  <div class="middle">
    <div class="filter">
      <button
        class="tabfilter"
        :class="{ active: tab == 'design' }"
        @click="
          tab == 'design'
            ? $router.push('/projects')
            : $router.push('/projects/design')
        "
      >
        Дизайн
      </button>
      <button
        class="tabfilter"
        :class="{ active: tab == 'film' }"
        @click="
          tab =
            tab == 'film'
              ? $router.push('/projects')
              : $router.push('/projects/film')
        "
      >
        Фильмы
      </button>
      <button
        class="tabfilter"
        :class="{ active: tab == 'tech' }"
        @click="
          tab == 'tech'
            ? $router.push('/projects')
            : $router.push('/projects/tech')
        "
      >
        Технологии
      </button>
      <button
        class="tabfilter"
        :class="{ active: tab == 'game' }"
        @click="
          tab == 'game'
            ? $router.push('/projects')
            : $router.push('/projects/game')
        "
      >
        Игры
      </button>
      <button
        class="tabfilter"
        :class="{ active: tab == 'music' }"
        @click="
          tab == 'music'
            ? $router.push('/projects')
            : $router.push('/projects/music')
        "
      >
        Музыка
      </button>
    </div>
    <div v-if="!tab">
      <div v-if="!publishedProjects">Проектов нет</div>
      <div v-else class="box-sliders">
        <Slider
          v-if="designProject.length"
          title="Дизайн"
          filter="design"
          :projectsP="designProject"
        ></Slider>
        <Slider
          v-if="filmProject.length"
          title="Фильмы"
          filter="film"
          :projectsP="filmProject"
        ></Slider>
        <Slider
          v-if="techProject.length"
          title="Технологии"
          filter="tech"
          :projectsP="techProject"
        ></Slider>
        <Slider
          v-if="gameProject.length"
          title="Игры"
          filter="game"
          :projectsP="gameProject"
        ></Slider>
        <Slider
          v-if="musicProject.length"
          title="Музыка"
          filter="music"
          :projectsP="musicProject"
        ></Slider>
      </div>
    </div>
    <div v-else class="filter-box">
      <div>
        <div class="none" v-if="!filterProjects.length">Нет проектов</div>
        <ProjectBox
          v-for="project in filterProjects"
          :key="project._id"
          :project="project"
          :fav="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import Component
import Slider from "@/components/Slider";
import ProjectBox from "@/components/ProjectBox";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      tab: null,
      filter: null,
    };
  },
  methods: {
    ...mapActions({
      fetchPublishedProjects: "fetchPublishedProjects",
      fetchFavorits: "fetchFavorits",
      fetchFilterProjects: "fetchFilterProjects",
    }),
  },
  computed: {
    ...mapState({
      publishedProjects: (state) => state.project.publishedProjects,
      filterProjects: (state) => state.project.filterProjects,
    }),
    ...mapGetters({
      designProject: "designProject",
      filmProject: "filmProject",
      techProject: "techProject",
      gameProject: "gameProject",
      musicProject: "musicProject",
    }),
  },
  mounted() {
    this.tab = this.$route.params.tab;
    this.fetchPublishedProjects();
    if (this.$store.state.authorization.userAuth) {
      this.fetchFavorits(this.$store.state.authorization.userAuth._id);
    }
    if (this.tab) {
      this.fetchFilterProjects(this.tab);
    }
  },
  updated() {
    if (this.tab != this.$route.params.tab) {
      this.tab = this.$route.params.tab;
      this.fetchFilterProjects(this.tab);
    }
  },
  components: {
    Slider,
    ProjectBox,
  },
};
</script>

<style scoped>
/* -------------------------------------- */
.middle {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

/* Style the tab */
.filter {
  margin: 5px 0 25px 0;
  overflow: hidden;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabfilter {
  font-size: 0.8em;
  font-weight: 600;
}

/* Style the buttons that are used to open the tab content */
.filter button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

/* Change background color of buttons on hover */
/* .tab button:hover {
    background-color: #ddd;
  }
   */
/* Create an active/current tablink class */
.filter button.active {
  color: #0000c5;
}

/* Style the tab content */
.tabcontent {
  display: none;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
}

.filter-box {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.filter-box > div {
  display: flex;
  flex-wrap: wrap;
  width: 1156px;
}

.filter-box > div > .project-box {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 280px;
  height: 300px;
  border-radius: 10px;
  margin-left: 12px;
  margin-top: 12px;
}

.filter-box > div > .project-box:nth-child(4n + 1) {
  margin-left: 0;
}

.box-sliders {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.none {
  color: #7c878b;
  width: 100%;
  text-align: center;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  .filter-box > div {
    width: 864px;
  }

  .filter-box > div > .project-box:nth-child(4n + 1) {
    margin-left: 12px;
  }

  .filter-box > div > .project-box:nth-child(3n + 1) {
    margin-left: 0;
  }
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  .filter-box > div {
    width: 572px;
  }

  .filter-box > div > .project-box:nth-child(3n + 1) {
    margin-left: 12px;
  }

  .filter-box > div > .project-box:nth-child(2n + 1) {
    margin-left: 0;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .box-sliders {
    padding: 0 24px;
  }

  .filter-box > div {
    width: 100%;
    padding: 0 24px;
    justify-content: center;
  }

  .filter-box > div > .project-box {
    width: 370px;
    height: 330px;
    margin-left: 0;
  }

  .filter-box > div > .project-box:nth-child(3n + 1) {
    margin-left: 0;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .filter {
    white-space: nowrap;
    overflow-x: scroll;
    justify-content: flex-start;
  }

  .box-sliders {
    padding: 0 12px;
  }

  .filter-box > div {
    padding: 0 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
