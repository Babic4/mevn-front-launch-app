<template>
  <div class="middle">
    <div class="box-form">
      <div class="text-link-login">
        <span>Есть аккаунт?</span>
        <router-link class="link-login" to="/login"> Войти</router-link>
      </div>
      <h2>Регистрация</h2>
      <div v-if="errors.length" class="error">
        <span v-for="error in errors" :key="error.key">{{ error }}</span>
      </div>
      <form @submit.prevent="onSignup">
        <input
          v-model.trim="name"
          class="input"
          placeholder="Имя"
          autocomplete="off"
          type="text"
          :class="{ invalid: invalidName }"
        />
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
        <input
          v-model.trim="rePassword"
          class="input"
          placeholder="Повторить пароль"
          autocomplete="off"
          type="password"
          :class="{ invalid: invalidRePassword }"
        />
        <input class="button" type="submit" value="Создать аккаунт" />
      </form>
    </div>
  </div>
</template>

<script>
import "../assets/css/styleSignUp.css";
import { mapState, mapActions, mapGetters } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required, email, sameAs, minLength } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      errors: [],
      invalidName: false,
      invalidEmail: false,
      invalidPassword: false,
      invalidRePassword: false,
      name: "",
      email: "",
      password: "",
      rePassword: "",
    };
  },
  validations() {
    return {
      name: { required, minLength: minLength(2) },
      email: { required, email },
      password: { required, minLength: minLength(6) },
      rePassword: {
        required,
        minLength: minLength(6),
        sameAsPassword: sameAs(this.password),
      },
    };
  },
  methods: {
    ...mapActions({
      signup: "signup",
    }),
    async onSignup() {
      // console.log(this.password);
      this.v$.$touch();
      this.invalidName = this.nameError;
      this.invalidEmail = this.emailError;
      this.invalidPassword = this.passwordError;
      this.invalidRePassword = this.rePasswordError;
      if (this.v$.$invalid) {
        this.errors = this.displayError;
        return;
      }
      const formData = {
        name: this.name,
        email: this.email,
        password: this.password,
      };
      this.signup(formData)
        .then(() => {
          this.$router.push("/login");
        })
        .catch((error) => {
          this.errors = [error];
          this.invalidEmail = true;
        });
    },
  },
  computed: {
    ...mapState({
      authorizationError: (state) => state.authorization.authorizationError,
    }),
    ...mapGetters({}),
    displayError() {
      const errors = [];
      if (this.v$.name.required.$invalid) {
        errors.push("Поле имя не заполенно");
      }
      if (this.v$.name.minLength.$invalid) {
        errors.push("Длина имени должна быть не менее 2");
      }
      if (this.v$.email.required.$invalid) {
        errors.push("Поле email не заполенно");
      }
      if (this.v$.email.email.$invalid) {
        errors.push(
          "Значение не является действительным адресом электронной почты"
        );
      }
      if (this.v$.password.required.$invalid) {
        errors.push("Поле пароль не заполенно");
      }
      if (this.v$.password.minLength.$invalid) {
        errors.push("Длина пароля должна быть не менее 6");
      }
      if (this.v$.rePassword.required.$invalid) {
        errors.push("Поле повторного пароля не заполнено");
      }
      if (this.v$.rePassword.minLength.$invalid) {
        errors.push("Длина повторного пароля должна быть не менее 6");
      }
      if (this.v$.rePassword.sameAsPassword.$invalid) {
        errors.push("Значение повторного пароля не совпадает");
      }
      return errors;
    },
    nameError() {
      if (this.v$.name.$invalid) return true;
      return false;
    },
    emailError() {
      if (this.v$.email.$invalid) return true;
      return false;
    },
    passwordError() {
      if (this.v$.password.$invalid) return true;
      return false;
    },
    rePasswordError() {
      if (this.v$.rePassword.$invalid) return true;
      return false;
    },
  },
  // methods: {
  //   ...mapActions(["signup", "refresh"]),
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

.text-link-login {
  margin-bottom: 0.6em;
  font-size: 0.9em;
  flex-direction: row;
}

.link-login {
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
