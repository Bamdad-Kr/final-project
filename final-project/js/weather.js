document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-weather-btn');
    const weatherResultsDiv = document.getElementById('weather-results');
    const errorMessageDiv = document.getElementById('weather-error-message');
    const API_KEY = 'e1f41b6412e097a2ea045a0e9636d853';

    searchButton.addEventListener('click', fetchWeatherData);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchWeatherData();
        }
    });

    async function fetchWeatherData() {
        const city = cityInput.value.trim();

        if (!city) {
            errorMessageDiv.textContent = 'Please enter a city name.';
            errorMessageDiv.style.display = 'block';
            weatherResultsDiv.innerHTML = ''; 
            return;
        }

        weatherResultsDiv.innerHTML = '';
        errorMessageDiv.style.display = 'none';

        try {
            const response = await fetch(`http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                errorMessageDiv.textContent = `Error: ${data.error.info}`;
                errorMessageDiv.style.display = 'block';
                return;
            }

            const location = data.location;
            const current = data.current;

            weatherResultsDiv.innerHTML = `
                <div class="weather-card">
                    <h2>${location.name}, ${location.country}</h2>
                    <p>Latitude: ${location.lat}</p>
                    <p>Longitude: ${location.lon}</p>
                    ${current.weather_icons && current.weather_icons.length > 0 ?
                        `<img src="${current.weather_icons[0]}" alt="Weather Icon" class="weather-icon">` : ''}
                    <p>${current.weather_descriptions ? current.weather_descriptions.join(', ') : 'No description'}</p>
                    <p class="temperature">${current.temperature}°C</p>
                    <p>Feels like: ${current.feelslike}°C</p>
                    <p>Humidity: ${current.humidity}%</p>
                </div>
            `;

        } catch (error) {
            console.error('Error fetching weather data:', error);
            errorMessageDiv.textContent = 'Error fetching weather data. Please check your internet connection or try again later.';
            errorMessageDiv.style.display = 'block';
        }
    }
});