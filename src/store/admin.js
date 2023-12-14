import { getNewProjects } from "@/services/admin.service";

const state = () => ({
  adminError: null,
  adminProject: null,
  adminProjects: [],
});

const getters = {};

const mutations = {
  setAdminError(state, error) {
    state.projectError = error;
  },
  setAdminProject(state, project) {
    state.adminProject = project;
  },
  setAdminProjects(state, projects) {
    state.adminProjects = projects;
  },
};

const actions = {
  async fetchAdminProject({ commit }) {
    return new Promise((resolve, reject) => {
      getNewProjects()
        .then((response) => {
          commit("setAdminProjects", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setAdminError", error);
          reject(error);
        });
    });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
