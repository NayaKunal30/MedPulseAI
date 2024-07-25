
document.getElementById('services-button').addEventListener('click', function () {
  const dropdown = document.getElementById('services-dropdown');
  dropdown.classList.toggle('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const servicesButton = document.getElementById('mobile-services-button');
  const mobileServicesDropdown = document.getElementById('mobile-services-dropdown');

  // Toggle mobile menu visibility
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Toggle dropdown menu inside mobile menu
  servicesButton.addEventListener('click', () => {
    mobileServicesDropdown.classList.toggle('hidden');
  });

  // Close mobile menu if clicking outside of it
  document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
});



document.addEventListener('DOMContentLoaded', function() {
  var animationContainer = document.getElementById('lottie-animation');

  var animation = lottie.loadAnimation({
    container: animationContainer,
    renderer: 'svg', // or 'canvas' or 'html'
    loop: true, // Loop the animation
    autoplay: true, // Start playing the animation automatically
    path: './public/animationmain.json' // Replace with the path to your JSON file
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var animationContainerAbout = document.getElementById('lottie-animation-about');

  lottie.loadAnimation({
    container: animationContainerAbout,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './public/animationpred.json' // Replace with the path to your JSON file
  });
});
