import { request } from "./generic.service";

const searchProjects = (text) =>
  request({ url: `search/projects/${text}`, method: "get" });

const searchUsers = (text) =>
  request({ url: `search/users/${text}`, method: "get" });

export { searchProjects, searchUsers };
