<template>
  <div
    class="investment-box"
    @click="onClickInvestmentBox"
    v-if="investment.projectId"
  >
    <div class="img-box">
      <img
        class="img"
        :src="'http://localhost:3000/' + investment.projectId.image"
      />
    </div>
    <div class="info-investment">
      <div class="row">
        <div class="title">{{ investment.projectId.title }}</div>
        <div class="count-investment">{{ investment.amount }}$</div>
      </div>
      <div class="description">{{ investment.projectId.description }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["investment"],
  methods: {
    onClickInvestmentBox() {
      this.$router.push(`/project/${this.investment.projectId._id}/compaing`);
    },
  },
};
</script>
<style scoped>
.investment-box {
  cursor: pointer;
  display: flex;
  background-color: #ffffff;
  width: 750px;
  height: 120px;
  border-radius: 10px;
  justify-content: space-between;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.img-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 200px;
  border-radius: 10px 0 0 10px;
  overflow: hidden;
  background: #000;
}

.img {
  height: 100%;
  width: 100%;
}

.info-investment {
  flex-grow: 1;
  width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 15px 25px 0 15px;
}

.title {
  font-size: 0.9em;
  font-weight: 600;
}

.description {
  display: flex;
  width: 90%;
  font-size: 0.8em;
  font-weight: 300;
}

.count-investment {
  font-size: 0.9em;
  color: #1400ff;
  font-weight: 600;
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
  .investment-box {
    width: 100%;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
}

/*# sourceMappingURL=adaptive.css.map */
</style>
