import { request } from "./generic.service";

const getComments = (projectId) =>
  request({ url: `comments/project/${projectId}`, method: "get" });

const createComment = (data) =>
  request({
    url: `comments`,
    method: "post",
    data: data,
    token: true,
  });

const removeComment = (id) =>
  request({
    url: `comments/${id}`,
    method: "delete",
    token: true,
  });

export { getComments, createComment, removeComment };
