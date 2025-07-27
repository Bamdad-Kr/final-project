document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-weather-btn');
    const weatherResultsDiv = document.getElementById('weather-results');
    const errorMessageDiv = document.getElementById('weather-error-message');
    
    // Using OpenWeatherMap API which is more reliable for browser usage
    const API_KEY = '5f472b7acba333cd8a035ea85a0d6d4c'; // OpenWeatherMap API key

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

        // Show loading state
        searchButton.textContent = 'Loading...';
        searchButton.disabled = true;
        weatherResultsDiv.innerHTML = '';
        errorMessageDiv.style.display = 'none';

        try {
            // Use OpenWeatherMap API which is more reliable for browser usage
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            }

            const data = await response.json();

            if (data.cod && data.cod !== 200) {
                errorMessageDiv.textContent = `Error: ${data.message || 'Unable to fetch weather data for this city.'}`;
                errorMessageDiv.style.display = 'block';
                return;
            }

            const weatherIcon = data.weather && data.weather.length > 0 ? 
                `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png` : '';

            weatherResultsDiv.innerHTML = `
                <div class="weather-card">
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <p>Latitude: ${data.coord.lat}</p>
                    <p>Longitude: ${data.coord.lon}</p>
                    ${weatherIcon ? `<img src="${weatherIcon}" alt="Weather Icon" class="weather-icon">` : ''}
                    <p>${data.weather && data.weather.length > 0 ? data.weather[0].description : 'No description'}</p>
                    <p class="temperature">${Math.round(data.main.temp)}°C</p>
                    <p>Feels like: ${Math.round(data.main.feels_like)}°C</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind: ${Math.round(data.wind.speed * 3.6)} km/h</p>
                    <p>Pressure: ${data.main.pressure} hPa</p>
                    <p>Visibility: ${data.visibility / 1000} km</p>
                </div>
            `;

        } catch (error) {
            console.error('Error fetching weather data:', error);
            
            // More specific error messages based on the error type
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                errorMessageDiv.textContent = 'Network error. Please check your internet connection and try again.';
            } else if (error.message.includes('CORS')) {
                errorMessageDiv.textContent = 'CORS error. The weather service is not accessible from this location.';
            } else {
                errorMessageDiv.textContent = error.message || 'Error fetching weather data. Please try again later.';
            }
            errorMessageDiv.style.display = 'block';
        } finally {
            // Reset button state
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }
});