import React from "react";

export const CityForcast = (props) => {
  return(
    <div className="forecast-section">
    <h3>5-Day Forecast for {props.selectedCity}</h3>
    <button onClick={() => props.setView('weather')}> Return to Weather Info</button>
    <div className="forecast-grid">
      {props.forecastData.map((day, index) => (
        <div key={index} className="forecast-item">
          <div className="forecast-main">
            <img
              key={index}
              className="forecast-icon"
              src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt="Forecast icon"
            />
            <div className="forecast-info">

              <p className="forecast-date">{
                new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })
              }
              </p>

                <p className="forecast-date">{day.date}</p>
                <p className="forecast-temp"> {Math.round(day.temp - 273.15)}°C </p>
                <p>{day.description}</p>

            </div>
          </div>
          <div className="forecast-details">
            <p>Humidity: {day.humidity}%</p>
            <p>Wind: {day.wind_speed} m/s</p>
            <p>Clouds: {day.clouds}%</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}