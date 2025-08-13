import axios from "axios";
const baseUrl = "/api/blogs";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("loggedBlogAppUser"));
  return `Bearer ${user?.token || null}`;
};

// console.log(getToken());

const getAll = async () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  };
  const response = await axios.post(baseUrl, newObject, config);

  return response.data;
};

export default { getAll, create };
