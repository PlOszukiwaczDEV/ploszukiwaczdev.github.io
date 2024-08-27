document
  .getElementById("weather-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const city = document.getElementById("city-input").value;

    getCoordinates(city).then((coordinates) => {
      if (coordinates) {
        getWeatherData(coordinates.lat, coordinates.lon);
      } else {
        alert("City not found. Please try again.");
      }
    });
  });

// Theme switching logic
const themeSwitch = document.getElementById("theme-switch");
const body = document.body;
const container = document.querySelector(".container");
const input = document.getElementById("city-input");
const button = document.querySelector("button");

themeSwitch.addEventListener("change", function () {
  if (themeSwitch.checked) {
    body.classList.add("dark");
    container.classList.add("dark");
    input.classList.add("dark");
    button.classList.add("dark");
  } else {
    body.classList.remove("dark");
    container.classList.remove("dark");
    input.classList.remove("dark");
    button.classList.remove("dark");
  }
});

async function getCoordinates(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}`,
  );
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const { latitude, longitude } = data.results[0];
    return { lat: latitude, lon: longitude };
  } else {
    return null;
  }
}

async function getWeatherData(lat, lon) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
  );
  const data = await response.json();

  const temperature = data.current_weather.temperature;
  const condition = data.current_weather.weathercode;

  document.getElementById("temperature").textContent = temperature;
  document.getElementById("condition").textContent =
    getWeatherCondition(condition);

  document.getElementById("weather-result").style.display = "block";
}

function getWeatherCondition(weatherCode) {
  const conditions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    95: "Thunderstorm",
    99: "Severe Thunderstorm",
  };

  return conditions[weatherCode] || "Unknown";
}
