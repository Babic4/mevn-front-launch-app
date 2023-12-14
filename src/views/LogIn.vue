<template>
  <div class="middle">
    <div class="box-form">
      <h2>Авторизоваться</h2>
      <div v-if="errors.length" class="error">
        <span v-for="error in errors" :key="error.key">{{ error }}</span>
      </div>
      <form @submit.prevent="onLogin">
        <input
          v-model.trim="email"
          class="input"
          placeholder="Email"
          autocomplete="off"
          type="text"
          :class="{ invalid: invalidEmail }"
        />
        <input
          v-model.trim="password"
          class="input"
          placeholder="Пароль"
          autocomplete="off"
          type="password"
          :class="{ invalid: invalidPassword }"
        />
        <input class="button" type="submit" value="Войти" />
      </form>
      <div class="text-link-registration">
        <span>Впервые в Launch?</span>
        <router-link class="link-registration" to="/signup">
          Зарегистрироваться
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      errors: [],
      invalidEmail: false,
      invalidPassword: false,
      email: "",
      password: "",
    };
  },
  validations: {
    email: { email, required, $autoDirty: true },
    password: { required, minLength: minLength(6), $autoDirty: true },
  },
  methods: {
    ...mapActions({
      login: "login",
    }),
    async onLogin() {
      this.v$.$touch();
      this.invalidEmail = this.emailError;
      this.invalidPassword = this.passwordError;
      if (this.v$.$invalid) {
        this.errors = this.displayError;
        return;
      }
      const formData = {
        email: this.email,
        password: this.password,
      };
      this.login(formData)
        .then((response) => {
          if (!localStorage.getItem("IS_ADMIN")) {
            this.$store.dispatch("checkNotification", response.user._id);
            this.$router.push("/projects");
          } else this.$router.push("/admin-panel");
        })
        .catch((error) => {
          this.errors = [error];
          this.invalidEmail = true;
          this.invalidPassword = true;
        });
      // ???
      // if (this.authorizationError != null) {
      //   this.errors = [this.authorizationError];
      //   this.invalidEmail = true;
      //   this.invalidPassword = true;
      // }
    },
  },
  computed: {
    ...mapState({
      authorizationError: (state) => state.authorization.authorizationError,
    }),
    ...mapGetters({
      // authorizationError: "authorizationError",
    }),
    displayError() {
      const errors = [];
      if (this.v$.email.required.$invalid) {
        errors.push("Поле email не заполенно");
      }
      if (this.v$.email.email.$invalid) {
        errors.push(
          "Значение не является действительным адресом электронной почты"
        );
      }
      if (this.v$.password.required.$invalid) {
        errors.push("Поле пароля не заполнено");
      }
      if (this.v$.password.minLength.$invalid) {
        errors.push("Длина пароля должна быть не менее 6");
      }
      return errors;
    },
    emailError() {
      if (this.v$.email.$invalid) return true;
      return false;
    },
    passwordError() {
      if (this.v$.password.$invalid) return true;
      return false;
    },
  },
  // methods: {
  //   ...mapActions(["login", "refresh"]),
  // },
};
</script>

<style scoped>
.middle {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  padding: 75px 0;
}

/* -------------------------------------- */

.box-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.box-form > h2 {
  margin: 0;
  margin-bottom: 25px;
  font-size: 1.2em;
}

.box-form > form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 325px;
}

.text-link-registration {
  margin-top: 25px;
  font-size: 0.9em;
}

.link-registration {
  color: #01b5e6;
  text-decoration: none;
}

.error {
  font-size: 0.9em;
  width: 325px;
  color: #ffffff;
  border-radius: 15px;
  background-color: #f01446;
  margin-bottom: 25px;
  padding: 15px 15px;
  display: flex;
  flex-direction: column;
}

.error > span {
  text-align: left;
  width: 100%;
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
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-form > h2 {
    font-size: 1.1em;
  }

  .box-form > form {
    width: 301px;
  }

  .text-link-registration {
    font-size: 0.7em;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
