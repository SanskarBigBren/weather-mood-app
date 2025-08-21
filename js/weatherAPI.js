const API_KEY = "819a708a8033e3bec96332dd1df938e1";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Fetch current weather data
export async function fetchCurrentWeather(city) {
  const url = `${BASE_URL}weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("City not found or API limit reached.");
  }

  const data = await res.json();
  return data;
}

//Fetch 4-day forecast data
export async function fetchForecast(city) {
  const url = `${BASE_URL}forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Forecast data not available.");
  }

  const data = await res.json();
  return data;
}
