import "./App.css";
import clearIcon from "./assets/images/clear.svg";
import cloudIcon from "./assets/images/cloud.svg";
import drizzleIcon from "./assets/images/drizzle2.svg"
import rainIcon from "./assets/images/rain2.svg";
import snowIcon from "./assets/images/snow.svg";
import thunderstormIcon from "./assets/images/Thunderstorm.svg"
import hazeIcon from "./assets/images/haze.svg";
import humidityIcon from "./assets/images/humidity .png";
import windIcon from "./assets/images/wind1.png";
import loadingIcon from "./assets/images/loading.gif";
import spinnerIcon from "./assets/images/loadIcon.gif"

import { useEffect, useState } from "react"; 

export const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cordinates">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">logitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className="humidity-wind">
        <div className="humidity">
          <div className="humidity-icon">
            <img src={humidityIcon} width={"40px"} alt="wind" />
          </div>
          <div className="humidity-data">
            <div className="humidity-percent">{humidity} %</div>
          </div>
          <div className="humidity-text">humidity</div>
        </div>
        <div className="wind">
          <div className="wind-icon">
            <img src={windIcon} width={"40px"} alt="wind" />
          </div>
          <div className="wind-data">
            <div className="wind-speed">{wind} km/h</div>
          </div>
          <div className="wind-text">wind speed</div>
        </div>
      </div>
    </>
  );
};

function App() {
  let api_key = "4a496ec08277a3c470241c7971ff49bf";
  const [text, setText] = useState("Theni");
  const [icon, setIcon] = useState();
  const [temp, setTemp] = useState(0);
  const [city, setcity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preloading, setPreloading] = useState(true);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "11d": thunderstormIcon,
    "11n": thunderstormIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "50d": hazeIcon,
    "50n": hazeIcon
  };


  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setcity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);
      setError(null);

    } catch (error) {
      console.error("An error occurred", error.message);
      setError("An error occured while fetching weather data");

    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
    setTimeout(() => {

      setPreloading(false);
    }, 1500);

  }, []);

  return (
    <>
      {preloading && <div className="preloader"><img src={spinnerIcon} alt="Loading..." /></div>}

      <div className="container">
        <div className="input-container">
          <input type="text"
            className="city-input"
            placeholder="Search city"
            onChange={handleCity} value={text}
            onKeyDown={handleKeyDown} />
          <div className="search-icon"
            onClick={() => search()}
          >🔍</div>
        </div>


        {loading && <div className="loading-message"><img src={loadingIcon} alt="Loadding..." /></div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">city not found</div>}

        {!loading && !cityNotFound && !error && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          log={log}
          humidity={humidity}
          wind={wind}
        />}

      </div>
    </>
  );
}

export default App;
