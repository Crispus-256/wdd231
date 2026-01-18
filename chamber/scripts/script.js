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
  memberList.innerHTML = '';
  members.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name}">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}">Visit Website</a>
    `;
    memberList.appendChild(card);
  });
};

// Toggle between grid and list views
document.getElementById('toggle-view').addEventListener('click', () => {
  const memberList = document.getElementById('member-list');
  memberList.classList.toggle('list-view');
});

// Dynamic footer content
document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('last-modified').textContent = document.lastModified;

// Load data on page load
loadData();