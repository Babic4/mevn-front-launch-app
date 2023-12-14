import VueJwtDecode from "vue-jwt-decode";
import { login, signup, logout } from "@/services/authorization.service";
import {
  getUser,
  updateProfile,
  updateAccount,
  removeAccount,
} from "@/services/users.service";

import router from "@/router";

const state = () => ({
  loginError: null,
  signupError: null,
  userAuth: null,
  accessToken: localStorage.getItem("ACCESS_TOKEN") || null,
});

const getters = {
  ifAuthenticated: ({ userAuth, accessToken }) => {
    return userAuth && accessToken ? true : false;
  },
  loginError: ({ loginError }) => loginError,
  signupError: ({ signupError }) => signupError,
};

const mutations = {
  setAuthorizationError(state, error) {
    state.authorizationError = error;
  },
  login(state, userData) {
    state.loginError = null;
    state.userAuth = userData.user;
    state.accessToken = userData.accessToken;
  },
  loginError(state, error) {
    state.loginError = error;
  },
  signup(state, userData) {
    state.signupError = null;
    state.userAuth = userData.user;
    state.accessToken = userData.accessToken;
  },
  signupError(state, error) {
    state.signupError = error;
  },
  logout(state) {
    state.userAuth = null;
    state.accessToken = null;
  },
  setUserAuth(state, user) {
    state.userAuth = user;
  },
};

const actions = {
  async login({ commit }, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then((response) => {
          localStorage.setItem("ACCESS_TOKEN", response.accessToken);
          if (response.user.isAdmin) localStorage.setItem("IS_ADMIN", true);
          commit("login", response);
          resolve(response);
        })
        .catch((error) => {
          commit("loginError", error.response.data.message);
          reject(error.response.data.message);
        });
    });
  },
  async signup({ commit }, data) {
    return new Promise((resolve, reject) => {
      signup(data)
        .then((response) => {
          commit("signup", response);
          resolve(response);
        })
        .catch((error) => {
          commit("signupError", error.response.data.message);
          reject(error.response.data.message);
        });
    });
  },
  async logout({ state, commit }) {
    let isAdmin = localStorage.getItem("IS_ADMIN");
    localStorage.removeItem("ACCESS_TOKEN");
    if (isAdmin) localStorage.removeItem("IS_ADMIN");
    await logout(state.userAuth);
    await commit("logout");
    if (isAdmin) await router.push("/login");
    else await router.push("/projects");
  },
  async setUser({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.accessToken) {
        const data = VueJwtDecode.decode(state.accessToken);
        getUser(data.userId)
          .then((response) => {
            commit("setUserAuth", response);
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data.message);
          });
      } else {
        reject("error");
      }
    });
  },
  async updateProfile({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      updateProfile(id, data)
        .then((response) => {
          commit("setUserAuth", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  },
  async updateAccount({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      updateAccount(id, data)
        .then((response) => {
          commit("setUserAuth", response);
          resolve(response);
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  },

  async delAccount({ commit }, id) {
    return new Promise((resolve, reject) => {
      removeAccount(id)
        .then((response) => {
          commit("setUserAuth", response);
          resolve(response);
          localStorage.removeItem("ACCESS_TOKEN");
          logout(state.userAuth);
          commit("logout");
          router.push("/projects");
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  },

  // async refresh({ commit }, data) {
  //   const response = await refresh(data);
  //   commit("authorization", response);
  // },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
