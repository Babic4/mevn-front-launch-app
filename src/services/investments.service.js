import { request } from "./generic.service";

const getInvestment = (projectId, userId) =>
  request({
    url: `investments/payment/${projectId}/${userId}`,
    method: "get",
  });

const getInvestmnetsProject = (projectId) =>
  request({ url: `investments/project/${projectId}`, method: "get" });

const getInvestmentUser = (userId) =>
  request({ url: `investments/user/${userId}`, method: "get" });

const createInvestment = (data) =>
  request({
    url: "investments",
    method: "post",
    data: data,
    token: true,
  });

const updateInvestment = (id, data) =>
  request({
    url: `investments/${id}`,
    method: "put",
    data: data,
    token: true,
  });

export {
  getInvestment,
  getInvestmnetsProject,
  getInvestmentUser,
  createInvestment,
  updateInvestment,
};
