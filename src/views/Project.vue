<template>
  <div class="middle">
    <div v-if="checkOwner" class="box-banner">
      <div class="text-banner">Редактировать</div>
      <button
        class="button-banner b-blue"
        @click="$router.push(`/update-project/${id}/basics`)"
      >
        <i class="fas fa-pen"></i>
      </button>
    </div>
    <div class="header-project">
      <div class="top-header-project">
        <div class="title-project">{{ project.title }}</div>
        <div class="description-project">{{ project.description }}</div>
      </div>
      <div class="bottom-header-project">
        <div class="box-img-video-project">
          <img
            v-if="project.image"
            class="main-img-project"
            :src="'http://localhost:3000/' + project.image"
            alt=""
          />
          <video class="main-video-project" controls>
            <source src="/video/test-video.mp4" />
          </video>
          <div class="layer-play" @click="playVideo" v-if="project.video">
            <i class="btn-play fas fa-play"></i>
          </div>
        </div>
        <div class="box-info-project">
          <div class="box-amount">
            <div class="progress">
              <div
                class="progress-bar"
                :style="{ width: percentBar + '%' }"
              ></div>
            </div>
            <div class="box-info-amount">
              <span class="amount">{{ this.collectedAmount }}$</span>
              <span class="text-amount"
                >из {{ project.collectingAmount }}$ необходимых</span
              >
            </div>
          </div>
          <div class="box-backers">
            <span class="backers">{{ this.investers }}</span>
            <span class="text-backers">Инвесторов</span>
          </div>
          <div class="box-days-to-go" v-if="(days = calcDaysToGo()) > 0">
            <span class="days-to-go">{{ days }}</span>
            <span class="text-days-to-go">Дней осталось</span>
          </div>
          <div class="box-buttons">
            <button
              class="following"
              :class="{ activeFollowing: favorit }"
              @click="following"
              :disabled="$store.state.authorization.userAuth == null"
            >
              <i class="fas fa-star"></i>
            </button>
            <button
              class="button"
              :disabled="$store.state.authorization.userAuth == null"
              @click="$router.push(`/payment/${this.id}`)"
            >
              Поддержать проект
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="tab">
      <div
        class="tablinks"
        :class="{ active: tab == 'compaing' }"
        @click="$router.push(`/project/${this.id}/compaing`)"
        id="btnCompaing"
      >
        Компания
      </div>
      <div
        class="tablinks"
        :class="{ active: tab == 'comments' }"
        @click="$router.push(`/project/${this.id}/comments`)"
        id="btnComments"
      >
        Комментарии
      </div>
      <div
        class="tablinks"
        :class="{ active: tab == 'community' }"
        @click="$router.push(`/project/${this.id}/community`)"
        id="btnCommunity"
      >
        Сообщество
      </div>
    </div>

    <!-- Tab content -->
    <div id="Compaing" class="tabcontent" v-if="tab == 'compaing'">
      <div>
        <div class="column-1">
          <h2>История</h2>
          <div v-html="project.story" class="story"></div>
          <h2>Риски</h2>
          <div class="risks">
            {{ project.risks }}
          </div>
        </div>
        <div class="column-2"></div>
      </div>
    </div>

    <div id="Comments" class="tabcontent" v-if="tab == 'comments'">
      <div class="box-input-comment">
        <form
          class="form-comment"
          v-if="checkOpenComments"
          @submit.prevent="addComment"
        >
          <input
            type="text"
            name=""
            placeholder="Оставить комментарий"
            id=""
            ref="inpComment"
            v-model="comment"
            @input="checkReply"
            @sumbit.prevent="addComment"
            class="input-two"
          />
          <input class="button-two" type="submit" value="Отправить" />
        </form>
        <div v-else class="hidden-input-comment">
          <span>Оставлять комментарии доступно только инвесторам!</span>
        </div>
      </div>
      <div class="none" v-if="!comments.length">Нет комментариев</div>
      <template v-for="comment in comments" :key="comment._id">
        <Comment class="comment" :data="comment" @reply="addReply" />
        <template v-for="reply in comment.replies" :key="reply._id">
          <Reply class="comment" :data="reply" />
        </template>
      </template>
    </div>

    <div id="Community" class="tabcontent" v-if="tab == 'community'">
      <div class="none" v-if="!investments.length">Нет инвесторов</div>
      <CommunityBox
        v-for="investment in investments"
        :key="investment._id"
        :user="investment.userId"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Comment from "@/components/Comment";
import Reply from "@/components/Reply";
import CommunityBox from "@/components/CommunityBox";

