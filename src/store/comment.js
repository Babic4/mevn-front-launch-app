import {
  getComments,
  createComment,
  removeComment,
} from "@/services/comments.service";

const state = () => ({
  commentError: null,
  comment: null,
  comments: [],
});

const getters = {
  commentError: ({ commentError }) => commentError,
  comment: ({ comment }) => comment,
  comments: ({ comments }) => comments,
};

const mutations = {
  setCommentError(state, error) {
    state.commentError = error;
  },
  setComment(state, comment) {
    state.comment = comment;
  },
  setComments(state, comments) {
    let newComments = [];
    comments.forEach((comment) => {
      if (comment.parentId == null) {
        newComments.push(comment);
      }
    });
    newComments = newComments.sort((a, b) => b.date - a.date).reverse();
    newComments.forEach((newComment) => {
      let parentComments = [];
      comments.forEach((comment) => {
        if (comment.parentId == newComment._id) {
          parentComments.push(comment);
        }
      });
      parentComments = parentComments.sort((a, b) => b.date - a.date).reverse();
      newComment.replies = parentComments;
    });
    state.comments = newComments;
  },
  addComment(state, comment) {
    state.comments = [...state.comments, comment];
  },
  deleteComment(state, idComment) {
    let index = state.comments.findIndex((item) => item._id == idComment);
    if (index != -1) {
      state.comments.splice(index, 1);
    }
  },
};

const actions = {
  async fetchComments({ commit }, projectId) {
    return new Promise((resolve, reject) => {
      getComments(projectId)
        .then((response) => {
          commit("setComments", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setCommentError", error);
          reject(error);
        });
    });
  },
  async callCreateComment({ commit }, data) {
    return new Promise((resolve, reject) => {
      createComment(data)
        .then((response) => {
          commit("addComment", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setCommentError", error);
          reject(error);
        });
    });
  },
  async delComment({ commit }, id) {
    return new Promise((resolve, reject) => {
      removeComment(id)
        .then((response) => {
          resolve(response);
          commit("deleteComment", id);
        })
        .catch((error) => {
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
