import {
  getInvestment,
  getInvestmnetsProject,
  getInvestmentUser,
  createInvestment,
  updateInvestment,
} from "@/services/investments.service";

const state = () => ({
  investmentError: null,
  investment: null,
  investments: [],
});

const getters = {
  investmentError: ({ investmentError }) => investmentError,
  investment: ({ investment }) => investment,
  investments: ({ investments }) => investments,
};

const mutations = {
  setInvestmentError(state, error) {
    state.investmentError = error;
  },
  setInvestment(state, investment) {
    state.investment = investment;
  },
  setInvestments(state, investments) {
    state.investments = investments;
  },
};

const actions = {
  async fetchInvestmentsProject({ commit }, projectId) {
    return new Promise((resolve, reject) => {
      getInvestmnetsProject(projectId)
        .then((response) => {
          commit("setInvestments", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setInvestmentError", error);
          reject(error);
        });
    });
  },
  async fetchInvestmentsUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      getInvestmentUser(userId)
        .then((response) => {
          commit("setInvestments", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setInvestmentError", error);
          reject(error);
        });
    });
  },
  async createInvestment({ commit }, data) {
    return new Promise((resolve, reject) => {
      createInvestment(data)
        .then((response) => {
          commit("setInvestment", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setInvestmentError", error);
          reject(error);
        });
    });
  },
  async updateInvestment({ commit }, { id, data }) {
    return new Promise((resolve, reject) => {
      updateInvestment(id, data)
        .then((response) => {
          commit("setInvestment", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setInvestmentError", error);
          reject(error);
        });
    });
  },
  async fetchInvestment({ commit }, { projectId, userId }) {
    return new Promise((resolve, reject) => {
      getInvestment(projectId, userId)
        .then((response) => {
          console.log(response);
          commit("setInvestment", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setInvestmentError", error);
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
