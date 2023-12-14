<template>
  <ConfirmAdmin
    v-if="showConfirm"
    @close="showConfirm = false"
    @proceed="publishProject"
  />
  <AlertAdmin ref="alert" />
  <div class="page">
    <div class="left-box">
      <div class="logo">
        <img src="/img/logo-2.svg" />
      </div>
      <div class="before-logo">Панель администратора</div>
      <div class="box-search">
        <div class="search" :class="{ 'search-focus': focus }">
          <input
            ref="search"
            type="text"
            placeholder="Поиск..."
            autocomplete="off"
            class="search-input"
            v-model="textSearch"
            @input="callSearch"
            @focus="focus = true"
          />
          <div class="btn-search">
            <i
              class="fas fa-times close"
              v-if="focus"
              @click="focus = false"
            ></i>
            <i class="fas fa-search" v-else></i>
          </div>
        </div>
        <div class="result-search" v-if="this.sProjects.length && focus">
          <div v-if="this.sProjects.length">
            <div class="search-projects">
              <ProjectBoxAdmin
                v-for="project in sProjects"
                :key="project._id"
                :project="project"
                @click="clickProject(project)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="menu">
        <div>
          <div class="box-menu">
            <div
              class="title-menu"
              :class="{ 'title-active': showNew }"
              @click="
                showNew = !showNew;
                showViewed = !showViewed;
              "
            >
              Новые
            </div>
            <div class="box-projects" v-if="showNew">
              <div class="none" v-if="!adminProjects.length">Нет новых</div>
              <ProjectBoxAdmin
                v-for="project in adminProjects"
                :key="project._id"
                :project="project"
                @click="clickProject(project)"
              />
            </div>
          </div>
          <div class="box-menu">
            <div>
              <div
                class="title-menu"
                :class="{ 'title-active': showViewed }"
                @click="
                  showNew = !showNew;
                  showViewed = !showViewed;
                "
              >
                Просмотренные
              </div>
              <div class="box-projects" v-if="showViewed">
                <div class="none" v-if="!viewedProjects.length">
                  Нет просмотренных
                </div>
                <ProjectBoxAdmin
                  v-for="project in viewedProjects"
                  :key="project._id"
                  :project="project"
                  @click="clickProject(project)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="title-menu red" @click="logoutAdmin">Выйти</div>
      </div>
    </div>
    <div class="right-box">
      <div v-if="activeProject" class="box-banner">
        <div class="text-banner">Опубликовать</div>
        <button class="button-banner b-blue" @click="showConfirm = true">
          <i class="fas fa-check"></i>
        </button>
        <button class="button-banner b-red" @click="doNotPublishProject">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="box-info-project">
        <div class="info-project" v-if="activeProject">
          <div
            class="box-top"
            :class="{ success: status == 'success', error: status == 'error' }"
            v-if="status"
          >
            <span v-for="error in errors" :key="error.id">{{ error }}</span>
          </div>
          <div class="title-project">{{ activeProject.title }}</div>
          <div class="description-project">{{ activeProject.description }}</div>
          <div class="category">
            Категория - <span>{{ activeProject.category.nameCategory }}</span>
          </div>
          <div class="row">
            <div class="box-img-project">
              <img
                class="main-img-project"
                :src="'http://localhost:3000/' + activeProject.image"
                alt=""
              />
            </div>
            <div class="box-basics">
              <div>
                <div class="text-basic">Собираемая сумма:</div>
                <div class="value-basic">
                  {{ activeProject.collectingAmount }}$
                </div>
              </div>
              <div v-if="activeProject.radioButton == 1">
                <div class="text-basic">Количесвто дней до конца:</div>
                <div class="value-basic">{{ activeProject.numberOfDays }}</div>
              </div>
              <div v-if="activeProject.radioButton == 2">
                <div class="text-basic">Конечная дата:</div>
                <div class="value-basic">{{ activeProject.targetDate }}</div>
              </div>
            </div>
          </div>
          <div class="box-payment">
            <div>
              <div class="text-basic">Расчетный счет:</div>
              <div class="value-basic">
                {{ activeProject.checkingAccount }}
              </div>
            </div>
            <div>
              <div class="text-basic">БИК банка:</div>
              <div class="value-basic">
                {{ activeProject.BIC }}
              </div>
            </div>
            <div>
              <div class="text-basic">УНП получателя:</div>
              <div class="value-basic">
                {{ activeProject.PAN }}
              </div>
            </div>
          </div>
          <div class="box-story">
            <h2>История</h2>
            <div v-html="activeProject.story" class="story"></div>
            <h2>Риски</h2>
            <div class="risks">
              {{ activeProject.risks }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AlertAdmin from "@/components/AlertAdmin";
import ConfirmAdmin from "@/components/ConfirmAdmin";
import ProjectBoxAdmin from "@/components/ProjectBoxAdmin";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  directives: {
    "click-outside": {
      mounted(el, binding) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event, el);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unmounted(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  data() {
    return {
      focus: false,
      textSearch: null,
      showNew: true,
      showViewed: false,
      viewedProjects: [],
      activeProject: null,
      errors: [],
      status: null,
      showConfirm: false,
    };
  },
  methods: {
    ...mapActions({
      callSearchProjects: "callSearchProjects",
      resetSearch: "resetSearch",
      fetchFilterProjects: "fetchFilterProjects",
      fetchAdminProject: "fetchAdminProject",
      updateProject: "updateProject",
      logout: "logout",
    }),
    clickProject(project) {
      this.textSearch = "";
      this.focus = false;
      if (this.viewedProjects.length) {
        let index = this.viewedProjects.findIndex(
          (item) => item._id == project._id
        );
        if (index != -1) {
          this.viewedProjects.splice(index, 1);
        }
        this.viewedProjects.unshift(project);
      } else {
        this.viewedProjects.unshift(project);
      }
      this.activeProject = project;
    },
    callSearch() {
      if (this.textSearch) {
        this.callSearchProjects(this.textSearch);
      } else {
        this.resetSearch();
      }
    },
    publishProject() {
      this.showConfirm = false;
      this.updateProject({
        id: this.activeProject._id,
        data: {
          checkPublish: false,
          published: true,
          publishDate: Date.now(),
          notification: { type: "success", message: "Проект одобрен" },
        },
      }).then(() => {
        this.status = "success";
        this.errors = ["Проект успешно опубликован"];
        this.clearNotification();
        this.fetchAdminProject();
      });
    },
    async doNotPublishProject() {
      const textNotification = await this.$refs.alert.alert();
      this.updateProject({
        id: this.activeProject._id,
        data: {
          checkPublish: false,
          published: false,
          notification: { type: "error", message: textNotification },
        },
      }).then(() => {
        this.status = "error";
        this.errors = ["Отказано в публикации"];
        this.clearNotification();
        this.fetchAdminProject();
      });
    },
    clearNotification() {
      setTimeout(() => {
        this.status = null;
        this.errors = [];
        this.activeProject = null;
      }, 2000);
    },
    logoutAdmin() {
      this.logout();
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapState({
      sProjects: (state) => state.search.projects,
      filterProjects: (state) => state.project.filterProjects,
      adminProjects: (state) => state.admin.adminProjects,
    }),
    ...mapGetters({}),
  },
  mounted() {
    this.fetchAdminProject();
  },
  components: {
    AlertAdmin,
    ConfirmAdmin,
    ProjectBoxAdmin,
  },
};
</script>
<style scoped>
.page {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
}

.left-box {
  position: fixed;
  padding: 12px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 25%;
}

.right-box {
  margin-left: 25%;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 75%;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo > img {
  height: 1.7em;
}

.box-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
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
  color: #ffffff;
  cursor: pointer;
}

.b-blue {
  background-color: #0000c5;
}

.b-blue:hover {
  background-color: #0040ff;
}

.b-red {
  background-color: #ed0028;
}

.b-red:hover {
  background-color: #fd003b;
}

.box-search {
  position: relative;
}
.result-search {
  position: absolute;
  top: 50px;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.result-search > div {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
  padding: 12px;
  border-radius: 10px;
}

.search {
  border: 2px solid hsla(0, 0%, 0%, 0.3);
  border-radius: 10px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.search-input {
  padding: 12px 0 12px 25px;
  flex-grow: 1;
  border: none;
}

.search-input:focus {
  outline: none;
}

.btn-search {
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close {
  cursor: pointer;
}

.close:hover {
  color: #0000c5;
}

.search-focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.title-menu {
  margin: 16px 0 0 0;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
}

.title-active {
  color: #0000c5;
}

.red {
  color: #ed0028;
}

.none {
  font-size: 0.8em;
  font-weight: 400;
}

.box-menu {
  display: flex;
  flex-direction: column;
}

.box-projects {
  margin: 16px 0;
  max-height: 414px;
  overflow: auto;
}

.before-logo {
  text-align: center;
  color: #0000c5;
  font-size: 0.8em;
  margin-bottom: 36px;
}

.box-info-project {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 65px 0;
}

.info-project {
  display: flex;
  flex-direction: column;
  width: 750px;
  align-items: center;
}

.box-img-project {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 355px;
  overflow: hidden;
}

.main-img-project {
  height: 100%;
  width: 100%;
}

.title-project {
  width: 100%;
  font-size: 1.6em;
  font-weight: 600;
}

.description-project {
  width: 100%;
  font-size: 0.9em;
  font-weight: 300;
}

h2 {
  font-size: 1.2em;
  font-weight: 800;
}

.box-basics {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-left: 24px;
}

.box-basics > div {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.box-story {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 35px;
}

.story,
.risks {
  width: 100%;
  font-size: 0.8em;
  overflow: hidden;
}

.text-basic {
  font-size: 0.9em;
  font-weight: 600;
}

.value-basic {
  font-size: 1.2em;
  font-weight: 700;
  color: #0000c5;
}

.box-top {
  width: 100%;
  color: #ffffff;
  margin: 25px 0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

.error {
  background-color: #f01446;
}

.success {
  background-color: #0000c5;
}

.category {
  font-size: 0.9em;
  font-weight: 600;
  width: 100%;
  margin: 25px 0;
}

.category > span {
  font-size: 1.2em;
  font-weight: 700;
  color: #0000c5;
}

.box-payment {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.box-payment > div {
  display: flex;
  flex-direction: column;
}
</style>
