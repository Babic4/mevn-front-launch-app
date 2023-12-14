import { createStore } from "vuex";
import user from "./user";
import project from "./project";
import favorit from "./favorit";
import comment from "./comment";
import search from "./search";
import investment from "./investment";
import authorization from "./authorization";
import upload from "./upload";
import admin from "@/store/admin";

export default createStore({
  modules: {
    user,
    project,
    favorit,
    comment,
    search,
    investment,
    authorization,
    upload,
    admin,
  },
});
