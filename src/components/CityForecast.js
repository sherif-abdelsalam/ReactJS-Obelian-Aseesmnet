import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CityForecast = () => {
  const { cityName } = useParams();
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState(null);
  const apiKey = 'f88b889cf5c304ef8f9a8a87d01a0dc6';

  useEffect(() => {
    const fetchCityForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
        );
        const data = await response.json();
        const forecast = data.list.filter((_, index) => index % 8 === 0).map(day => ({
          date: new Date(day.dt * 1000).toLocaleDateString(),
          temp: day.main.temp,
          description: day.weather[0].description,
          icon: day.weather[0].icon,
        }));
        setForecastData(forecast);
      } catch (error) {
        setError('Failed to fetch forecast.');
      }
    };

    fetchCityForecast();
  }, [cityName]);

  return (
    <div className="forecast-section">
      <h2>5-Day Forecast for {cityName}</h2>
      {error ? <p>{error}</p> : (
        <div className="forecast-grid">
          {forecastData.map((day, index) => (
            <div key={index} className="forecast-item">
              <img src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="Forecast icon" />
              <p>{day.date}</p>
              <p>{Math.round(day.temp - 273.15)}°C</p>
              <p>{day.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityForecast;
