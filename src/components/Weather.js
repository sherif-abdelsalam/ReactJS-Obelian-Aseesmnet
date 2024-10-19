import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Error from './Error';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [currentLocationForecast, setCurrentLocationForecast] = useState([]);

  const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'];
  const apiKey = 'f88b889cf5c304ef8f9a8a87d01a0dc6';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const requests = cities.map(city =>
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        );

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(res => res.json()));

        const cityWeatherData = data.map(weather => ({
          cityName: weather.name,
          temp: weather.main.temp,
          feels_like: weather.main.feels_like,
          humidity: weather.main.humidity,
          description: weather.weather[0].description,
          wind_speed: weather.wind.speed,
          clouds: weather.clouds.all,
          icon: weather.weather[0].icon,
        }));

        setWeatherData(cityWeatherData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch weather data.');
        setLoading(false);
      }
    };

    const fetchCurrentLocationWeather = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        const data = await response.json();
        const currentLocationWeatherData = {
          cityName: data.name,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          wind_speed: data.wind.speed,
          clouds: data.clouds.all,
          icon: data.weather[0].icon,
        };

        setCurrentLocationWeather(currentLocationWeatherData);

        // Fetch 5-day forecast for current location
        fetchCurrentLocationForecast(latitude, longitude);
      } catch (error) {
        setError('Failed to fetch current location weather data.');
      }
    };

    const fetchCurrentLocationForecast = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        const data = await response.json();
        const forecast = data.list.filter((_, index) => index % 8 === 0).map(day => ({
          date: new Date(day.dt * 1000).toLocaleDateString(),
          temp: day.main.temp,
          feels_like: day.main.feels_like,
          humidity: day.main.humidity,
          description: day.weather[0].description,
          wind_speed: day.wind.speed,
          clouds: day.clouds.all,
          icon: day.weather[0].icon,
        }));

        setCurrentLocationForecast(forecast);
      } catch (error) {
        setError('Failed to fetch 5-day forecast for current location.');
      }
    };

    // Get current location weather
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchCurrentLocationWeather(latitude, longitude);
      },
      () => {
        setError('Failed to get your current location.');
      }
    );

    fetchWeatherData();
  }, []);

  // Fetch 5-day forecast for the selected city
  const fetchForecastData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      );
      const data = await response.json();
      const forecast = data.list.filter((_, index) => index % 8 === 0).map(day => ({
        date: new Date(day.dt * 1000).toLocaleDateString(),
        temp: day.main.temp,
        feels_like: day.main.feels_like,
        humidity: day.main.humidity,
        description: day.weather[0].description,
        wind_speed: day.wind.speed,
        clouds: day.clouds.all,
        icon: day.weather[0].icon,
      }));
      setForecastData(forecast);
    } catch (error) {
      setError('Failed to fetch 5-day forecast.');
    }
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    fetchForecastData(city);
  };

  return (
    <div className="weather-section">
      <h2>Weather Information</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error message={error} />
      ) : (
        <div className="weather-grid">
          {currentLocationWeather && (
            <div className="city-weather current-location">
              <div className="weather-main">
                <img
                  className="weather-icon"
                  src={`http://openweathermap.org/img/wn/${currentLocationWeather.icon}@4x.png`}
                  alt="Weather icon"
                />
                <div className="weather-info">
                  <h3>{currentLocationWeather.cityName}</h3>
                  <p className="temperature">{Math.round(currentLocationWeather.temp - 273.15)}°C</p>
                  <p>{currentLocationWeather.description}</p>
                </div>
              </div>
              <div className="weather-details">
                <p>Feels Like: {Math.round(currentLocationWeather.feels_like - 273.15)}°C</p>
                <p>Humidity: {currentLocationWeather.humidity}%</p>
                <p>Wind: {currentLocationWeather.wind_speed} m/s</p>
                <p>Clouds: {currentLocationWeather.clouds}%</p>
              </div>

              {/* Display 5-day forecast for current location */}
              {/* <div className="forecast-section">
                <h3>5-Day Forecast for {currentLocationWeather.cityName}</h3>
                <div className="forecast-grid">
                  {currentLocationForecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                      <div className="forecast-main">
                        <img
                          className="forecast-icon"
                          src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                          alt="Forecast icon"
                        />
                        <div className="forecast-info">
                          <p className="forecast-date">{day.date}</p>
                          <p className="forecast-temp">{Math.round(day.temp - 273.15)}°C</p>
                          <p>{day.description}</p>
                        </div>
                      </div>
                      <div className="forecast-details">
                        <p>Feels Like: {Math.round(day.feels_like - 273.15)}°C</p>
                        <p>Humidity: {day.humidity}%</p>
                        <p>Wind: {day.wind_speed} m/s</p>
                        <p>Clouds: {day.clouds}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          )}

          

          {weatherData.map((city, index) => (
            <div
              key={index}
              className="city-weather"
              onClick={() => handleCityClick(city.cityName)}
            >
              <div className="weather-main">
                <img
                  className="weather-icon"
                  src={`http://openweathermap.org/img/wn/${city.icon}@4x.png`}
                  alt="Weather icon"
                />
                <div className="weather-info">
                  <h3>{city.cityName}</h3>
                  <p className="temperature">{Math.round(city.temp - 273.15)}°C</p>
                  <p>{city.description}</p>
                </div>
              </div>
              <div className="weather-details">
                <p>Feels Like: {Math.round(city.feels_like - 273.15)}°C</p>
                <p>Humidity: {city.humidity}%</p>
                <p>Wind: {city.wind_speed} m/s</p>
                <p>Clouds: {city.clouds}%</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display 5-day forecast if a city is selected */}
      {selectedCity && (
        <div className="forecast-section">
          <h3>5-Day Forecast for {selectedCity}</h3>
          <div className="forecast-grid">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-main">
                  <img
                    className="forecast-icon"
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt="Forecast icon"
                  />
                  <div className="forecast-info">
                    <p className="forecast-date">{day.date}</p>
                    <p className="forecast-temp">{Math.round(day.temp - 273.15)}°C</p>
                    <p>{day.description}</p>
                  </div>
                </div>
                <div className="forecast-details">
                  <p>Feels Like: {Math.round(day.feels_like - 273.15)}°C</p>
                  <p>Humidity: {day.humidity}%</p>
                  <p>Wind: {day.wind_speed} m/s</p>
                  <p>Clouds: {day.clouds}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;

