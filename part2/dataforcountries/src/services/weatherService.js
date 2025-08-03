import axios from "axios";
const api_key = import.meta.env.VITE_SOME_KEY;
const baaseUrl = `https://api.weatherapi.com/v1/current.json?key=${api_key}`;

const getCurrentWeather = async (query) => {
  const request = axios.get(`${baaseUrl}&q=${query}`);
  return request.then((res) => res.data);
};

export default { getCurrentWeather };
