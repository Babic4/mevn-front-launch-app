import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/projects",
    // name: "main-page",
    // component: () => import("../views/MainPage.vue"),
  },
  {
    path: "/admin-panel",
    name: "admin-panel",
    component: () => import("../views/AdminPanel.vue"),
    meta: {
      isAdmin: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LogIn.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/SignUp.vue"),
    meta: {
      guest: true,
    },
  },
  {
    path: "/profile/:id/:tab?",
    name: "profile",
    component: () => import("../views/Profile.vue"),
  },
  {
    path: "/project/:id/:tab?",
    name: "project",
    component: () => import("../views/Project.vue"),
  },
  {
    path: "/projects/:tab?",
    name: "projects",
    component: () => import("../views/Projects.vue"),
  },
  {
    path: "/payment/:projectId",
    name: "payment",
    component: () => import("../views/Payment.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/settings/:tab?",
    name: "settings",
    component: () => import("../views/Settings.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/create-project",
    name: "create-project",
    component: () => import("../views/CreateProject.vue"),
  },
  {
    path: "/update-project/:id/:tab?",
    name: "update-project",
    component: () => import("../views/UpdateProject.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/draft-projects",
    name: "draft-projects",
    component: () => import("../views/UserProjects.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  let isToken = localStorage.getItem("ACCESS_TOKEN") != null ? true : false;

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !localStorage.getItem("IS_ADMIN")
  ) {
    if (isToken) {
      next();
    } else {
      next({ name: from.name });
    }
  } else if (
    to.matched.some((record) => record.meta.guest) &&
    !localStorage.getItem("IS_ADMIN")
  ) {
    if (!isToken) {
      next();
    } else {
      next({ name: from.name });
    }
  } else if (to.matched.some((record) => record.meta.isAdmin)) {
    if (localStorage.getItem("IS_ADMIN")) next();
    else next({ name: "login" });
  } else {
    if (!localStorage.getItem("IS_ADMIN")) next();
    else next({ name: "admin-panel" });
  }
});

export default router;
