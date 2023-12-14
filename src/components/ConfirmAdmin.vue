<template>
  <div class="confirm-box">
    <div class="title">Подтвердить публикацию</div>
    <div class="message">
      Если вы подвердите, проект будет опубликован. Чтобы отменить публикацию,
      нажмите «Отмена».
    </div>
    <div class="button-box">
      <button class="button width" @click="$emit('proceed')">Ок</button>
      <button class="button-red width" @click="$emit('close')">Отмена</button>
    </div>
  </div>
  <div class="overlay" @click="$emit('close')"></div>
</template>

<script>
export default {
  data() {
    return {};
  },
  emits: ["close", "proceed"],
};
</script>

<style scoped>
.confirm-box {
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
  align-items: center;
  /* box-shadow: 0px 10px 50px #abb7e9; */
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

.button {
  width: 135px;
}

.button-red {
  width: 135px;
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
  .confirm-box {
    width: calc(100% - 48px);
    transform: translate(calc(-50% - 24px), -50%);
    margin: 0 24px;
    padding: 20px 24px;
  }

  .button-box {
    flex-direction: column;
    align-items: center;
  }

  .button {
    margin-top: 12px;
  }

  .width {
    width: 220px;
    padding: 0;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .confirm-box {
    width: calc(100% - 24px);
    transform: translate(calc(-50% - 12px), -50%);
    margin: 0 12px;
    padding: 20px 12px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
