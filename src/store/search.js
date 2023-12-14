import { searchProjects, searchUsers } from "@/services/search.service";

const state = () => ({
  searchError: null,
  projects: [],
  users: [],
});

const getters = {
  searchError: ({ searchError }) => searchError,
  sProjects: ({ projects }) => projects,
  sUsers: ({ users }) => users,
};

const mutations = {
  setSearchError(state, error) {
    state.searchError = error;
  },
  setProjects(state, projects) {
    state.projects = projects;
  },
  setUsers(state, users) {
    state.users = users;
  },
};

const actions = {
  async callSearchProjects({ commit }, text) {
    return new Promise((resolve, reject) => {
      searchProjects(text)
        .then((response) => {
          commit("setProjects", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setSearchError", error);
          reject(error);
        });
    });
  },
  async callSearchUsers({ commit }, text) {
    return new Promise((resolve, reject) => {
      searchUsers(text)
        .then((response) => {
          commit("setUsers", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setSearchError", error);
          reject(error);
        });
    });
  },
  async resetSearch({ commit }) {
    commit("setProjects", []);
    commit("setUsers", []);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