export default {
  data() {
    return {
      id: null,
      tab: null,
      showInputSearch: false,
      showLayer: true,
      showInputComment: false,
      isFollow: false,
      percentBar: 0,
      collectedAmount: 0,
      investers: 0,
      days: 0,
      comment: "",
      dataReply: null,
    };
  },
  methods: {
    ...mapActions({
      fetchProject: "fetchProject",
      fetchFavorit: "fetchFavorit",
      fetchInvestment: "fetchInvestment",
      createFavorit: "createFavorit",
      deleteFavorit: "deleteFavorit",
      fetchComments: "fetchComments",
      callCreateComment: "callCreateComment",
      fetchInvestmentsProject: "fetchInvestmentsProject",
    }),
    calcСollectedAmount() {
      let sum = 0;
      this.investments.forEach((element) => {
        sum += element.amount;
      });
      this.collectedAmount = sum;
      // console.log(Math.round((sum / this.project.collectingAmount) * 100));
      if (Math.round((sum / this.project.collectingAmount) * 100) < 100) {
        this.percentBar = Math.round(
          (sum / this.project.collectingAmount) * 100
        );
      } else this.percentBar = 100;
    },
    calcInvestors() {
      this.investers = this.investments.length;
    },
    calcDaysToGo() {
      // Заменить дату СОЗДАНИЯ на дату ПУБЛИКАЦИИ
      if (this.project.radioButton == 1) {
        const dateNow = new Date();
        const datePublish = new Date(this.project.publishDate);
        datePublish.setDate(datePublish.getDate() + this.project.numberOfDays);
        return Math.ceil(
          (datePublish.getTime() - dateNow.getTime()) / (1000 * 3600 * 24)
        );
      } else if (this.project.radioButton == 2) {
        const dateNow = new Date();
        const dateEnd = new Date(this.project.targetDate);
        return Math.ceil(
          (dateEnd.getTime() - dateNow.getTime()) / (1000 * 3600 * 24)
        );
      }
    },
    playVideo() {
      let video, img;
      video = document.getElementsByClassName("main-video-project")[0];
      img = document.getElementsByClassName("main-img-project")[0];
      video.style.zIndex = 2;
      img.style.zIndex = -1;
      this.showLayer = false;
      video.play();
    },
    following() {
      if (this.favorit) {
        this.deleteFavorit(this.favorit._id);
      } else {
        this.createFavorit({
          userId: this.$store.state.authorization.userAuth._id,
          projectId: this.id,
        });
      }
      // if(){
      //   this.$state.dispatch("createFavorit", );
      // } else {
      //   this.$state.dispatch("deleteFavorit", );
      // }
    },
    addComment() {
      console.log("Enter");
      if (this.comment) {
        if (
          this.dataReply &&
          this.comment.indexOf(this.dataReply.authorId.name + ", ") != -1
        ) {
          console.log("reply");
          let startSlice = this.dataReply.authorId.name.length + 2;
          let reply = this.comment.slice(startSlice);
          const formData = {
            parentId: this.dataReply._id,
            authorId: this.$store.state.authorization.userAuth._id,
            projectId: this.id,
            message: reply,
          };
          this.callCreateComment(formData).then(() => {
            this.fetchComments(this.id);
            this.dataReply = null;
            this.comment = "";
          });
        } else {
          console.log("comment");
          const formData = {
            authorId: this.$store.state.authorization.userAuth._id,
            projectId: this.id,
            message: this.comment,
          };
          console.log(formData);
          this.callCreateComment(formData).then(() => {
            this.fetchComments(this.id);
            this.comment = "";
          });
        }
      }
    },
    addReply(data) {
      this.dataReply = data;
      this.comment = data.authorId.name + ", ";
      this.$refs.inpComment.focus();
    },
    checkReply() {
      if (this.dataReply) {
        if (this.comment.indexOf(this.dataReply.authorId.name + ",") == -1) {
          this.dataReply = null;
          this.comment = "";
        }
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchProject(to.params.id);
    if (this.$store.state.authorization.userAuth) {
      this.fetchFavorit({
        userId: this.$store.state.authorization.userAuth._id,
        projectId: to.params.id,
      });
    }
    switch (to.params.tab) {
      case "comments":
        if (this.$store.state.authorization.userAuth) {
          this.fetchInvestment({
            projectId: to.params.id,
            userId: this.$store.state.authorization.userAuth._id,
          })
            .then(() => {
              this.showInputComment = true;
            })
            .catch(() => {
              this.showInputComment = false;
            });
        }
        this.fetchComments(to.params.id);
        break;
      case "community":
        console.log("fetch community");
        break;
    }
    next();
    // обрабатываем изменение параметров маршрута...
    // не забываем вызвать next()
  },
  created() {
    this.fetchProject(this.$route.params.id);
    if (this.$store.state.authorization.userAuth) {
      this.fetchFavorit({
        userId: this.$store.state.authorization.userAuth._id,
        projectId: this.$route.params.id,
      });
    }
    switch (this.$route.params.tab) {
      case "comments":
        if (this.$store.state.authorization.userAuth) {
          this.fetchInvestment({
            projectId: this.$route.params.id,
            userId: this.$store.state.authorization.userAuth._id,
          })
            .then(() => {
              this.showInputComment = true;
            })
            .catch(() => {
              this.showInputComment = false;
            });
        }
        this.fetchComments(this.$route.params.id);
        break;
      case "community":
        console.log("fetch community");
        break;
    }
  },
  mounted() {
    // if (!this.$route.params.tab) {
    //   this.$router.push(`/project/${this.id}/compaing`);
    // }
    this.tab = this.$route.params.tab;
    this.id = this.$route.params.id;
    this.fetchInvestmentsProject(this.id).then(() => {
      this.calcСollectedAmount();
      this.calcInvestors();
    });
  },
  updated() {
    // if (!this.$route.params.tab) {
    //   this.$router.push(`/project/${this.id}/compaing`);
    // }
    if (this.tab != this.$route.params.tab) {
      this.tab = this.$route.params.tab;
    }
    if (this.id != this.$route.params.id) {
      this.id = this.$route.params.id;
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      favorit: (state) => state.favorit.favorit,
      comments: (state) => state.comment.comments,
      investments: (state) => state.investment.investments,
    }),
    ...mapGetters({}),
    checkOwner() {
      if (this.project.ownerId && this.$store.state.authorization.userAuth) {
        if (
          this.project.ownerId._id ==
          this.$store.state.authorization.userAuth._id
        )
          return true;
        else return false;
      } else return false;
    },
    checkOpenComments() {
      // Возможнот комментировать создателю
      if (this.project.ownerId && this.$store.state.authorization.userAuth) {
        if (
          this.project.ownerId._id ==
          this.$store.state.authorization.userAuth._id
        )
          return true;
        else {
          if (this.showInputComment) return true;
          else return false;
        }
      } else return false;
    },
  },
  components: {
    Comment,
    Reply,
    CommunityBox,
  },
};
</script>

<style scoped>
.story,
.risks {
  font-size: 0.8em;
}

.risks {
  margin-bottom: 24px;
}

.box-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  right: 24px;
  top: 12px;
  background: #ffffff;
  border-radius: 10px;
  height: 38px;
  overflow: hidden;
}

