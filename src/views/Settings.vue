<template>
  <div class="middle">
    <h2>Настройки</h2>
    <div class="tab">
      <div class="width">
        <div
          class="tablinks"
          :class="{ active: tab == 'account' }"
          @click="$router.push('/settings/account')"
          id="btnAccount"
        >
          Аккаунт
        </div>
        <div
          class="tablinks"
          :class="{ active: tab == 'profile' }"
          @click="$router.push('/settings/profile')"
          id="btnProfile"
        >
          Профиль
        </div>
      </div>
    </div>

    <!-- Tab content -->
    <div id="Account" class="tabcontent" v-if="tab == 'account'">
      <div
        class="box-top"
        :class="{ success: status == 'success', error: status == 'error' }"
        v-if="status"
      >
        <span v-for="error in errors" :key="error.id">{{ error }}</span>
      </div>
      <form @submit.prevent="onUpdateAccount">
        <div class="row">
          <fieldset>
            <label>Email</label>
            <input
              type="text"
              v-model.trim="email"
              :class="{ invalid: invalidEmail }"
              class="input"
            />
            <button
              class="button"
              @click.prevent="showBoxChangePassword = !showBoxChangePassword"
            >
              Сменить пароль
            </button>
            <div class="box-change-password" v-show="showBoxChangePassword">
              <label>Новый пароль</label>
              <input
                type="password"
                v-model.trim="newPassword"
                :class="{ invalid: invalidNewPassword }"
                class="input"
              />
              <label>Повторите пароль</label>
              <input
                type="password"
                v-model.trim="newRePassword"
                :class="{ invalid: invalidNewRePassword }"
                class="input"
              />
            </div>
            <label>Текущий пароль</label>
            <input
              type="password"
              v-model.trim="currentPassword"
              :class="{ invalid: invalidCurrentPassword }"
              class="input m1"
            />
            <span class="rule"
              >Введите текущий пароль, чтобы сохранить эти изменения.</span
            >
          </fieldset>
          <fieldset>
            <label>Удалить аккаунт</label>
            <div class="delete-button" @click="deleteAccount">
              Удалить аккаунт Launch
            </div>
          </fieldset>
        </div>
        <input class="button" type="submit" value="Сохранить" />
      </form>
    </div>

    <div id="Profile" class="tabcontent" v-if="tab == 'profile'">
      <div
        class="box-top"
        :class="{ success: status == 'success', error: status == 'error' }"
        v-if="status"
      >
        <span v-for="error in errors" :key="error.id">{{ error }}</span>
      </div>
      <form @submit.prevent="onUpdateProfile">
        <div class="row">
          <fieldset>
            <label for="name">Имя</label>
            <input
              type="text"
              id="name"
              class="input"
              v-model.trim="name"
              :class="{ invalid: invalidName }"
            />
            <div class="upload-box">
              <label for="avatar">Изображение</label>
              <div class="upload">
                <div class="preview-box">
                  <img v-if="avatar" id="preview" :src="urlAvatar" />
                </div>
                <div class="input-box">
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept=".jpg, .jpeg, .png"
                    @change="previewFile"
                  />
                  <span class="text-upload">
                    Выберите изображения для загрузки (PNG, JPG)
                  </span>
                </div>
              </div>
            </div>
            <label for="biography">Биография</label>
            <textarea
              class="textarea"
              :class="{ invalid: invalidBiography }"
              id="biography"
              v-model.trim="biography"
              cols="30"
              rows="4"
            ></textarea>
          </fieldset>
          <fieldset>
            <label for="website">Веб-сайты</label>
            <div id="website">
              <input type="text" class="input-two" v-model.trim="newWebsite" />
              <button class="button-two" @click.prevent="addWebSite">
                Добавить
              </button>
            </div>
            <div class="websites" v-if="websites.length > 0">
              <div
                v-for="item in websites"
                :key="item.key"
                class="link-website-box"
              >
                <div>
                  <span>{{ item }}</span>
                </div>
                <button class="remove-button" @click="removeWebSite">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </fieldset>
        </div>
        <input class="button" type="submit" value="Сохранить" />
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  sameAs,
  minLength,
  maxLength,
} from "@vuelidate/validators";

