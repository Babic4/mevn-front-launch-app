import { request } from "./generic.service";

const getProject = (id) => request({ url: `projects/${id}`, method: "get" });

const getProjects = () => request({ url: "projects", method: "get" });

const getProjectsUs = (userId) =>
  request({ url: `projects/user/${userId}`, method: "get" });

const getPublishedProjects = () =>
  request({ url: "projects/published", method: "get" });

const getDraftProjects = (id) =>
  request({ url: `projects/draft/${id}`, method: "get" });

const createProject = (data) =>
  request({
    url: "projects",
    method: "post",
    data: data,
    token: true,
  });

const updateProject = (id, data) =>
  request({
    url: `projects/${id}`,
    method: "put",
    data: data,
    token: true,
  });

const filterProject = (category) =>
  request({ url: `projects/filter/${category}`, method: "get" });

const getNotification = (userId) =>
  request({ url: `projects/notification/${userId}`, method: "get" });

const delNotification = () =>
  request({ url: "projects/remove-notification/", method: "put" });

const removeProject = (id) =>
  request({
    url: `projects/${id}`,
    method: "delete",
    token: true,
  });

export {
  getProject,
  getProjects,
  getProjectsUs,
  getPublishedProjects,
  getDraftProjects,
  createProject,
  updateProject,
  filterProject,
  getNotification,
  delNotification,
  removeProject,
};
