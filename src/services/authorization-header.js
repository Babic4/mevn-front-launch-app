export default function authHeader() {
  let token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
