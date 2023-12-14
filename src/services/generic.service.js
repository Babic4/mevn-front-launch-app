import axios from "axios";
import authHeader from "./authorization-header";

const API_URL = "http://localhost:3000/api";

export const request = async ({ url, method, data, token }) => {
  let response;
  if (token) {
    const headers = authHeader();

    const options = {
      method: method,
      url: `${API_URL}/${url}`,
      data: data,
      headers,
    };

    // send the request
    response = await axios(options);

    // response = await axios[method](`${API_URL}/${url}`, data, {
    //   headers: authHeader(),
    // });
  } else {
    const options = {
      method: method,
      url: `${API_URL}/${url}`,
      data: data,
    };

    // send the request
    response = await axios(options);

    // response = await axios[method](`${API_URL}/${url}`, data);
  }
  return response.data;
};
