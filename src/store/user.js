import { getUser, getUsers } from "@/services/users.service";

const state = () => ({
  userError: null,
  user: {},
  users: [],
});

const getters = {
  userError: ({ userError }) => userError,
  user: ({ user }) => user,
  users: ({ users }) => users,
};

const mutations = {
  setUserError(state, error) {
    state.userError = error;
  },
  setUser(state, user) {
    state.user = user;
  },
  setUsers(state, users) {
    state.users = users;
  },
};

const actions = {
  async fetchUser({ commit }, id) {
    return new Promise((resolve, reject) => {
      getUser(id)
        .then((response) => {
          commit("setUser", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setUserError", error);
          reject(error);
        });
    });
  },
  async fetchUsers({ commit }) {
    try {
      const users = await getUsers();
      commit("setUsers", users);
    } catch (error) {
      commit("setUserError", error);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
