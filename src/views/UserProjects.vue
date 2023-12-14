<template>
  <div class="middle">
    <div class="width">
      <h2>Черновые проекты</h2>
      <DraftProjectBox2
        class="margin-bottom"
        v-for="project in draftProjects"
        :key="project._id"
        :project="project"
      />
    </div>
    <div
      v-if="scrollY"
      class="banner-bottom"
      @click="scrollToTop"
      :class="{ bottom: isBottom }"
    >
      <i class="fas fa-angle-up"></i>
    </div>
  </div>
</template>

<script>
import DraftProjectBox2 from "@/components/DraftProjectBox-2";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      scrollY: 0,
      isBottom: false,
    };
  },
  methods: {
    ...mapActions({
      fetchDraftProjects: "fetchDraftProjects",
    }),
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    handleScroll() {
      this.scrollY = window.scrollY;
      if (
        Math.ceil(window.scrollY) >=
        document.documentElement.scrollHeight - window.innerHeight - 58
      ) {
        this.isBottom = true;
      } else this.isBottom = false;
    },
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  mounted() {
    this.fetchDraftProjects(this.$store.state.authorization.userAuth._id);
  },
  unmounted() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    ...mapState({
      draftProjects: (state) => state.project.draftProjects,
    }),
    ...mapGetters({}),
  },
  components: {
    DraftProjectBox2,
  },
};
</script>

<style scoped>
.middle {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  position: relative;
}

.banner-bottom {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 24px;
  bottom: 12px;
  /* bottom: 82px; */
  background-color: #000;
  color: #fff;
  border-radius: 10px;
  height: 38px;
  width: 38px;
  font-size: 1.2em;
  cursor: pointer;
  position: fixed;
}

.banner-bottom:hover {
  background-color: #0000c5;
}

.width {
  width: 750px;
  display: flex;
  flex-direction: column;
  margin-bottom: 72px;
}

.margin-bottom {
  margin-bottom: 12px;
}

.margin-bottom:last-child {
  margin-bottom: 0;
}

.bottom {
  bottom: 82px;
}
/* -------------------------------------- */

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  .width {
    width: auto;
  }

  .middle {
    padding: 86px;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .width {
    padding: 0 24px 50px 24px;
  }

  .middle {
    padding: 0;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
}

/*# sourceMappingURL=adaptive.css.map */
</style>
