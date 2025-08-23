import axios from "axios";
import { useEffect, useState } from "react";

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);
  let token = null;

  const setToken = (newToken) => {
    token = `bearer ${newToken}`;
  };

  useEffect(() => {
    const getAll = async () => {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    };

    getAll();
  }, []);

  const create = async (newObject) => {
    const config = {
      headers: { Authorization: token },
    };
    const response = await axios.post(baseUrl, newObject, config);
    setResources((prev) => [...prev, response.data]);
  };

  const update = async (id, newObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, newObject);
    setResources((prev) => prev.map((r) => (r.id === id ? response.data : r)));
  };

  const service = {
    create,
    update,
    setToken,
  };

  return [resources, service];
};

export default useResource;
