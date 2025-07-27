document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('city-input');
    const searchButton = document.getElementById('search-weather-btn');
    const weatherResultsDiv = document.getElementById('weather-results');
    const errorMessageDiv = document.getElementById('weather-error-message');

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
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock weather data for demonstration
            const mockWeatherData = {
                name: city,
                country: 'IR',
                coord: { lat: 35.6892, lon: 51.3890 },
                weather: [{ description: 'Partly cloudy', icon: '02d' }],
                main: {
                    temp: Math.floor(Math.random() * 30) + 10,
                    feels_like: Math.floor(Math.random() * 30) + 10,
                    humidity: Math.floor(Math.random() * 50) + 30,
                    pressure: Math.floor(Math.random() * 200) + 1000
                },
                wind: {
                    speed: Math.floor(Math.random() * 20) + 5
                },
                visibility: Math.floor(Math.random() * 10) + 5
            };

            const weatherIcon = `https://openweathermap.org/img/wn/${mockWeatherData.weather[0].icon}@2x.png`;

            weatherResultsDiv.innerHTML = `
                <div class="weather-card">
                    <h2>${mockWeatherData.name}, ${mockWeatherData.country}</h2>
                    <p>Latitude: ${mockWeatherData.coord.lat}</p>
                    <p>Longitude: ${mockWeatherData.coord.lon}</p>
                    <img src="${weatherIcon}" alt="Weather Icon" class="weather-icon">
                    <p>${mockWeatherData.weather[0].description}</p>
                    <p class="temperature">${mockWeatherData.main.temp}°C</p>
                    <p>Feels like: ${mockWeatherData.main.feels_like}°C</p>
                    <p>Humidity: ${mockWeatherData.main.humidity}%</p>
                    <p>Wind: ${Math.round(mockWeatherData.wind.speed * 3.6)} km/h</p>
                    <p>Pressure: ${mockWeatherData.main.pressure} hPa</p>
                    <p>Visibility: ${mockWeatherData.visibility} km</p>
                    <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
                        <i>Note: This is demo data. For real weather data, please configure a valid API key.</i>
                    </p>
                </div>
            `;

        } catch (error) {
            console.error('Error fetching weather data:', error);
            errorMessageDiv.textContent = 'Error fetching weather data. Please try again later.';
            errorMessageDiv.style.display = 'block';
        } finally {
            // Reset button state
            searchButton.textContent = 'Search';
            searchButton.disabled = false;
        }
    }
});