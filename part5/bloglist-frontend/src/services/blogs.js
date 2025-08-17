import axios from "axios";
const baseUrl = "/api/blogs";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("loggedBlogAppUser"));
  return user?.token ? `Bearer ${user.token}` : null;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: getToken() },
  };

  const response = await axios.post(baseUrl, newObject, config);
  console.log("BLOG RESPONSE:", response.data);
  return response.data;
};

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);

  return response.data;
};

const deleteOne = async (id) => {
  const config = {
    headers: { Authorization: getToken() },
  };

  await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, create, update, deleteOne };
