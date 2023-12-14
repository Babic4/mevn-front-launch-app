<template>
  <div class="middle">
    <div
      class="box-banner"
      v-if="
        $store.state.authorization.userAuth &&
        user._id == $store.state.authorization.userAuth._id
      "
    >
      <div class="text-banner">Редактировать</div>
      <button class="button-banner" @click="$router.push('/settings/profile')">
        <i class="fas fa-cog"></i>
      </button>
    </div>
    <div class="header-profile">
      <div class="box-img-profile">
        <img class="img-profile" :src="'http://localhost:3000/' + user.image" />
      </div>
      <div class="box-info-profile">
        <div class="name-profile">{{ user.name }}</div>
        <div class="info-profile">
          <span>
            Поддержал {{ calcInvestments() }} проекта
            <i class="fas fa-circle"></i>
            Присоеденился {{ calcDateCreated() }}
          </span>
        </div>
      </div>
    </div>
    <div class="tab">
      <div
        class="tablinks"
        :class="{ active: tab == 'info' }"
        @click="$router.push(`/profile/${this.id}/info`)"
        id="btnInfo"
      >
        Информация
      </div>
      <div
        class="tablinks"
        :class="{ active: tab == 'created-project' }"
        @click="$router.push(`/profile/${this.id}/created-project`)"
        id="btnCreatedProject"
      >
        Созданные проекты
      </div>
      <!-- <div
        class="tablinks"
        :class="{ active: tab == 'draft-project' }"
        @click="$router.push(`/profile/${this.id}/draft-project`)"
        id="btnDraftProject"
      >
        Черновые проекты
      </div> -->
      <div
        class="tablinks"
        :class="{ active: tab == 'following' }"
        @click="$router.push(`/profile/${this.id}/following`)"
        id="btnFollowing"
      >
        Избранное
      </div>
      <div
        class="tablinks"
        :class="{ active: tab == 'your-investments' }"
        @click="$router.push(`/profile/${this.id}/your-investments`)"
        id="btnYourInvestments"
      >
        Ваши инвестиции
      </div>
    </div>

    <!-- Tab content -->
    <div id="Info" class="tabcontent" v-if="tab == 'info'">
      <div class="info-box">
        <div class="title-info">Биография</div>
        <div class="textarea-info">{{ user.biography }}</div>
      </div>
      <div class="info-box">
        <div class="title-info">Веб-сайты</div>
        <div class="website" v-if="user.webSites.length">
          <a
            v-for="website in user.webSites"
            :key="website.id"
            :href="website"
            target="_blank"
          >
            {{ website.split(/\/+/)[1] }}
          </a>
        </div>
      </div>
    </div>

    <div
      id="CreatedProjects"
      class="tabcontent"
      v-if="tab == 'created-project'"
    >
      <div class="none" v-if="!projects.length">Нет созданных проектов</div>
      <ProjectBox v-for="i in projects" :key="i.key" :project="i" />
    </div>

    <!-- <div id="DraftProjects" class="tabcontent" v-if="tab == 'draft-project'">
      <ProjectBox v-for="i in projects" :key="i.key" :project="i" />
    </div> -->

    <div id="Following" class="tabcontent" v-if="tab == 'following'">
      <div class="none" v-if="!favorits.length">Нет избранных</div>
      <FavoritBox
        v-for="favorit in favorits"
        :key="favorit._id"
        :favorit="favorit"
      />
    </div>

    <div
      id="YourInvestments"
      class="tabcontent"
      v-if="tab == 'your-investments'"
    >
      <div class="none" v-if="!investments.length">Нет инвестиций</div>
      <investmentBox
        v-for="investment in investments"
        :key="investment._id"
        :investment="investment"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import ProjectBox from "@/components/ProjectBox";
import FavoritBox from "@/components/FavoritBox";
import InvestmentBox from "@/components/InvestmentBox";

export default {
  data() {
    return {
      id: null,
      tab: null,
      showInputSearch: false,
    };
  },
  methods: {
    ...mapActions({
      fetchUser: "fetchUser",
      fetchProjectsUs: "fetchProjectsUs",
      fetchFavorits: "fetchFavorits",
      fetchInvestmentsUser: "fetchInvestmentsUser",
    }),
    calcInvestments() {
      return this.investments.length;
    },
    calcDateCreated() {
      let months = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Ноябрь",
        "Декабрь",
      ];
      const date = new Date(this.user.created);
      return months[date.getMonth()] + " " + date.getFullYear();
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      projects: (state) => state.project.projects,
      favorits: (state) => state.favorit.favorits,
      investments: (state) => state.investment.investments,
    }),
    ...mapGetters({}),
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchUser(to.params.id);
    this.fetchInvestmentsUser(to.params.id);
    switch (to.params.tab) {
      case "created-project":
        this.fetchProjectsUs(to.params.id);
        break;
      case "following":
        this.fetchFavorits(to.params.id);
        break;
    }
    next();
    // обрабатываем изменение параметров маршрута...
    // не забываем вызвать next()
  },
  created() {
    this.fetchUser(this.$route.params.id);
    this.fetchInvestmentsUser(this.$route.params.id);
    switch (this.$route.params.tab) {
      case "created-project":
        this.fetchProjectsUs(this.$route.params.id);
        break;
      case "following":
        this.fetchFavorits(this.$route.params.id);
        break;
    }
  },
  mounted() {
    // if (!this.$route.params.tab) {
    //   this.$router.push(`/profile/${this.id}/info`);
    // }
    this.tab = this.$route.params.tab;
    this.id = this.$route.params.id;
    // this.fetchUser(this.id);
    // this.fetchProjectsUs(this.id);
    // this.fetchFavorits(this.id);
    // this.fetchInvestmentsUser(this.id);
  },
  updated() {
    // if (!this.$route.params.tab) {
    //   this.$router.push(`/profile/${this.id}/info`);
    // }
    if (this.tab != this.$route.params.tab) {
      this.tab = this.$route.params.tab;
    }
    if (this.id != this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  },
  components: {
    ProjectBox,
    FavoritBox,
    InvestmentBox,
  },
};
</script>

