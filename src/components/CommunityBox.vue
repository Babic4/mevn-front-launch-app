<template>
  <div class="box-search-user" @click="onClickUser">
    <div class="box-image-search-user">
      <img
        class="image-search-user"
        :src="'http://localhost:3000/' + user.image"
      />
    </div>
    <div class="name-search-project">{{ user.name }}</div>
  </div>
</template>
<script>
export default {
  props: ["user"],
  methods: {
    onClickUser() {
      this.$router.push(`/profile/${this.user._id}/info`);
      // console.log("Click ProjectBox");
    },
  },
};
</script>
<style scoped>
.box-search-user {
  padding: 12px 24px;
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 100px;
  margin-bottom: 12px;
  align-items: center;
  background-color: white;
  border-radius: 10px;
}

.box-search-user:last-child {
  margin-bottom: 0px;
}

.box-image-search-user {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 76px;
  border-radius: 100%;
  overflow: hidden;
  margin-right: 36px;
}

.image-search-user {
  height: 100%;
}

.name-search-project {
  font-weight: 600;
}
</style>
