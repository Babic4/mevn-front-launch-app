import { uploadImage } from "@/services/upload.service";

const state = () => ({
  imageError: null,
  image: null,
  images: [],
});

const getters = {
  imageError: ({ imageError }) => imageError,
  image: ({ image }) => image,
  images: ({ images }) => images,
};

const mutations = {
  setImageError(state, error) {
    state.imageError = error;
  },
  setImage(state, image) {
    state.image = image;
  },
  setImages(state, images) {
    state.images = images;
  },
};

const actions = {
  async uploadImg({ commit }, data) {
    console.log("upload");
    return new Promise((resolve, reject) => {
      uploadImage(data)
        .then((response) => {
          commit("setImage", response);
          resolve(response);
        })
        .catch((error) => {
          commit("setImageError", error);
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
