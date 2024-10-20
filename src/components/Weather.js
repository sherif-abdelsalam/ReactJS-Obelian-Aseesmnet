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
  const [view, setView] = useState('weather'); // 'weather' or 'forecast'
  const [cities, setCities] = useState(['Cairo','London', 'New York', 'Paris', 'Tokyo']); // Use state to manage cities dynamically
  const apiKey = 'f88b889cf5c304ef8f9a8a87d01a0dc6';

  // Fetch current location weather
  useEffect(() => {
    const fetchCurrentLocationWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const data = await response.json();
        const currentWeather = {
          cityName: data.name,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          wind_speed: data.wind.speed,
          clouds: data.clouds.all,
          icon: data.weather[0].icon,
        };
        setCurrentLocationWeather(currentWeather);
        console.log(cities);
        // Add current location city to the cities array if not already included
        setCities((prevCities) => {
          if (!prevCities.includes(currentWeather.cityName)) {
            return [currentWeather.cityName, ...prevCities];
          }
          return prevCities;
        });
      } catch (error) {
        setError('Failed to fetch current location weather.');
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCurrentLocationWeather(latitude, longitude);
        },
        () => {
          setError('Location access denied.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, [apiKey]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const requests = cities.map((city) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
          )
        );

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map((res) => res.json()));

        const cityWeatherData = data.map((weather) => ({
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

    fetchWeatherData();
  }, [cities, apiKey]);

  // Fetch 5-day forecast for the selected city
  const fetchForecastData = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
      );
      const data = await response.json();
      const forecast = data.list
        .filter((_, index) => index % 8 === 0)
        .map((day) => ({
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
      setView('forecast'); // Switch to forecast view
    } catch (error) {
      setError('Failed to fetch 5-day forecast.');
    }
  };

  // Handle return to the main weather view
  const handleReturn = () => {
    setView('weather');
    setSelectedCity(null); // Clear selected city
  };

  return (
    <div className="weather-section">
      <h2>Weather Information</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error message={error} />
      ) : (
        <>
          {view === 'weather' ? (
            <div className="weather-grid">

              {weatherData.map((city, index) => (
                <div
                  key={index}
                  className="city-weather"
                  onClick={() => {
                    setSelectedCity(city.cityName);
                    fetchForecastData(city.cityName);
                  }}
                >
                  <div className="weather-main">
                    <img
                      className="weather-icon"
                      src={`http://openweathermap.org/img/wn/${city.icon}@4x.png`}
                      alt="Weather icon"
                    />
                    <div className="weather-info">
                      <h3>{city.cityName}</h3>
                      <p className="temperature">
                        {Math.round(city.temp - 273.15)}°C
                      </p>
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
          ) : (
            <div className="forecast-section">
              <h3>5-Day Forecast for {selectedCity}</h3>
              <button onClick={handleReturn}>Return to Weather Info</button>
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
                        <p className="forecast-temp">
                          {Math.round(day.temp - 273.15)}°C
                        </p>
                        <p>{day.description}</p>
                      </div>
                    </div>
                    <div className="  details">
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
        </>
      )}
    </div>
  );
};

export default Weather;
