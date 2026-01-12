// Course Data
const courses = [
  { name: "CSE110", credits: 2, completed: true },
  { name: "WDD130", credits: 2, completed: true },
  { name: "CSE111", credits: 2, completed: true },
  { name: "WDD131", credits: 2, completed: true },
  { name: "CSE210", credits: 2, completed: true },
  { name: "WDD231", credits: 2, completed: false },
];

// Display Courses
function displayCourses(filteredCourses) {
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';

  filteredCourses.forEach(course => {
    const courseDiv = document.createElement('div');
    courseDiv.textContent = `${course.name} (${course.credits} credits)`;
    if (course.completed) {
      courseDiv.style.fontWeight = 'bold';
      courseDiv.style.color = 'green';
    }
    courseList.appendChild(courseDiv);
  });

  // Update Total Credits
  const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
  document.getElementById('total-credits').textContent = totalCredits;
}

// Filter Buttons
document.getElementById('all-courses').addEventListener('click', () => displayCourses(courses));

// Add event listeners for WDD courses
document.querySelectorAll('.wdd-course').forEach(button => {
  button.addEventListener('click', () => {
    const courseName = button.dataset.course;
    const filteredCourses = courses.filter(course => course.name === courseName);
    displayCourses(filteredCourses);
  });
});

// Add event listeners for CSE courses
document.querySelectorAll('.cse-course').forEach(button => {
  button.addEventListener('click', () => {
    const courseName = button.dataset.course;
    const filteredCourses = courses.filter(course => course.name === courseName);
    displayCourses(filteredCourses);
  });
});

// Initial Display
displayCourses(courses);