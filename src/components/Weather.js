import React, { useState, useEffect } from 'react';
import Loader from './Loader';
import Error from './Error';

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Coordinates for some common cities
  const cities = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
  ];

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const apiKey = '8dad3db309e50de33c8cdefbe69cec74';

        const requests = cities.map(city => 
          fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`)
        );

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map(res => res.json()));

        const cityWeatherData = data.map((weather, index) => ({
          cityName: cities[index].name,
          timezone: weather.timezone,
          temp: weather.current.temp,
          feels_like: weather.current.feels_like,
          humidity: weather.current.humidity,
          description: weather.current.weather[0].description,
          wind_speed: weather.current.wind_speed,
          clouds: weather.current.clouds
        }));

        setWeatherData(cityWeatherData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch weather data.');
        setLoading(false);
      }
    };

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
        weatherData.map((city, index) => (
          <div key={index} className="city-weather">
            <h3>Current Weather in {city.cityName}</h3>
            <p>Temperature: {city.temp}°C</p>
            <p>Feels Like: {city.feels_like}°C</p>
            <p>Humidity: {city.humidity}%</p>
            <p>Weather Condition: {city.description}</p>
            <p>Wind Speed: {city.wind_speed} m/s</p>
            <p>Clouds: {city.clouds}%</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Weather;
