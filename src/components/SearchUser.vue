<template>
  <div class="box-search-user" @click="onClickUser">
    <div class="box-image-search-user">
      <img
        class="image-search-user"
        :src="'http://localhost:3000/' + user.image"
      />
    </div>
    <div class="name-search-user">{{ user.name }}</div>
  </div>
</template>
<script>
export default {
  props: ["user"],
  emits: ["close"],
  methods: {
    onClickUser() {
      this.$emit("close");
      this.$router.push(`/profile/${this.user._id}/info`);
      // console.log("Click ProjectBox");
    },
  },
};
</script>
<style>
.box-search-user {
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 100px;
  margin-bottom: 12px;
  align-items: center;
}

.box-search-user:last-child {
  margin-bottom: 0px;
}

.box-image-search-user {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100px;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 36px;
}

.image-search-user {
  height: 100%;
  width: 100%;
}

.name-search-user {
  font-weight: 600;
  flex-grow: 1;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  .box-image-search-user {
    height: 75px;
    width: 75px;
  }
  /* */
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .title-search-user {
    font-size: 0.8em;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .box-image-search-user {
    height: 55px;
    width: 55px;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