const validURLs = (value) => {
  let regexURL =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+(-?[a-zA-Z0-9])*\.)+[\w]{2,}(\/\S*)?$/gi;
  for (let i = 0; i < value.length; i++) {
    if (!value[i].match(regexURL)) {
      return false;
    }
  }
  return true;
};

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      errors: [],
      status: null,
      tab: null,
      invalidEmail: false,
      invalidCurrentPassword: false,
      invalidNewPassword: false,
      invalidNewRePassword: false,
      invalidName: false,
      invalidBiography: false,
      invalidWebSites: false,
      email: "",
      showBoxChangePassword: false,
      currentPassword: "",
      newPassword: "",
      newRePassword: "",
      name: "",
      biography: "",
      avatar: "",
      urlAvatar: "",
      newWebsite: "",
      websites: [],
    };
  },
  validations() {
    return {
      email: { email },
      currentPassword: { required, minLength: minLength(6) },
      newPassword: { minLength: minLength(6) },
      newRePassword: {
        minLength: minLength(6),
        sameAsPassword: sameAs(this.newPassword),
      },
      name: { minLength: minLength(2) },
      biography: { maxLength: maxLength(300) },
      websites: { validURLs },
    };
  },
  methods: {
    ...mapActions({
      updateAccount: "updateAccount",
      updateProfile: "updateProfile",
      delAccount: "delAccount",
    }),
    previewFile(event) {
      if (event.target.files.length > 0) {
        if (event.target.files[0].size / 1024 / 1024 <= 200) {
          // ЗАГЛУШКА 200 MB (UP!)
          this.avatar = event.target.files[0];
          console.log(this.avatar);
          let src = URL.createObjectURL(event.target.files[0]);
          this.urlAvatar = src;
        }
      }
    },
    addWebSite() {
      if (this.newWebsite) {
        if (this.websites.length < 5) {
          if (this.newWebsite.indexOf("https://") == -1) {
            this.websites.push("https://" + this.newWebsite);
            this.newWebsite = "";
          } else {
            this.websites.push(this.newWebsite);
          }
          this.newWebsite = "";
        } else {
          this.newWebsite = "";
          console.log("Масксимум сайтов добавлено");
        }
      }
    },
    removeWebSite(event) {
      let parent = event.currentTarget.parentElement;
      let nameWebSite = parent.getElementsByTagName("span")[0].innerHTML;
      this.websites.splice(this.websites.indexOf(nameWebSite), 1);
    },
    shapeSettings() {
      if (this.user.email) this.email = this.user.email;
      if (this.user.name) this.name = this.user.name;
      if (this.user.biography) this.biography = this.user.biography;
      if (this.user.image) {
        this.avatar = this.user.image;
        this.urlAvatar = "http://localhost:3000/" + this.user.image;
      }
      if (this.user.webSites) this.websites = this.user.webSites;
    },
    onUpdateAccount() {
      console.log("updateAccount");

      this.v$.$touch();
      this.invalidEmail = this.emailError;
      this.invalidCurrentPassword = this.currentPasswordError;
      this.invalidNewPassword = this.newPasswordError;
      this.invalidNewRePassword = this.newRePasswordError;
      if (
        this.v$.currentPassword.$invalid ||
        this.v$.email.$invalid ||
        this.v$.newPassword.$invalid ||
        this.v$.newRePassword.$invalid
      ) {
        this.errors = this.displayAccountError;
        this.status = "error";
        console.log("error");
        return;
      }
      const formData = {};
      if (this.email != this.user.email) formData.email = this.email;
      if (this.newPassword) formData.password = this.newPassword;
      // formData.append("email", this.email);
      // formData.append("password", this.newPassword);
      this.updateAccount({
        id: this.user._id,
        data: { currentPassword: this.currentPassword, data: formData },
      })
        .then(() => {
          this.errors = ["Успешные изменения"];
          this.status = "success";
          this.clearNotification();
        })
        .catch((error) => {
          console.log(error);
          this.errors = [error];
          this.invalidCurrentPassword = true;
          this.status = "error";
          this.clearNotification();
        });
    },
    onUpdateProfile() {
      console.log("updateProfile");
      let formData = new FormData();

      this.v$.$touch();
      this.invalidName = this.nameError;
      this.invalidBiography = this.biographyError;
      console.log(this.v$.websites.validURLs);
      if (
        this.v$.name.$invalid ||
        this.v$.biography.$invalid ||
        this.v$.websites.validURLs.$invalid
      ) {
        this.errors = this.displayProfileError;
        this.status = "error";
        return;
      }
      console.log(this.avatar);
      if (this.name != this.user.name) formData.append("name", this.name);
      if (this.biography != this.user.biography)
        formData.append("biography", this.biography);
      formData.append("image", this.avatar);
      for (let i = 0; i < this.websites.length; i++) {
        formData.append("webSites[]", this.websites[i]);
      }
      console.log(formData);
      this.updateProfile({
        id: this.user._id,
        data: formData,
      }).then(() => {
        console.log("success");
        this.errors = ["Успешные изменения"];
        this.status = "success";
        this.clearNotification();
      });
    },
    clearNotification() {
      setTimeout(() => {
        this.status = null;
        this.errors = [];
      }, 2000);
    },
    deleteAccount() {
      this.delAccount(this.user._id);
    },
  },
  // beforeRouteUpdate(to, from, next) {
  //   next();
  // },
  mounted() {
    // if (!this.$route.params.tab) {
    //   this.$router.push(`/settings/profile`);
    // }
    this.tab = this.$route.params.tab;
    this.shapeSettings();
  },
  updated() {
    // if (!this.$route.params.tab) {
    //   this.$router.push(`/settings/profile`);
    // }
    if (this.tab != this.$route.params.tab) {
      this.tab = this.$route.params.tab;
      this.shapeSettings();
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.authorization.userAuth,
    }),
    ...mapGetters({}),
    displayAccountError() {
      const errors = [];
      if (this.v$.email.email.$invalid) {
        errors.push(
          "Значение не является действительным адресом электронной почты"
        );
      }
      if (this.v$.currentPassword.required.$invalid) {
        errors.push("Поле текущего пароля не заполенно");
      }
      if (this.v$.currentPassword.minLength.$invalid) {
        errors.push("Длина текущего пароля должна быть не менее 6");
      }
      if (this.v$.newPassword.minLength.$invalid) {
        errors.push("Длина нового пароля должна быть не менее 6");
      }
      if (this.v$.newRePassword.minLength.$invalid) {
        errors.push("Поле повторного пароля должна быть не менее 6");
      }
      if (this.v$.newRePassword.sameAsPassword.$invalid) {
        errors.push("Значение повторного пароля не совпадает");
      }
      return errors;
    },
    displayProfileError() {
      const errors = [];
      if (this.v$.name.minLength.$invalid) {
        errors.push("Длина имени должна быть не менее 2");
      }
      if (this.v$.biography.maxLength.$invalid) {
        errors.push("Длина биографии должна быть менее 300");
      }
      // console.log(this.v$.websites.validURLs.$invalid);
      if (this.v$.websites.validURLs.$invalid) {
        errors.push("Некорректный URL");
      }
      return errors;
    },
    emailError() {
      if (this.v$.email.$invalid) return true;
      return false;
    },
    currentPasswordError() {
      if (this.v$.currentPassword.$invalid) return true;
      return false;
    },
    newPasswordError() {
      if (this.v$.newPassword.$invalid) return true;
      return false;
    },
    newRePasswordError() {
      if (this.v$.newRePassword.$invalid) return true;
      return false;
    },
    nameError() {
      if (this.v$.name.$invalid) return true;
      return false;
    },
    biographyError() {
      if (this.v$.biography.$invalid) return true;
      return false;
    },
  },
};
</script>

