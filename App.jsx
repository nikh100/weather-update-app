import { useState } from 'react';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'ec5a5af0ac29480e8be90243252401';

  const getWeatherData = async () => {
    if (!location.trim()) return;

    setLoading(true);
    setError(false);
    
    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=yes`
      );
      
      if (!response.ok) throw new Error('Location not found');
      
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      setError(true);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getAQIInfo = (aqi) => {
    switch(aqi) {
      case 1: return { color: '#00e400', status: 'Good' };
      case 2: return { color: '#ffff00', status: 'Moderate' };
      case 3: return { color: '#ff7e00', status: 'Unhealthy for Sensitive Groups' };
      case 4: return { color: '#ff0000', status: 'Unhealthy' };
      case 5: return { color: '#8f3f97', status: 'Very Unhealthy' };
      case 6: return { color: '#7e0023', status: 'Hazardous' };
      default: return { color: '#ccc', status: 'Unknown' };
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="search-box">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getWeatherData()}
            placeholder="Enter location..."
          />
          <button onClick={getWeatherData}>
            <i className="fas fa-search"></i>
          </button>
        </div>

        {loading && <div className="loading">Loading...</div>}

        {error && (
          <div className="error-message">
            Location not found. Please try again.
          </div>
        )}

        {weatherData && !error && (
          <div className="weather-info">
            <div className="location">
              <h2>{weatherData.location.name}</h2>
              <p>{`${weatherData.location.region}, ${weatherData.location.country}`}</p>
            </div>

            <div className="weather-main">
              <img
                src={`https:${weatherData.current.condition.icon}`}
                alt="Weather Icon"
              />
              <div className="temperature">
                <h1>{`${Math.round(weatherData.current.temp_c)}°C`}</h1>
                <p>{weatherData.current.condition.text}</p>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail">
                <i className="fas fa-temperature-high"></i>
                <div>
                  <p>Feels Like</p>
                  <p>{`${Math.round(weatherData.current.feelslike_c)}°C`}</p>
                </div>
              </div>
              <div className="detail">
                <i className="fas fa-tint"></i>
                <div>
                  <p>Humidity</p>
                  <p>{`${weatherData.current.humidity}%`}</p>
                </div>
              </div>
              <div className="detail">
                <i className="fas fa-wind"></i>
                <div>
                  <p>Wind Speed</p>
                  <p>{`${weatherData.current.wind_kph} km/h`}</p>
                </div>
              </div>
            </div>

            <div className="air-quality">
              <h3>Air Quality</h3>
              <div className="aqi-meter">
                <div
                  className="aqi-level"
                  style={{
                    width: `${(weatherData.current.air_quality['us-epa-index'] / 6) * 100}%`,
                    backgroundColor: getAQIInfo(weatherData.current.air_quality['us-epa-index']).color
                  }}
                ></div>
              </div>
              <p>{`Air Quality: ${getAQIInfo(weatherData.current.air_quality['us-epa-index']).status}`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;