// Course Data
const courses = [
  { name: "WDD131", credits: 3, completed: true },
  { name: "CSE121", credits: 4, completed: false },
  { name: "WDD231", credits: 3, completed: true },
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