<style scoped>
.middle {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
}

/* -------------------------------------- */

.middle > h2 {
  width: 750px;
}

/* Style the tab */
.tab {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* Style the buttons that are used to open the tab content */
.tablinks {
  font-size: 0.8em;
  background-color: inherit;
  color: #000000;
  text-decoration: none;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
  font-weight: 600;
}

/* Change background color of buttons on hover */
/* .tab button:hover {
    background-color: #ddd;
  }
   */
/* Create an active/current tablink class */
.active {
  color: #0000c5;
}

/* Style the tab content */
.tabcontent {
  display: flex;
  flex-direction: column;
  padding: 25px 0;
  border-top: none;
  height: 100%;
  width: 100%;
  width: 750px;
}

.width {
  width: 750px;
}

form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.row {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.row > fieldset {
  padding: 0;
  width: 345px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border: none;
  margin-bottom: 25px;
}

.textarea {
  margin-top: 0.4rem;
  color: #0d0d0d;
  width: 100%;
  padding: 4px 6px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  font-size: 0.8em;
  font-family: "Open Sans", sans-serif;
  min-height: 90px;
  resize: none;
  /* overflow: hidden; */
}

.textarea:focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.textarea::-webkit-scrollbar {
  width: 12px;
}

.textarea::-webkit-scrollbar-track {
  border-radius: 10px;
}

.textarea::-webkit-scrollbar-thumb {
  background-color: #cbcbcb;
  border-radius: 10px;
}

#website {
  display: flex;
}

label {
  font-weight: 600;
  font-size: 0.8em;
}

.m1 {
  margin-bottom: 0.1em;
}

.input-two {
  margin-top: 0.4em;
  font-weight: 400;
  padding: 0vh 16px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  height: 38px;
  width: 260px;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9em;
  color: #0d0d0d;
  border-radius: 10px 0 0 10px;
}

.input-two:focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

/* .input-two:focus{
    border: 2px solid #FF7F7F;
  } */

.button-two {
  margin-top: 0.4em;
  font-weight: 400;
  font-size: 0.9em;
  height: 38px;
  width: 85px;
  background-color: #0000c5;
  border: none;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  border-radius: 0 10px 10px 0;
  transition: 0.1s;
}

.button-two:hover {
  background: #0040ff;
}

.upload-box {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 25px;
}

.upload {
  margin-top: 0.4rem;
  display: flex;
  width: 100%;
  background-color: #ffffff;
  border: 2px dashed rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  height: 75px;
  position: relative;
}

.upload:hover {
  border: 2px dashed #0000c5;
  background-color: rgba(21, 0, 255, 0.1);
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.preview-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#preview {
  height: 100%;
  border-radius: 10px 0 0 10px;
}

.input-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#avatar {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  left: 0;
  top: 0;
  cursor: pointer;
}