.text-banner {
  font-size: 0.8em;
  font-weight: 500;
  padding: 0 12px;
}

.button-banner {
  border: none;
  height: 100%;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
}

.b-blue {
  background-color: #0000c5;
}

.b-blue:hover {
  background-color: #0040ff;
}

.b-red {
  background-color: #ed0028;
}

.b-red:hover {
  background-color: #fd003b;
}

/* -------------------------------------- */

.middle {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
}

.header-project {
  display: flex;
  flex-direction: column;
  padding: 30px 0;
}

.title-project {
  font-size: 1.6em;
  font-weight: 600;
}

.description-project {
  margin-bottom: 25px;
  font-size: 0.9em;
  font-weight: 300;
}

.bottom-header-project {
  display: flex;
  height: 100%;
}

.box-img-video-project {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16rem;
  overflow: hidden;
  background: #000000;
}

.main-img-project {
  height: 100%;
  z-index: 2;
}

.main-video-project {
  height: auto;
  width: 100%;
  z-index: -1;
  position: absolute;
}

.layer-play {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.btn-play {
  color: white;
  font-size: 2em;
}

.box-info-project {
  font-weight: 600;
  margin-left: 25px;
}

.box-amount {
  width: 350px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.box-info-amount {
  vertical-align: baseline;
}

.amount {
  color: #0000c5;
}

.amount,
.backers,
.days-to-go {
  margin-right: 6px;
  font-size: 1.4em;
}

.box-backers,
.box-days-to-go,
.box-share {
  margin-bottom: 20px;
  vertical-align: baseline;
}

.text-amount,
.text-backers,
.text-days-to-go {
  color: #7c878b;
  font-size: 0.8em;
}

.box-buttons {
  width: 350px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.following {
  height: 34px;
  width: 34px;
  border-radius: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: #e6e9ff; */
  background: #ffffff;
  border: none;
  padding: 10px;
  color: #000000;
  box-shadow: 0px 10px 50px #abb7e9;
  cursor: pointer;
}

.following:disabled {
  color: black;
  background-color: rgba(21, 0, 255, 0.1);
}

.activeFollowing {
  outline: 3px solid rgba(255, 204, 96, 0.4);
  border: 2px solid #ffcc60;
  background: #ffcc60;
  color: #000000;
}

/* Style the tab */
.tab {
  overflow: hidden;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.tablinks {
  font-size: 0.8em;
  font-weight: 600;
  background-color: inherit;
  color: #000000;
  text-decoration: none;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}

/* Style the buttons that are used to open the tab content */

/* Change background color of buttons on hover */
/* .tab button:hover {
    background-color: #ddd;
  }
   */
/* Create an active/current tablink class */
.active {
  color: #0000c5;
}

/* Style the tab content */
.tabcontent {
  padding: 15px 12px;
  border-top: none;
}

.progress {
  height: 8px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: start;
  /* background: #e6e9ff; */
  background: #ffffff;
  border-radius: 20px;
  /* box-shadow: 0px 10px 50px #abb7e9; */
  margin-bottom: 6px;
}

.progress-bar {
  height: 8px;
  background: #0000c5;
  /* outline: 3px solid rgba(21, 0, 255, 0.1); */
  /* box-shadow: 2px 14px 15px -7px rgba(30, 166, 250, 0.36); */
  border-radius: 50px;
  transition: all 0.5s;
}

#Comments {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 750px;
}

#Compaing > div {
  width: 750px;
}

#Community {
  display: flex;
  flex-direction: column;
  width: 750px;
}

.form-comment {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.hidden-input-comment {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
  font-weight: 500;
  color: #0000c5;
  height: 38px;
  margin-bottom: 25px;
  background: #ffffff;
  border-radius: 10px;
  text-align: center;
}

.input-two {
  margin-top: 0.4em;
  font-weight: 400;
  padding: 0vh 1.2vw 0 1.2vw;
  border: 2px solid rgba(0, 0, 0, 0.3);
  height: 38px;
  width: 100%;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9em;
  color: #0d0d0d;
  border-radius: 10px 0 0 10px;
}

.input-two:focus {
  border: 2px solid #0000c5;
  outline: 3px solid rgba(21, 0, 255, 0.1);
}

.button-two {
  margin-top: 0.4em;
  font-weight: 400;
  font-size: 0.9em;
  padding: 0 12px;
  height: 38px;
  background-color: #0000c5;
  border: none;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  border-radius: 0 10px 10px 0;
  transition: 0.1s;
}

.button-two:hover {
  background: #0040ff;
}

.comment {
  margin-bottom: 12px;
}

.comment:last-child {
  margin-bottom: 0;
}

.box-input-comment {
  width: 100%;
}

.none {
  color: #7c878b;
  width: 100%;
  text-align: center;
}

/* -------------------------  adaptive  -------------------------- */
/*==========  Desktop First  ========== */
/* Large Devices, Wide Screens */
@media only screen and (max-width: 1200px) {
  /* */
}
/* Medium Devices, Desktops */
@media only screen and (max-width: 992px) {
  .bottom-header-project {
    flex-direction: column;
  }

  .box-info-project {
    margin-left: 0;
    margin-top: 25px;
  }

  .box-amount,
  .box-buttons {
    width: auto;
  }
}
/* Small Devices, Tablets */
@media only screen and (max-width: 768px) {
  .header-project {
    padding: 60px 24px 30px 24px;
  }

  .box-img-video-project {
    height: auto;
    width: 90vw;
  }

  .main-img-project {
    height: auto;
    width: 100%;
  }

  .tabcontent {
    padding: 15px 24px;
  }

  #Compaing > div {
    width: auto;
  }

  .box-banner {
    width: 94%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  #Comments,
  #Community {
    width: 100%;
  }
}
/* Extra Small Devices, Phones */
@media only screen and (max-width: 480px) {
  .header-project {
    padding: 60px 12px 16px 12px;
  }

  .tabcontent {
    padding: 14px 12px;
  }

  .tab {
    white-space: nowrap;
    overflow-x: scroll;
    /* flex-direction: column; */
    justify-content: flex-start;
  }
}

/*# sourceMappingURL=adaptive.css.map */
</style>
