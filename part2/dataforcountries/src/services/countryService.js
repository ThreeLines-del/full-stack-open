import axios from "axios";
const baaseUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";

const getAll = async () => {
  const result = axios.get(baaseUrl);
  return result.then((res) => res.data);
};

export default { getAll };
