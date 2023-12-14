<template>
  <header>
    <div class="box-search" v-show="showInputSearch">
      <div class="search">
        <input
          ref="search"
          type="text"
          placeholder="Поиск..."
          autocomplete="off"
          class="search-input"
          v-model="textSearch"
          @input="callSearch"
        />
        <div
          class="btn-close-search"
          @click="
            showInputSearch = !showInputSearch;
            showHide = !showHide;
          "
        >
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div
        class="result-search"
        v-if="this.sProjects.length || this.sUsers.length"
      >
        <div v-if="this.sProjects.length">
          <h3>Проекты</h3>
          <div class="search-projects">
            <SearchProject
              @close="closeSearch"
              v-for="project in sProjects"
              :key="project._id"
              :project="project"
            />
          </div>
        </div>
        <div v-if="this.sUsers.length">
          <h3>Пользователи</h3>
          <div class="search-users">
            <SearchUser
              @close="closeSearch"
              v-for="user in sUsers"
              :key="user._id"
              :user="user"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="phone-logo" v-show="showHide">
      <img src="/img/logo-2.svg" alt="" />
    </div>
    <div class="main-menu" v-show="showHide">
      <div class="menu-left">
        <nav>
          <ul class="menu">
            <li>
              <router-link class="black" to="/projects">Проекты</router-link>
            </li>
            <li>
              <router-link class="blue" to="/create-project">
                <span>Создать проект</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="header-logo">
        <img class="header-logo" src="/img/logo-2.svg" alt="" />
      </div>
      <div class="menu-right">
        <div class="btn-search" @click="clickBtnSearch">
          <span class="btn-search-text">Поиск</span>
          <i class="fas fa-search"></i>
        </div>
        <div
          v-if="!$store.getters.ifAuthenticated"
          class="btn-login"
          @click="$router.push('/login')"
        >
          Войти
        </div>
        <div v-else class="pop-up-menu" v-click-outside="onClickOutside">
          <div class="border-img-profile">
            <img
              class="menu-img-profile"
              :src="
                'http://localhost:3000/' +
                $store.state.authorization.userAuth.image
              "
              @click="
                showPopUpMenu = !showPopUpMenu;
                this.fetchDraftProjects(
                  $store.state.authorization.userAuth._id
                );
              "
              alt=""
            />
          </div>
          <div class="hidden" v-if="showPopUpMenu">
            <div class="box-user-menu">
              <div class="title-section">Аккаунт</div>
              <ul class="user-menu">
                <li>
                  <a
                    @click="
                      newRoute(
                        `/profile/${$store.state.authorization.userAuth._id}/info`
                      )
                    "
                    >Профиль</a
                  >
                </li>
                <!-- <li>
                  <a @click="newRoute('/create-project')">Создать проект</a>
                </li> -->
                <li>
                  <a
                    @click="
                      newRoute(
                        `/profile/${$store.state.authorization.userAuth._id}/following`
                      )
                    "
                    >Избранное</a
                  >
                </li>
                <li>
                  <a
                    @click="
                      newRoute(
                        `/profile/${$store.state.authorization.userAuth._id}/your-investments`
                      )
                    "
                  >
                    Ваши инвестиции
                  </a>
                </li>
                <li>
                  <a @click="newRoute('/settings/profile')"> Настройки </a>
                </li>
                <li>
                  <a
                    @click="
                      onClickOutside();
                      logout();
                      $router.go(0);
                    "
                    >Выйти</a
                  >
                </li>
              </ul>
            </div>
            <div class="boxs-draft-project">
              <div class="title-section">Черновые проекты</div>
              <div class="none" v-if="!newDraftProjects.length">Нету</div>
              <DraftProjectBox
                v-for="project in newDraftProjects"
                :key="project._id"
                :project="project"
              />
              <div
                class="link-create-project"
                @click="newRoute('/create-project')"
              >
                Создать проект
              </div>
              <div class="view-all" @click="newRoute('/draft-projects')">
                Смотреть все
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import SearchUser from "@/components/SearchUser";
import SearchProject from "@/components/SearchProject";
import DraftProjectBox from "@/components/DraftProjectBox";
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
      showInputSearch: false,
      showHide: true,
      showPopUpMenu: false,
      ifAuthorized: false,
      textSearch: null,
    };
  },
  methods: {
    ...mapActions({
      logout: "logout",
      callSearchProjects: "callSearchProjects",
      callSearchUsers: "callSearchUsers",
      resetSearch: "resetSearch",
      fetchDraftProjects: "fetchDraftProjects",
    }),
    onClickOutside() {
      this.showPopUpMenu = false;
    },
    clickBtnSearch() {
      this.showHide = !this.showHide;
      this.showInputSearch = !this.showInputSearch;
      this.$nextTick(() => this.$refs.search.focus());
    },
    callSearch() {
      if (this.textSearch) {
        this.callSearchProjects(this.textSearch);
        this.callSearchUsers(this.textSearch);
      } else {
        this.resetSearch();
      }
    },
    newRoute(route) {
      this.showPopUpMenu = false;
      this.$router.push(route);
    },
    closeSearch() {
      this.textSearch = "";
      this.resetSearch();
      setTimeout(() => {
        this.showInputSearch = !this.showInputSearch;
        this.showHide = !this.showHide;
      }, 200);
    },
  },
  computed: {
    ...mapState({
      sProjects: (state) => state.search.projects,
      sUsers: (state) => state.search.users,
      draftProjects: (state) => state.project.draftProjects,
    }),
    ...mapGetters({
      newDraftProjects: "newDraftProjects",
    }),
  },
  components: {
    SearchUser,
    SearchProject,
    DraftProjectBox,
  },
};
</script>

