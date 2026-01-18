// Fetch and display member data
const loadData = async () => {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error('Failed to fetch data.');
    const members = await response.json();
    displayMembers(members);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Display members on the page
const displayMembers = (members) => {
  const memberList = document.getElementById('member-list');
  memberList.innerHTML = ''; // Clear previous content
  members.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
    `;
    memberList.appendChild(card);
  });
};

// Toggle between grid and list views
document.getElementById('toggle-view').addEventListener('click', () => {
  const memberList = document.getElementById('member-list');
  const toggleButton = document.getElementById('toggle-view');

  // Toggle between grid and list views
  if (memberList.classList.contains('grid-view')) {
    memberList.classList.remove('grid-view');
    memberList.classList.add('list-view');
    toggleButton.textContent = 'Switch to Grid View';
  } else {
    memberList.classList.remove('list-view');
    memberList.classList.add('grid-view');
    toggleButton.textContent = 'Switch to List View';
  }
});

// Dynamic footer content
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Load data on page load
loadData();