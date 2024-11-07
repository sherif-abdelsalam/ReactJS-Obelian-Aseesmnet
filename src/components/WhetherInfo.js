import React from "react";

function WeatherInfo (props) {

  return(
    <div className="weather-grid">
      {props.weatherData.map((city,index) => 
      (
        /////////////////////////////////////////////////////////////
        <div 
          key={index}
          title= 'click to see the 5-day forecast'
          className="city-weather"
          onClick={() => {
            props.setSelectedCity(city.cityName);
            props.fetchForecastData(city.cityName);
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
            <p>Humidity: {city.humidity}%</p>
            <p>Wind: {city.wind_speed} m/s</p>
            <p>Clouds: {city.clouds}%</p>
          </div>

        </div>
        //////////////////////////////////////////////////////////////////////

      )
      )}
    </div>
  );
}

export default WeatherInfo;