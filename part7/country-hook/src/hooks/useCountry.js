import { useEffect, useState } from "react";
import axios from "axios";

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      .then((data) => setCountry(data))
      .catch(() => {
        setCountry("not found");
      });
  }, [name]);

  return country;
};

export default useCountry;
