import { useEffect, useState } from "react";
import weatherService from "./services/weatherService";

const CountryDetails = ({ country }) => {
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const capital = Array.isArray(country.capital)
      ? country.capital[0]
      : country.capital;

    weatherService
      .getCurrentWeather(capital)
      .then((data) => setWeatherInfo(data));
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h1>Languages</h1>
      <ul>
        {Object.values(country.languages).map((lan, i) => (
          <li key={i}>{lan}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="" />
      {weatherInfo ? (
        <div>
          <h1>Weather in {weatherInfo.location.name}</h1>
          <p>Temperature {weatherInfo.current.temp_c} Celsius</p>
          <img src={weatherInfo.current.condition.icon} alt="" />
          <p>{weatherInfo.current.condition.text}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CountryDetails;
