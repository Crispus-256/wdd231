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
document.getElementById('wdd-courses').addEventListener('click', () => displayCourses(courses.filter(course => course.name.startsWith('WDD'))));
document.getElementById('cse-courses').addEventListener('click', () => displayCourses(courses.filter(course => course.name.startsWith('CSE'))));

// Initial Display
displayCourses(courses);