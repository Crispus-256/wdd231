// Course Data
const courses = [
  { name: "CSE110", credits: 2, completed: true },
  { name: "WDD130", credits: 2, completed: true },
  { name: "CSE111", credits: 2, completed: true },
  { name: "WDD131", credits: 2, completed: true },
  { name: "CSE210", credits: 2, completed: true },
  { name: "WDD231", credits: 2, completed: false },
];

// Cache DOM elements and validate
const courseListEl = document.getElementById('course-list');
const totalCreditsEl = document.getElementById('total-credits');
const buttonsContainer = document.querySelector('.course-buttons');
const detailsDialog = document.getElementById('course-details');

if (!courseListEl || !totalCreditsEl || !buttonsContainer || !detailsDialog) {
  console.error('Course UI elements not found. Scripts may be running before DOM is ready.');
}

// Utility to split a course code into subject and number (e.g., 'WDD231' -> ['WDD', '231'])
function splitCourseCode(code) {
  const match = /^([A-Za-z]+)(\d+)$/.exec(code);
  return match ? [match[1], match[2]] : [code, ''];
}

// Render a single course card
function makeCourseCard(course) {
  const div = document.createElement('div');
  div.className = 'course-card';
  div.setAttribute('data-course', course.name);

  const [subject, number] = splitCourseCode(course.name);
  div.innerHTML = `
    <h3>${subject} ${number}</h3>
    <p>${course.name} &middot; ${course.credits} credits</p>
  `;

  if (course.completed) {
    div.style.fontWeight = 'bold';
    div.style.color = 'green';
  }

  // click shows details for this course
  div.addEventListener('click', () => displayCourseDetails(course));
  return div;
}

// Display a list of courses and update total credits
function displayCourses(filteredCourses) {
  if (!courseListEl || !totalCreditsEl) return;

  courseListEl.innerHTML = '';
  filteredCourses.forEach(course => courseListEl.appendChild(makeCourseCard(course)));

  const totalCredits = filteredCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  totalCreditsEl.textContent = totalCredits;
}

// Event delegation for filter buttons
if (buttonsContainer) {
  buttonsContainer.addEventListener('click', (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;

    if (btn.id === 'all-courses') {
      displayCourses(courses);
      return;
    }

    const code = btn.dataset.course;
    if (code) {
      displayCourses(courses.filter(c => c.name === code));
    }
  });
}

// Modal: close when clicking backdrop (added once)
if (detailsDialog) {
  detailsDialog.addEventListener('click', (event) => {
    if (event.target === detailsDialog) detailsDialog.close();
  });
}

// Show course details safely
function displayCourseDetails(course) {
  if (!detailsDialog) return;

  const [subject, number] = splitCourseCode(course.name);
  detailsDialog.innerHTML = `
    <button id="closeModal" aria-label="Close">❌</button>
    <h2>${subject} ${number}</h2>
    <h3>${course.name}</h3>
    <p><strong>Credits:</strong> ${course.credits}</p>
    <p><strong>Status:</strong> ${course.completed ? 'Completed' : 'In progress'}</p>
  `;

  const closeBtn = detailsDialog.querySelector('#closeModal');
  if (closeBtn) closeBtn.addEventListener('click', () => detailsDialog.close(), { once: true });

  detailsDialog.showModal();
}

// Initial display
displayCourses(courses);
