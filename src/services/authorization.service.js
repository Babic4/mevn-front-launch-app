import { request } from "./generic.service";

const login = (data) =>
  request({ url: "authorization/login", method: "post", data: data });

const signup = (data) =>
  request({ url: "authorization/signup", method: "post", data: data });

const refresh = (data) =>
  request({ url: "authorization/refresh", method: "post", data: data });

const logout = (data) =>
  request({ url: "authorization/logout", method: "post", data: data });

export { login, signup, refresh, logout };
