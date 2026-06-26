document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.style.borderBottomColor = 'rgba(201, 168, 76, 0.3)';
    } else {
      header.style.borderBottomColor = 'rgba(201, 168, 76, 0.2)';
    }
  });
}
