import {
  getFavorit,
  getFavorits,
  createFavorit,
  deleteFavorit,
} from "@/services/favorits.service";

const state = () => ({
  favoritError: null,
  favorit: null,
  favorits: [],
});

const getters = {
  favoritError: ({ favoritError }) => favoritError,
  favorit: ({ favorit }) => favorit,
  favorits: ({ favorits }) => favorits,
};

const mutations = {
  setFavoritError(state, error) {
    state.favoritError = error;
  },
  setFavorit(state, favorit) {
    state.favorit = favorit;
  },
  setFavorits(state, favorits) {
    state.favorits = favorits;
  },
};

const actions = {
  async fetchFavorit({ commit }, { userId, projectId }) {
    return new Promise((resolve, reject) => {
      getFavorit(userId, projectId)
        .then((response) => {
          commit("setFavorit", response);
          resolve(response);
        })
        .catch((error) => {
          console.log(error.response.data.message);
          commit("setFavoritError", error);
          commit("setFavorit", null);
          reject(error);
        });
    });
  },
  async fetchFavorits({ commit }, userId) {
    return new Promise((resolve, reject) => {
      getFavorits(userId)
        .then((response) => {
          commit("setFavorits", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setFavoritError", error);
          reject(error);
        });
    });
  },
  async createFavorit({ commit }, data) {
    try {
      const favorit = await createFavorit(data);
      commit("setFavorit", favorit);
    } catch (error) {
      commit("setFavoritError", error);
    }
  },
  async deleteFavorit({ commit }, id) {
    try {
      await deleteFavorit(id);
      commit("setFavorit", null);
    } catch (error) {
      commit("setFavoritError", error);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
