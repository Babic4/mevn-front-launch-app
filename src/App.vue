<template>
  <div
    v-if="this.notification.length && this.$route.name != 'admin-panel'"
    class="notification"
    @click.self="openProject"
  >
    <div class="notification-message" v-if="this.notification.length == 1">
      У вас новое уведомление!
    </div>
    <div class="notification-message" v-if="this.notification.length > 1">
      У вас {{ this.notification.length }} новых уведомления!
    </div>
    <div class="notification-btn-close" @click="closeNotifaction">
      <i class="fas fa-times"></i>
    </div>
  </div>
  <Header v-if="this.$route.name != 'admin-panel'" />
  <router-view />
  <Footer v-if="this.$route.name != 'admin-panel'" />
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mapState } from "vuex";
import("./assets/css/style.css");

export default {
  data() {
    return {
      showNotification: false,
    };
  },
  methods: {
    openProject() {
      let id = this.notification[this.notification.length - 1]._id;
      console.log(`/update-project/${id}/basics`);
      this.$router.push(`/update-project/${id}/basics`);
    },
    closeNotifaction() {
      this.$store.dispatch("removeNotification");
    },
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.$store.dispatch("setUser").then((response) => {
      this.$store.dispatch("checkNotification", response._id);
    });
  },
  computed: {
    ...mapState({
      notification: (state) => state.project.notification,
    }),
  },
};
</script>

<style land="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");

.notification {
  cursor: pointer;
  background-color: #0000c5;
  padding: 12px 12px 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
}

.notification-message {
  color: white;
}

.notification-btn-close {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-radius: 12px;
}

.notification-btn-close > i {
  padding: 10px 12px;
}

.notification-btn-close:hover {
  background-color: #0040ff;
  color: white;
}
</style>
