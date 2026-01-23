// Fetch Weather Data
const apiKey = '9ea2ae59dba22298471def15f7ed1103';
const city = 'Nairobi';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

async function getWeather() {
  try {
    const response = await fetch(weatherUrl);
    if (response.ok) {
      const data = await response.json();
      // Display current temperature and weather description
      document.getElementById('current-temp').textContent = `Current Temp: ${data.main.temp}°C`;
      document.getElementById('weather-desc').textContent = `Condition: ${data.weather[0].description}`;
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    document.getElementById('current-temp').textContent = 'Weather data unavailable.';
    document.getElementById('weather-desc').textContent = 'Please try again later.';
  }
}

async function getForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (response.ok) {
      const data = await response.json();
      const forecastContainer = document.getElementById('forecast');
      // Display a 3-day forecast
      data.list.slice(0, 3).forEach((item, index) => {
        forecastContainer.innerHTML += `<p>Day ${index + 1}: ${item.main.temp}°C</p>`;
      });
    } else {
      throw new Error(await response.text());
    }
  } catch (error) {
    console.error('Error fetching forecast:', error);
    document.getElementById('forecast').innerHTML = '<p>Forecast data unavailable.</p>';
  }
}

// Fetch Business Spotlights
const membersUrl = 'data/home_members.json';

async function loadSpotlights() {
  try {
    const response = await fetch(membersUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch members data.');
    }
    const members = await response.json();

    // Filter for Gold/Silver members
    const eligibleMembers = members.filter(member => member.membership === 'Gold' || member.membership === 'Silver');

    // Shuffle the eligible members array
    const shuffledMembers = shuffleArray(eligibleMembers);

    // Randomly select 2–3 members
    const spotlights = shuffledMembers.slice(0, Math.floor(Math.random() * 2) + 2); // Randomly picks 2 or 3 members

    // Render spotlights
    const container = document.getElementById('spotlight-cards');
    if (spotlights.length === 0) {
      container.innerHTML = '<p>No featured members available.</p>';
      return;
    }

    spotlights.forEach(member => {
      const card = `
        <div class="card">
          <img src="${member.logo}" alt="${member.name}">
          <h3>${member.name}</h3>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>Address:</strong> ${member.address}</p>
          <p><strong>Website:</strong> <a href="${member.website}" target="_blank">${member.website}</a></p>
          <p><strong>Membership:</strong> ${member.membership}</p>
        </div>
      `;
      container.innerHTML += card;
    });
  } catch (error) {
    console.error('Error loading spotlights:', error);
    document.getElementById('spotlight-cards').innerHTML = '<p>Spotlight data unavailable.</p>';
  }
}

// Helper function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Initialize Functions
getWeather();
getForecast();
loadSpotlights();