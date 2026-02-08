// scripts/discover.js
import { items } from '../data/items.mjs';

// Display visitor message based on localStorage
function displayVisitorMessage() {
  const messageElement = document.getElementById('message');
  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();

  if (!lastVisit) {
    // First visit
    messageElement.textContent = 'Welcome! Let us know if you have any questions.';
  } else {
    const lastVisitTime = parseInt(lastVisit);
    const daysSinceVisit = Math.floor((now - lastVisitTime) / (1000 * 60 * 60 * 24));

    if (daysSinceVisit === 0) {
      // Less than a day
      messageElement.textContent = 'Back so soon! Awesome!';
    } else {
      // More than a day
      const dayText = daysSinceVisit === 1 ? 'day' : 'days';
      messageElement.textContent = `You last visited ${daysSinceVisit} ${dayText} ago.`;
    }
  }

  // Store the current visit date
  localStorage.setItem('lastVisit', now.toString());
}

// Close button functionality
function setupCloseButton() {
  const closeBtn = document.getElementById('close-message');
  const visitMessage = document.getElementById('visitor-message');

  closeBtn.addEventListener('click', () => {
    visitMessage.style.display = 'none';
  });
}

// Display cards for items
function displayCards() {
  const gridContainer = document.querySelector('.grid-container');
  const fragment = document.createDocumentFragment();
  
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `<h2>${item.name}</h2><figure><img src="images/${item.image}" alt="${item.name}" width="300" height="200" loading="lazy"></figure><address>${item.address}</address><p>${item.description}</p><a href="${item.website}" target="_blank" rel="noopener noreferrer" class="learn-more-btn" title="Visit ${item.name} website">Learn More about ${item.name}</a>`;
    fragment.appendChild(card);
  });
  
  gridContainer.appendChild(fragment);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  displayVisitorMessage();
  setupCloseButton();
  displayCards();
});