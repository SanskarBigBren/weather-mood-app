import { fetchCurrentWeather, fetchForecast } from './weatherAPI.js';
import { moodData, quoteData } from './content.js';

// DOM Elements
const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.querySelector('.weather-container');
const welcomeMessage = document.getElementById('welcome-message');

// Main Weather Elements
const cityNameEl = document.getElementById('city-name');
const weatherTypeEl = document.getElementById('weather-type');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const moodImage = document.getElementById('weather-image');
const moodCaption = document.getElementById('weather-caption');
const backgroundImg = document.querySelector('#background img');

// Extra Sections
const quoteText = document.getElementById('quote');
const recipeText = document.getElementById('recipe');
const audioEl = document.getElementById('audio');
const audioSource = audioEl.querySelector('source');
const forecastContainer = document.getElementById('forecast-cards');

// Form Submit: Fetch weather + forecast
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  try {
    const weatherData = await fetchCurrentWeather(city);
    const forecastData = await fetchForecast(city);

    updateUI(weatherData, forecastData);
  } catch (err) {
    alert(err.message);
  }
});

// Random song from weather folder
function playRandomSong(weatherMain) {
  const songFolder = `assets/mood-songs/${weatherMain}/`;
  const totalSongs = 10;
  const songNumber = Math.floor(Math.random() * totalSongs) + 1;
  const songPath = `${songFolder}${weatherMain.toLowerCase()}${songNumber}.mp3`;

  audioSource.src = songPath;
  audioEl.load();

  // Handle song load error
  audioEl.onerror = () => {
    audioSource.src = 'assets/mood-songs/default.mp3';
    audioEl.load();
  };
}

// Update All UI Based on Weather
async function updateUI(weather, forecast) {
  const weatherMain = weather.weather[0].main;
  const mood = moodData[weatherMain] || moodData['Clear'];

  // Hide welcome and show result
  welcomeMessage.style.display = 'none';
  weatherContainer.style.display = 'flex';

  // Set content
  cityNameEl.textContent = weather.name;
  weatherTypeEl.textContent = weatherMain;
  temperatureEl.textContent = `Temperature: ${Math.round(weather.main.temp)}°C`;
  descriptionEl.textContent = `Description: ${weather.weather[0].description}`;
  moodCaption.textContent = weatherMain;

  // Images and background (with error fallback)
  moodImage.onerror = () => moodImage.src = 'assets/mood-images/default.png';
  backgroundImg.onerror = () => backgroundImg.src = 'assets/backgrounds/default_bg.jpg';
  moodImage.src = mood.image;
  backgroundImg.src = mood.background;

    // Play first random song
    playRandomSong(weatherMain);

    // Re-randomize song when previous one ends
    audioEl.onended = () => {
      playRandomSong(weatherMain);
    };

  // Random recipe
  const recipe = mood.recipes[Math.floor(Math.random() * mood.recipes.length)];
  recipeText.textContent = recipe;

  // Random manual quote
  const quotes = quoteData[weatherMain] || quoteData['Clear'];
  quoteText.textContent = quotes[Math.floor(Math.random() * quotes.length)];

  renderForecast(forecast);
}

// Render Forecast Cards
function renderForecast(data) {
  forecastContainer.innerHTML = '';
  const forecastList = data.list.filter((_, i) => i % 8 === 0).slice(1, 5);

  forecastList.forEach(day => {
    const icon = day.weather[0].icon;
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const temp = Math.round(day.main.temp);

    const card = document.createElement('div');
    card.classList.add('forecast-day');
    card.innerHTML = `
      <p>${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].main}" />
      <p>${temp}°C</p>
    `;

    forecastContainer.appendChild(card);
  });
}
