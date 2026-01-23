// Select HTML elements
const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// Define the API URL
const apiKey = '9ea2ae59dba22298471def15f7ed1103';
const lat = '49.75';
const lon = '6.64';
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

// Fetch data from the API
async function apiFetch() {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data); // For debugging purposes
      displayResults(data); // Call the function to update the DOM
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Display results in the DOM
function displayResults(data) {
  // Update temperature
  currentTemp.innerHTML = `${data.main.temp}&deg;F`;

  // Update weather icon
  const iconCode = data.weather[0].icon;
  const iconSrc = `https://openweathermap.org/img/w/${iconCode}.png`;
  weatherIcon.setAttribute('src', iconSrc);
  weatherIcon.setAttribute('alt', data.weather[0].description);

  // Update description
  captionDesc.textContent = data.weather[0].description.toUpperCase();
}

// Call the API fetch function
apiFetch();