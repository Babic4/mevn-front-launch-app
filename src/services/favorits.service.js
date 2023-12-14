import { request } from "./generic.service";

const getFavorit = (userId, projectId) =>
  request({
    url: `favorits/${userId}/${projectId}`,
    method: "get",
    token: true,
  });

const getFavorits = (userId) =>
  request({
    url: `favorits/${userId}`,
    method: "get",
    token: true,
  });

const createFavorit = (data) =>
  request({
    url: "favorits",
    method: "post",
    data: data,
    token: true,
  });

const deleteFavorit = (id) =>
  request({
    url: `favorits/${id}`,
    method: "delete",
    token: true,
  });

export { getFavorit, getFavorits, createFavorit, deleteFavorit };
