import { useEffect, useState } from "react";
import CountryDetails from "./CountryDetails";
import countryService from "./services/countryService";

function App() {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isTooMany, setIsTooMany] = useState(false);
  const [visibleCountry, setVisibleCountry] = useState(null);

  useEffect(() => {
    countryService.getAll().then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    const result = searchQuery
      ? countries.filter((country) =>
          country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

    const isTooMany = result.length >= 10;
    setIsTooMany(isTooMany);
    setFilteredCountries(isTooMany ? [] : result);
  }, [searchQuery, countries]);

  function handleOnSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  return (
    <div>
      find countries{" "}
      <input value={searchQuery} onChange={handleOnSearchChange} type="text" />
      {isTooMany ? <p>Too many matches, specify another filter</p> : null}
      <ul>
        {filteredCountries.length === 1
          ? filteredCountries.map((country) => {
              return <CountryDetails key={country.area} country={country} />;
            })
          : filteredCountries.map((country) => (
              <li key={country.area}>
                {country.name.common}{" "}
                <button
                  onClick={() => {
                    setVisibleCountry(
                      visibleCountry?.name.common === country.name.common
                        ? null
                        : country
                    );
                  }}
                >
                  {visibleCountry?.name.common === country.name.common
                    ? "Hide"
                    : "Show"}
                </button>
                {visibleCountry?.name.common === country.name.common && (
                  <CountryDetails country={visibleCountry} />
                )}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default App;
