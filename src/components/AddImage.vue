<template>
  <div class="box-add-image" v-if="showAddImage">
    <div class="upload-box">
      <label for="preview-image-input">Добавть изображение</label>
      <div class="preview-box" v-show="ifPreviewImage">
        <div class="preview"><img id="preview-image" /></div>
        <div class="preview-btns">
          <button @click="uploadPreviewImage">
            <i class="fas fa-sync-alt"></i>
          </button>
          <button @click="removePreviewImage">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="upload-button" v-show="!ifPreviewImage">
        <div class="input-box">
          <input
            type="file"
            id="preview-image-input"
            accept=".jpg, .jpeg, .png"
            @change="previewImage"
          />
          <span class="text-upload"
            >Выберите изображения для загрузки (PNG, JPG)</span
          >
        </div>
      </div>
    </div>
    <div v-show="ifPreviewImage">
      <label for="">Заголовок (необязательно)</label>
      <input class="input" type="text" name="" v-model="title" />
      <label v-if="title.length" for="">URL (необязательно)</label>
      <input
        v-if="title.length"
        class="input"
        type="text"
        name=""
        v-model="URL"
      />
      <button class="button" @click="addImage">Добавить</button>
    </div>
  </div>
  <div v-if="showAddImage" class="overlay" @click="close"></div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      showError: false,
      showAddImage: false,
      ifPreviewImage: false,
      image: "",
      title: "",
      URL: "",
    };
  },
  methods: {
    ...mapActions({
      uploadImg: "uploadImg",
    }),
    previewImage(event) {
      if (event.target.files.length > 0) {
        if (event.target.files[0].size / 1024 / 1024 <= 200) {
          // ЗАГЛУШКА 200 MB (UP!)
          this.image = event.target.files[0];
          let src = URL.createObjectURL(event.target.files[0]);
          let preview = document.getElementById("preview-image");
          preview.src = src;
          this.ifPreviewImage = true;
        }
      }
    },
    uploadPreviewImage() {
      document.getElementById("preview-image-input").click();
    },
    removePreviewImage() {
      this.image = "";
      let preview = document.getElementById("preview-image");
      preview.src = null;
      this.ifPreviewImage = false;
    },
    show() {
      let resolve, reject;
      const addImagePromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });

      this.$options.addImageController = { resolve, reject };
      this.showAddImage = true;
      return addImagePromise;
    },
    addImage() {
      let formData = new FormData();
      let dataImage = {};
      if (this.URL && this.title) dataImage.URL = this.URL;
      else dataImage.URL = "";
      if (this.title) dataImage.title = this.title;
      else dataImage.title = "";
      formData.append("image", this.image);
      this.uploadImg(formData).then((response) => {
        dataImage.image = response;
        this.$options.addImageController.resolve(dataImage);
        this.title = "";
        this.URL = "";
        this.showError = false;
        this.ifPreviewImage = false;
        this.showAddImage = false;
      });
    },
    close() {
      this.$options.addImageController.resolve("");
      this.title = "";
      this.URL = "";
      this.showError = false;
      this.ifPreviewImage = false;
      this.showAddImage = false;
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  overflow: auto;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
}

.box-add-image {
  transform: translate(-50%, -50%);
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 5;
  width: 750px;
  background: #ffffff;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #abb7e9;
}

.upload-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
}

.upload-button {
  margin-top: 0.4rem;
  display: flex;
  width: 100%;
  background-color: #ffffff;
  border: 2px dashed rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  height: 75px;
  position: relative;
}

.upload-button:hover {
  border: 2px dashed #1400ff;
  background-color: rgba(21, 0, 255, 0.1);
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.preview-box {
  background: white;
  border: 2px solid rgba(0, 0, 0, 0.3);
  margin-top: 0.4em;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 12px;
  border-radius: 10px;
  /* border: 2px solid #1400ff;
  outline: 3px solid rgba(21, 0, 255, 0.1); */
}

.preview {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-btns {
  display: flex;
  width: 100%;
}

.preview-btns > button {
  font-size: 0.8em;
  font-weight: 600;
  color: #0d0d0d;
  margin: 0.2rem;
  border: none;
  border-radius: 0.3rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-btns > button:hover {
  color: #1400ff;
}

#preview-image {
  height: 100%;
  border-radius: 10px;
}

#preview-image-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  left: 0;
  top: 0;
  cursor: pointer;
}

label {
  font-weight: 600;
  font-size: 0.8em;
}

.input-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.text-upload {
  font-size: 0.8em;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  /* */
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .box-add-image {
    width: calc(100% - 48px);
    transform: translate(calc(-50% - 24px), -50%);
    margin: 0 24px;
    padding: 20px 24px;
  }

  .text-upload {
    padding: 0 12px;
  }

  .preview {
    width: 100%;
    height: auto;
  }

  #preview-image {
    margin-bottom: 12px;
    width: 100%;
    height: 100%;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-add-image {
    width: calc(100% - 24px);
    transform: translate(calc(-50% - 12px), -50%);
    margin: 0 12px;
    padding: 20px 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
