import { request } from "./generic.service";

const uploadImage = (data) =>
  request({
    url: "upload/image",
    method: "post",
    data: data,
    token: true,
  });

export { uploadImage };
