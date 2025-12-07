// ========================================
// WEATHER APP - JAVASCRIPT BACKEND
// ========================================

// API Configuration
const API_KEY = 'e6b1f89d3930f16a4461a429f7433c7e';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const locationElement = document.querySelector('.country');
const dateElement = document.querySelector('.current-date');
const weatherImg = document.querySelector('.weather-summary-img');
const conditionText = document.querySelector('.condition-txt');
const tempText = document.querySelector('.temp-txt');
const humidityValue = document.querySelector('.humidity-value-txt');
const windValue = document.querySelector('.wind-value-txt');
const forecastContainer = document.querySelector('.forecast-items-container');

// Weather icon mapping
const weatherIcons = {
    'Clear': 'Assests/message/weatherimg.svg',
    'Clouds': 'Assests/message/heavysnow.svg',
    'Rain': 'Assests/message/heavysnow.svg',
    'Drizzle': 'Assests/message/heavysnow.svg',
    'Thunderstorm': 'Assests/message/heavysnow.svg',
    'Snow': 'Assests/message/heavysnow.svg',
    'Mist': 'Assests/message/heavysnow.svg',
    'Smoke': 'Assests/message/heavysnow.svg',
    'Haze': 'Assests/message/heavysnow.svg',
    'Dust': 'Assests/message/heavysnow.svg',
    'Fog': 'Assests/message/heavysnow.svg',
    'Sand': 'Assests/message/heavysnow.svg',
    'Ash': 'Assests/message/heavysnow.svg',
    'Squall': 'Assests/message/heavysnow.svg',
    'Tornado': 'Assests/message/heavysnow.svg'
};

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

// Get weather icon
function getWeatherIcon(condition) {
    return weatherIcons[condition] || 'Assests/message/weatherimg.svg';
}

// Show loading state
function showLoading() {
    tempText.textContent = 'Loading...';
    conditionText.textContent = '';
}

// Display error message
function displayError(message) {
    alert(message);
    console.error(message);
}

// Fetch current weather by city name
async function fetchWeatherByCity(city) {
    if (!city.trim()) {
        displayError('Please enter a city name');
        return;
    }

    showLoading();

    try {
        const url = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
        console.log('Fetching weather for:', city);

        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (response.status === 401) {
            throw new Error('⏰ API Key Not Activated Yet!\n\nYour API key needs up to 2 hours to activate.\nPlease wait and try again later.\n\nCheck status at: home.openweathermap.org/api_keys');
        }

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
            }
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(`Error: ${errorData.message || 'Unable to fetch weather data'}`);
        }

        const data = await response.json();
        console.log('✅ Weather data received:', data);
        updateCurrentWeather(data);
        fetchForecast(city);
    } catch (error) {
        displayError(error.message);
        console.error('Error fetching weather:', error);
        tempText.textContent = '--°C';
        conditionText.textContent = 'Waiting for API...';
    }
}

// Fetch weather by coordinates
async function fetchWeatherByCoords(lat, lon) {
    showLoading();

    try {
        const response = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (response.status === 401) {
            throw new Error('⏰ API Key Not Activated Yet! Please wait 1-2 hours and refresh.');
        }

        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }

        const data = await response.json();
        console.log('✅ Weather data (coords):', data);
        updateCurrentWeather(data);
        fetchForecastByCoords(lat, lon);
    } catch (error) {
        displayError(error.message);
        console.error('Error fetching weather:', error);
    }
}

// Fetch 5-day forecast by city
async function fetchForecast(city) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Unable to fetch forecast');
        }

        const data = await response.json();
        updateForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Fetch 5-day forecast by coordinates
async function fetchForecastByCoords(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Unable to fetch forecast');
        }

        const data = await response.json();
        updateForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Update current weather display
function updateCurrentWeather(data) {
    locationElement.textContent = `${data.name}, ${data.sys.country}`;
    dateElement.textContent = formatDate(data.dt);
    tempText.textContent = `${Math.round(data.main.temp)} °C`;
    conditionText.textContent = data.weather[0].main;
    weatherImg.src = getWeatherIcon(data.weather[0].main);
    humidityValue.textContent = `${data.main.humidity}%`;
    windValue.textContent = `${Math.round(data.wind.speed)} m/s`;
}

// Update forecast display
function updateForecast(data) {
    forecastContainer.innerHTML = '';
    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 7);

    dailyForecasts.forEach(forecast => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-txt">${formatDate(forecast.dt)}</h5>
            <img src="${getWeatherIcon(forecast.weather[0].main)}" class="forecast-item-img">
            <h5 class="forecast-item-temp regular-txt">${Math.round(forecast.main.temp)} °C</h5>
        `;

        forecastContainer.appendChild(forecastItem);
    });
}

// Get user's current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        console.log('Requesting geolocation...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log('Geolocation success:', latitude, longitude);
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.warn('Geolocation error:', error.message);
                console.log('Falling back to default city: Tokyo');
                fetchWeatherByCity('Tokyo');
            }
        );
    } else {
        console.log('Geolocation not supported by browser');
        fetchWeatherByCity('Tokyo');
    }
}

// Search button click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    fetchWeatherByCity(city);
});

// Enter key press on input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value;
        fetchWeatherByCity(city);
    }
});

// Load weather on page load
window.addEventListener('load', () => {
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        displayError('Please add your OpenWeatherMap API key in script.js');
        return;
    }

    console.log('🌤️ Weather app initialized');
    getCurrentLocation();
});