<style scoped>
header {
  flex-grow: 0;
  background: #ffffff;
}

.menu {
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  font-size: 0.8em;
}

.menu > li {
  cursor: pointer;
  list-style: none;
  font-weight: 600;
}

.menu > li > a {
  text-decoration: none;
  margin-right: 25px;
}

.blue {
  color: #0000c5;
}

.blue > i {
  margin-right: 0.6em;
}

.black {
  color: #000000;
}

.header-logo {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  position: absolute;
}

.header-logo > img {
  height: 1.7em;
}

.menu-left {
  height: 100%;
  padding-left: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.menu-right {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.main-menu {
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.pop-up-menu {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
}

.hidden {
  padding: 12px 36px;
  display: flex;
  background-color: #fff;
  color: #000;
  /* border: 0.8px solid #000; */
  border-radius: 0 0 0 10px;
  position: absolute;
  top: 52px;
  /* right: 4px; */
  width: 28em;
  z-index: 3;
}

.search {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  padding: 12px 0 12px 25px;
  flex-grow: 1;
  border: none;
}

.search-input:focus {
  outline: none;
}

.btn-close-search {
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-close-search > i:hover {
  color: #0000c5;
}

.btn-search {
  font-size: 0.8em;
  cursor: pointer;
}

.btn-search:hover,
.btn-login:hover,
.black:hover {
  color: #0000c5;
}

.btn-search > i {
  margin-left: 0.6em;
}

.btn-search-text {
  font-weight: 600;
}

.menu-img-profile {
  height: 100%;
  cursor: pointer;
}

.btn-login {
  font-weight: 600;
  font-size: 0.8em;
  padding: 0 25px;
  cursor: pointer;
}

.box-user-menu {
  display: flex;
  flex-direction: column;
  width: 45%;
}

.user-menu {
  padding: 0;
  margin: 0;
  font-weight: 500;
  font-size: 0.8em;
  list-style: none;
  /* margin: 0;
  padding-left: 0; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-menu > li {
  cursor: pointer;
  padding: 4px 0 4px 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.user-menu > li > a > i {
  text-decoration: none;
  color: #000;
  margin-right: 1vh;
  margin-left: 1.5vh;
}

.link-create-project {
  margin-top: 12px;
  color: #0000c5;
  font-weight: 500;
  font-size: 0.8em;
  cursor: pointer;
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
  padding: 0 50px;
}

.result-search > div > h3 {
  color: #0000c5;
  font-size: 0.8em;
}

.boxs-draft-project {
  display: flex;
  flex-direction: column;
  width: 55%;
}

.title-section {
  font-weight: 500;
  font-size: 0.9em;
  color: #0000c5;
  margin-bottom: 12px;
}

.box-draft-project {
  display: flex;
  height: 25px;
  align-items: center;
}

.view-all {
  margin-top: 6px;
  cursor: pointer;
  color: #01b5e6;
  font-size: 0.8em;
  text-decoration: underline;
}

.none {
  color: black;
  font-size: 0.8em;
}

.search-users,
.search-projects {
  margin: 36px 0;
}

.phone-logo {
  display: none;
}

.border-img-profile {
  width: 1.9em;
  height: 1.9em;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 100%;
  margin: 0 25px;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  .search-projects,
  .search-users {
    margin: 18px 0;
  }
  /* */
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .header-logo {
    display: none;
  }

  .hidden {
    width: 100vw;
    border-radius: 0;
  }

  .phone-logo {
    padding: 12px 0 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .phone-logo > img {
    height: 1.7em;
  }

  .result-search > div {
    padding: 0 24px;
  }

  .search-projects,
  .search-users {
    margin: 12px 0;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .menu {
    font-size: 0.7em;
  }

  .menu-left {
    padding-left: 12px;
  }

  .menu-img-profile {
    padding: 0 12px;
  }

  .btn-search {
    font-size: 0.7em;
  }

  .btn-login {
    font-size: 0.7em;
    padding: 0 12px;
  }

  .hidden {
    flex-direction: column;
  }

  .box-user-menu {
    width: 100%;
  }

  .boxs-draft-project {
    margin-top: 12px;
    width: 100%;
  }

  .link-create-project {
    display: none;
  }

  /* .title-section {
    font-size: 0.8em;
  } */

  /* .user-menu,
  .view-all,
  .none,
  .link-create-project {
    font-size: 0.7em;
  } */

  .search-input {
    padding: 6px 0 6px 12px;
  }

  .btn-close-search {
    padding: 0 12px;
    font-size: 0.85em;
  }

  .result-search > div {
    padding: 0 12px;
  }

  .search-projects,
  .search-users {
    margin: 4px 0;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
