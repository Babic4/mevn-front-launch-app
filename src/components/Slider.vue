<template>
  <div class="projects">
    <div class="info-slider">
      <div class="info">
        <div class="title-slider">{{ title }}</div>
        <div class="btn-more" @click="$router.push(`/projects/${filter}`)">
          Больше
        </div>
      </div>
      <div class="btns">
        <div
          class="btn-left"
          @click="prevSlide"
          :class="{ disabled: disabledPrev }"
        >
          <i class="fas fa-angle-double-left"></i>
        </div>
        <div
          class="btn-right"
          @click="nextSlide"
          :class="{ disabled: disabledNext }"
        >
          <i class="fas fa-angle-double-right"></i>
        </div>
      </div>
    </div>
    <div class="slider">
      <swiper
        :modules="modules"
        :mousewheel="{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges,
        }"
        :freeMode="true"
        :space-between="17"
        :breakpoints="breakpoints"
        @swiper="onSwiper"
        @progress="checkDisabled"
      >
        <swiper-slide v-for="i in projectsP" :key="i.key">
          <ProjectBox :project="i" :fav="true" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
// import Component
import ProjectBox from "@/components/ProjectBox";

// import Swiper core and required modules
import { Navigation, Mousewheel, FreeMode } from "swiper";

// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles

// Убрать Navigation ????

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/free-mode";

export default {
  components: {
    Swiper,
    SwiperSlide,
    ProjectBox,
  },
  data() {
    return {
      disabledPrev: false,
      disabledNext: false,
      swiper: null,
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        390: {
          slidesPerView: 1.3,
        },
        768: {
          slidesPerView: 2.3,
        },
        992: {
          slidesPerView: 3,
        },
        1350: {
          slidesPerView: 3.3,
        },
      },
    };
  },
  props: ["title", "filter", "projectsP"],
  // mounted() {
  //   console.log(this.$store.state.authorization.userEmail);
  // },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    prevSlide() {
      this.swiper.slidePrev();
    },
    nextSlide() {
      this.swiper.slideNext();
    },
    checkDisabled(swiper, progress) {
      if (progress == 0) {
        this.disabledPrev = true;
      } else {
        this.disabledPrev = false;
      }
      if (progress == 1) {
        this.disabledNext = true;
      } else {
        this.disabledNext = false;
      }
    },
    filterProject() {},
  },
  setup() {
    return {
      modules: [Navigation, Mousewheel, FreeMode],
    };
  },
};
</script>

<style scoped>
.middle {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.projects {
  margin: 45px 0;
  width: 1200px;
}

.info-slider {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.info {
  display: flex;
  align-items: center;
}

.title-slider {
  font-size: 1.1em;
  font-weight: 600;
  margin-right: 12px;
}

.btn-more {
  cursor: pointer;
  padding: 4px 10px;
  font-size: 0.7em;
  background-color: #0000c5;
  color: #ffffff;
  border-radius: 15px;
}

.slider {
  position: relative;
  margin: 0;
  padding: 0;
}

.swiper {
  width: 100%;
  height: 100%;
  /* background: rgb(255, 251, 0); */
}

.swiper-slide {
  /* background: rgb(180, 202, 52); */

  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.project-box {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 100%;
  height: 320px;
  border-radius: 10px;
}

.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1300px) {
  .projects {
    width: 864px;
  }
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  .projects {
    width: 750px;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .projects {
    margin: 30px 0;
    width: 100%;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .projects {
    margin: 20px 0;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