<style scoped>
.middle {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
}

.box-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  right: 24px;
  top: 12px;
  background: #ffffff;
  border-radius: 10px;
  height: 38px;
  overflow: hidden;
}

.text-banner {
  font-size: 0.8em;
  font-weight: 500;
  padding: 0 12px;
}

.button-banner {
  border: none;
  height: 100%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0000c5;
  color: #ffffff;
  cursor: pointer;
}

.button-banner:hover {
  background: #0040ff;
}

/* -------------------------------------- */

.header-profile {
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 750px;
}

.box-img-profile {
  width: 190px;
  height: 190px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
}

.img-profile {
  height: 100%;
  width: 100%;
}

.box-info-profile {
  padding-left: 25px;
}

.name-profile {
  font-weight: 600;
  font-size: 1.5em;
}

.info-profile {
  font-size: 0.8em;
  font-weight: 300;
  color: #7c878b;
  display: flex;
  align-items: center;
}

/* Style the tab */
.tab {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.tablinks {
  font-size: 0.8em;
  font-weight: 600;
  background-color: inherit;
  color: #000000;
  text-decoration: none;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

.active {
  color: #0000c5;
}

/* Style the tab content */
.tabcontent {
  display: flex;
  padding: 45px 0;
  border-top: none;
  flex-grow: 1;
  width: 100%;
}

#Info {
  flex-direction: column;
  width: 750px;
}

#CreatedProjects {
  display: flex;
  flex-wrap: wrap;
  width: 864px;
}

/* #DraftProjects {
  display: flex;
  flex-wrap: wrap;
  width: 864px;
} */

#Following {
  display: flex;
  flex-wrap: wrap;
  width: 864px;
}

#YourInvestments {
  flex-direction: column;
  align-items: center;
}

.investment-box {
  margin-bottom: 12px;
}

.investment-box:last-child {
  margin-bottom: 0;
}

.project-box {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 280px;
  height: 300px;
  border-radius: 10px;
}

.project-box {
  margin-left: 12px;
  margin-top: 12px;
}

.project-box:nth-child(3n + 1) {
  margin-left: 0;
}

.info-box {
  width: 100%;
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-info {
  margin-right: 12px;
  display: flex;
  font-size: 0.8em;
  font-weight: 600;
  color: #0000c5;
  width: 100px;
  height: 100%;
  text-align: center;
}

.textarea-info {
  width: 100%;
  /* width: 650px; */
  font-size: 0.8em;
}

.website {
  width: 100%;
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
}

.website > a {
  color: black;
}

.website > a:visited {
  color: black;
}

.info-profile > span > i {
  padding: 0 10px;
  font-size: 0.4em;
}

.info-profile > span {
  display: flex;
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
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  #CreatedProjects,
  #Following {
    width: 572px;
  }

  .project-box:nth-child(3n + 1) {
    margin-left: 12px;
  }

  .project-box:nth-child(2n + 1) {
    margin-left: 0;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .box-banner {
    right: 12px;
  }

  .header-profile {
    width: auto;
    flex-direction: column;
  }

  .box-img-profile {
    margin-bottom: 12px;
  }

  .name-profile {
    text-align: center;
  }

  #Info {
    width: 100%;
  }

  .tab {
    white-space: nowrap;
    overflow-x: scroll;
    /* flex-direction: column; */
    justify-content: flex-start;
  }

  .tablinks {
    padding: 14px 16px;
  }

  .tabcontent {
    padding: 45px 24px;
  }

  .info-box {
    flex-direction: column;
  }

  .title-info {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .box-info-profile {
    padding: 0;
  }

  #CreatedProjects,
  #Following {
    width: 280px;
  }

  .project-box {
    margin-left: 0;
  }

  .project-box:nth-child(3n + 1) {
    margin-left: 0;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-banner {
    width: 94%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  .header-profile {
    padding-top: 64px;
  }

  .tabcontent {
    padding: 45px 12px;
  }

  #CreatedProjects,
  #Following {
    width: 100%;
  }

  .box-img-profile {
    height: 130px;
    width: 130px;
  }

  .project-box {
    width: 100%;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
