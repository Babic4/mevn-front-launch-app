<template>
  <div class="alert-box" v-if="showAlert">
    <label for="error">Сообщение</label>
    <input class="input" type="text" id="error" v-model="error" />
    <div class="button-box">
      <button class="button width" @click="add">Отправить</button>
      <button class="button-red width" @click="close">Отменить</button>
    </div>
  </div>
  <div v-if="showAlert" class="overlay" @click="close"></div>
</template>

<script>
export default {
  data() {
    return {
      showAlert: false,
      error: "",
    };
  },
  methods: {
    alert() {
      let resolve, reject;
      const alertPromise = new Promise((ok, fail) => {
        resolve = ok;
        reject = fail;
      });

      this.$options.alertController = { resolve, reject };
      this.showAlert = true;
      return alertPromise;
    },
    add() {
      this.$options.alertController.resolve(this.error);
      this.error = "";
      this.showAlert = false;
    },
    close() {
      this.$options.alertController.resolve("");
      this.error = "";
      this.showAlert = false;
    },
  },
};
</script>

<style scoped>
.alert-box {
  transform: translate(-50%, -50%);
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 5;
  width: 500px;
  background: #ffffff;
  border-radius: 10px;
  padding: 20px 50px;
  display: flex;
  flex-direction: column;
  /* border: 1px solid #0000c5; */
  border: 1px solid #abb7e9;
}

.title {
  font-size: 1.2em;
  margin: 0.5em 0;
  font-weight: 600;
}

.message {
  font-size: 0.8em;
}

.button-box {
  width: 100%;
  margin-top: 0.7em;
  display: flex;
  justify-content: space-between;
}

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

.error {
  font-size: 0.8em;
  color: #f01446;
}

.input {
  margin-bottom: 0.4em;
}

.width {
  width: 175px;
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
  .alert-box {
    width: calc(100% - 48px);
    transform: translate(calc(-50% - 24px), -50%);
    margin: 0 24px;
    padding: 20px 24px;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .alert-box {
    width: calc(100% - 24px);
    transform: translate(calc(-50% - 12px), -50%);
    margin: 0 12px;
    padding: 20px 12px;
  }

  .button-box {
    flex-direction: column;
    align-items: center;
  }

  .button-red {
    margin-top: 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
