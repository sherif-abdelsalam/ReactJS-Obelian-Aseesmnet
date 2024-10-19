import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Error from './Error';
import './Weather.css';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocationWeather, setCurrentLocationWeather] = useState(null);

  const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'];

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = 'f88b889cf5c304ef8f9a8a87d01a0dc6';

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
          icon: weather.weather[0].icon // Weather icon
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
        const apiKey = 'f88b889cf5c304ef8f9a8a87d01a0dc6';
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
          icon: data.weather[0].icon
        };

        setCurrentLocationWeather(currentLocationWeatherData);
      } catch (error) {
        setError('Failed to fetch current location weather data.');
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
            </div>
          )}
          {weatherData.map((city, index) => (
            <div key={index} className="city-weather">
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
    </div>
  );
};

export default Weather;