.text-upload {
  padding: 0 12px;
  font-size: 0.8em;
}

.button {
  margin-bottom: 25px;
}

.link-website-box {
  background-color: #0000c5;
  height: 34px;
  width: 345px;
  font-size: 0.8em;
  color: #ffffff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  overflow: hidden;
}

.link-website-box > div {
  width: 270px;
  overflow: hidden;
  padding: 0 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rule {
  font-size: 0.75em;
  font-weight: 600;
  color: #0000c5;
}

.delete-button {
  cursor: pointer;
  font-size: 0.75em;
  text-decoration: underline;
  color: #ed0028;
}

.remove-button {
  cursor: pointer;
  color: #ffffff;
  background-color: #0000c5;
  height: 100%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
}

.remove-button:hover {
  background-color: #0040ff;
}

.box-top {
  width: 100%;
  color: #ffffff;
  margin: 25px 0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  font-size: 0.9em;
}

.error {
  background-color: #f01446;
}

.success {
  background-color: #0000c5;
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
  .width {
    width: auto;
  }
  .middle > h2 {
    width: auto;
  }

  .tabcontent {
    width: 100%;
    padding: 25px 24px;
  }

  .row {
    flex-direction: column;
  }

  .row > fieldset {
    width: 100%;
  }

  #website {
    width: 100%;
  }

  .input-two {
    padding: 0 24px;
    width: 70%;
  }

  .button-two {
    width: 30%;
  }

  .websites {
    width: 100%;
  }

  .link-website-box {
    width: 100%;
  }

  /* .link-website-box > div {
    width: 85%;
  } */
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .tabcontent {
    padding: 25px 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
