<template>
  <div
    class="comment-box"
    :class="{
      border: data.authorId._id == data.projectId.ownerId,
    }"
  >
    <div class="info-comment">
      <div class="img-box">
        <img
          class="img"
          :src="'http://localhost:3000/' + data.authorId.image"
          alt=""
        />
      </div>
      <div class="info">
        <div class="name">
          <div>
            {{ data.authorId.name }}
          </div>
          <div
            class="creator"
            v-if="data.authorId._id == data.projectId.ownerId"
          >
            Создатель
          </div>
        </div>
        <div class="time">
          {{ new Date(data.dateTime).toLocaleString("ru", { hour12: false }) }}
        </div>
      </div>
    </div>
    <div class="comment">
      {{ data.message }}
    </div>
    <div class="block-btn">
      <div class="remove-btn" v-if="checkOwner" @click="deleteReply">
        Удалить
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  props: ["data"],
  methods: {
    ...mapActions({
      delComment: "delComment",
      fetchComments: "fetchComments",
    }),
    deleteReply() {
      this.delComment(this.data._id).then(() => {
        this.fetchComments(this.data.projectId._id);
      });
    },
  },
  computed: {
    checkOwner() {
      if (this.$store.state.authorization.userAuth) {
        if (
          this.data.authorId._id == this.$store.state.authorization.userAuth._id
        )
          return true;
        else return false;
      } else return false;
    },
  },
};
</script>
<style scoped>
.comment-box {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 95%;
  border-radius: 10px;
  /* border: 1px solid #0000c5; */
  padding: 18px;
}

.border {
  border: 1px solid #0000c5;
}

.info-comment {
  display: flex;
  flex-direction: row;
  margin-bottom: 12px;
}

.img-box {
  margin-right: 12px;
}

.img {
  height: 2.3em;
  border-radius: 100%;
}

.info {
  display: flex;
  flex-direction: column;
}

.name {
  display: flex;
  font-size: 0.8em;
  font-weight: 600;
}

.time {
  font-size: 0.7em;
  color: #7c878b;
  font-weight: 500;
}

.comment {
  font-weight: 600;
  font-size: 0.9em;
}

.creator {
  margin-left: 12px;
  background-color: #0000c5;
  color: white;
  padding: 0 6px;
  border-radius: 12px;
}

.remove-btn {
  cursor: pointer;
  font-weight: 400;
  font-size: 0.8em;
  color: #ed0028;
  text-decoration: underline;
}

.block-btn {
  display: flex;
}
</style>
