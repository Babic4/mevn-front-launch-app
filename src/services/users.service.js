import { request } from "./generic.service";

const getUser = (id) => request({ url: `users/${id}`, method: "get" });

const getUsers = () => request({ url: "users", method: "get" });

const updateProfile = (id, data) =>
  request({
    url: `users/profile/${id}`,
    method: "put",
    data: data,
    token: true,
  });

const updateAccount = (id, data) =>
  request({
    url: `users/account/${id}`,
    method: "put",
    data: data,
    token: true,
  });

const removeAccount = (id) =>
  request({ url: `users/${id}`, method: "delete", token: true });

export { getUser, getUsers, updateProfile, updateAccount, removeAccount };
