// app.js
document.addEventListener('scroll', () => {
  const path = document.querySelector('#path');
  const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
  
  const pathLength = path.getTotalLength();
  
  // Calculate the new length based on scroll
  const drawLength = pathLength * scrollPercent;
  
  // Set the dasharray and dashoffset to animate the path
  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength - drawLength;
});

// Initialize the path with total length
const path = document.querySelector('#path');
const pathLength = path.getTotalLength();
path.style.strokeDasharray = pathLength;
path.style.strokeDashoffset = pathLength;
