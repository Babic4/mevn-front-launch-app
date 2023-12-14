import {
  getProject,
  getProjects,
  getProjectsUs,
  getPublishedProjects,
  getDraftProjects,
  createProject,
  updateProject,
  filterProject,
  getNotification,
  delNotification,
  removeProject,
} from "@/services/projects.service";

import router from "@/router";

const state = () => ({
  projectError: null,
  project: {},
  draftProjects: [],
  publishedProjects: [],
  filterProjects: [],
  notification: [],
});

const getters = {
  newDraftProjects: ({ draftProjects }) => {
    if (draftProjects.length > 3) {
      return draftProjects.slice(draftProjects.length - 3).reverse();
    } else {
      return draftProjects.reverse();
    }
  },
  projectError: ({ projectError }) => projectError,
  project: ({ project }) => project,
  draftProjects: ({ draftProjects }) => draftProjects,
  publishedProjects: ({ publishedProjects }) => publishedProjects,
  filterProjects: ({ filterProjects }) => filterProjects,
  designProject: ({ publishedProjects }) => {
    let projects = publishedProjects.filter(
      (item) => item.category.nameCategory == "Дизайн"
    );
    if (projects.length > 10) {
      return projects.slice(projects.length - 10).reverse();
    } else {
      return projects.reverse();
    }
  },
  filmProject: ({ publishedProjects }) => {
    let projects = publishedProjects.filter(
      (item) => item.category.nameCategory == "Фильмы"
    );
    if (projects.length > 10) {
      return projects.slice(projects.length - 10).reverse();
    } else {
      return projects.reverse();
    }
  },
  techProject: ({ publishedProjects }) => {
    let projects = publishedProjects.filter(
      (item) => item.category.nameCategory == "Технологии"
    );
    if (projects.length > 10) {
      return projects.slice(projects.length - 10).reverse();
    } else {
      return projects.reverse();
    }
  },
  gameProject: ({ publishedProjects }) => {
    let projects = publishedProjects.filter(
      (item) => item.category.nameCategory == "Игры"
    );
    if (projects.length > 10) {
      return projects.slice(projects.length - 10).reverse();
    } else {
      return projects.reverse();
    }
  },
  musicProject: ({ publishedProjects }) => {
    let projects = publishedProjects.filter(
      (item) => item.category.nameCategory == "Музыка"
    );
    if (projects.length > 10) {
      return projects.slice(projects.length - 10).reverse();
    } else {
      return projects.reverse();
    }
  },
};

const mutations = {
  setProjectError(state, error) {
    state.projectError = error;
  },
  setProject(state, project) {
    state.project = project;
  },
  setProjects(state, projects) {
    state.projects = projects;
  },
  setPublishedProjects(state, projects) {
    state.publishedProjects = projects;
  },
  setDraftProjects(state, projects) {
    state.draftProjects = projects;
  },
  setNotification(state, notification) {
    state.notification = notification;
  },
  createProject(state, project) {
    state.project = project;
  },
  updateProject(state, project) {
    state.project = project;
  },
  setFilterProjects(state, projects) {
    state.filterProjects = projects;
  },
};

const actions = {
  async fetchProject({ commit }, id) {
    return new Promise((resolve, reject) => {
      getProject(id)
        .then((response) => {
          commit("setProject", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setProjectError", error);
          reject(error);
        });
    });
  },
  async fetchProjects({ commit }) {
    try {
      const projects = await getProjects();
      commit("setProjects", projects);
    } catch (error) {
      commit("setProjectError", error);
    }
  },
  async fetchProjectsUs({ commit }, userId) {
    try {
      const projects = await getProjectsUs(userId);
      commit("setProjects", projects);
    } catch (error) {
      commit("setProjectError", error);
    }
  },
  async fetchPublishedProjects({ commit }) {
    try {
      const projects = await getPublishedProjects();
      commit("setPublishedProjects", projects);
    } catch (error) {
      commit("setProjectError", error);
    }
  },
  async fetchDraftProjects({ commit }, id) {
    try {
      const projects = await getDraftProjects(id);
      commit("setDraftProjects", projects);
    } catch (error) {
      commit("setProjectError", error);
    }
  },
  async createProject({ commit }, data) {
    return new Promise((resolve, reject) => {
      createProject(data)
        .then((response) => {
          // localStorage.setItem("ACCESS_TOKEN", response.accessToken);
          commit("createProject", response);
          router.push(`/update-project/${response._id}`);
        })
        .catch((error) => {
          commit("setProjectError", error.response.data.message);
          reject(error.response.data.message);
        });
    });
  },
  async updateProject({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      updateProject(id, data)
        .then((response) => {
          // localStorage.setItem("ACCESS_TOKEN", response.accessToken);
          commit("updateProject", response);
          resolve(response);
          // router.push(`/update-project/${response._id}`);
        })
        .catch((error) => {
          commit("setProjectError", error.response.data.message);
          reject(error.response.data.message);
        });
      // try {
      //   const project = await updateProject(id, data);
      //   commit("updateProject", project);
      // } catch (error) {
      //   commit("setProjectError", error);
      // }
    });
  },
  async fetchFilterProjects({ commit }, category) {
    try {
      const filterProjects = await filterProject(category);
      commit("setFilterProjects", filterProjects);
    } catch (error) {
      commit("setProjectError", error);
    }
  },
  async checkNotification({ commit }, userId) {
    try {
      const notification = await getNotification(userId);
      commit("setNotification", notification);
    } catch (error) {
      commit("setProjectError", error);
    }
  },

  async removeNotification({ commit }) {
    try {
      await delNotification();
      commit("setNotification", []);
    } catch (error) {
      commit("setProjectError", error);
    }
  },
  async delProject({ commit }, id) {
    return new Promise((resolve, reject) => {
      removeProject(id)
        .then((response) => {
          commit("setProject", null);
          resolve(response);
        })
        .catch((error) => {
          commit("setProjectError", error.response.data.message);
          reject(error.response.data.message);
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
