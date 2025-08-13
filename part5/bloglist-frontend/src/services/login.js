import axios from "axios";
const baseUrl = "/api/login";

const userLogin = async (creds) => {
  const request = await axios.post(baseUrl, creds);
  return request.data;
};

export { userLogin };
