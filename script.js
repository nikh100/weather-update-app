const API_KEY = 'ec5a5af0ac29480e8be90243252401';
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const searchBtn = document.getElementById('search-btn');
const locationInput = document.getElementById('location-input');

// Create weather effects
function createWeatherEffects() {
    // Create rain drops
    const rain = document.querySelector('.rain');
    for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        rain.appendChild(drop);
    }

    // Create snowflakes
    const snow = document.querySelector('.snow');
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        snowflake.style.animationDelay = `${Math.random() * 2}s`;
        snow.appendChild(snowflake);
    }

    // Create clouds
    const clouds = document.querySelector('.clouds');
    for (let i = 0; i < 3; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.top = `${Math.random() * 40 + 10}%`;
        cloud.style.width = `${Math.random() * 100 + 100}px`;
        cloud.style.height = `${Math.random() * 30 + 20}px`;
        cloud.style.animationDuration = `${Math.random() * 10 + 10}s`;
        cloud.style.animationDelay = `${Math.random() * 5}s`;
        clouds.appendChild(cloud);
    }
}

function setWeatherBackground(condition) {
    document.body.className = ''; // Reset classes
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
        document.body.classList.add('rainy');
    } else if (lowerCondition.includes('snow')) {
        document.body.classList.add('snow');
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
        document.body.classList.add('cloudy');
    } else if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
        document.body.classList.add('sunny');
    } else {
        document.body.classList.add('clear');
    }
}

async function getWeatherData(location) {
    try {
        // Changed to HTTPS for Netlify deployment
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=yes`);
        if (!response.ok) throw new Error('Location not found');
        
        const data = await response.json();
        updateUI(data);
        
        weatherInfo.classList.remove('hidden');
        weatherInfo.classList.add('visible');
        errorMessage.classList.add('hidden');

        // Set weather background based on condition
        setWeatherBackground(data.current.condition.text);
    } catch (error) {
        weatherInfo.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

function updateUI(data) {
    // Update location
    document.getElementById('city').textContent = data.location.name;
    document.getElementById('country').textContent = `${data.location.region}, ${data.location.country}`;

    // Update main weather
    document.getElementById('weather-icon').src = `https:${data.current.condition.icon}`;
    document.getElementById('temp').textContent = `${Math.round(data.current.temp_c)}°C`;
    document.getElementById('condition').textContent = data.current.condition.text;

    // Update details
    document.getElementById('feels-like').textContent = `${Math.round(data.current.feelslike_c)}°C`;
    document.getElementById('humidity').textContent = `${data.current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.current.wind_kph} km/h`;

    // Update AQI
    const aqi = data.current.air_quality['us-epa-index'];
    const aqiLevel = document.getElementById('aqi-level');
    const aqiText = document.getElementById('aqi-text');
    
    // Set AQI meter width and color
    aqiLevel.style.width = `${(aqi / 6) * 100}%`;
    
    // Set AQI color and text based on level
    let aqiColor, aqiStatus;
    switch(aqi) {
        case 1:
            aqiColor = '#00e400';
            aqiStatus = 'Good';
            break;
        case 2:
            aqiColor = '#ffff00';
            aqiStatus = 'Moderate';
            break;
        case 3:
            aqiColor = '#ff7e00';
            aqiStatus = 'Unhealthy for Sensitive Groups';
            break;
        case 4:
            aqiColor = '#ff0000';
            aqiStatus = 'Unhealthy';
            break;
        case 5:
            aqiColor = '#8f3f97';
            aqiStatus = 'Very Unhealthy';
            break;
        case 6:
            aqiColor = '#7e0023';
            aqiStatus = 'Hazardous';
            break;
    }
    
    aqiLevel.style.backgroundColor = aqiColor;
    aqiText.textContent = `Air Quality: ${aqiStatus}`;
}

searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeatherData(location);
    }
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            getWeatherData(location);
        }
    }
});

// Create weather effects on load
createWeatherEffects();

// Initial weather data for default location
getWeatherData('India');