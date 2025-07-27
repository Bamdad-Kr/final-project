document.addEventListener('DOMContentLoaded', () => {
    console.log('App.js loaded!');
    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.main-nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.style.color = '#f0f0f0';
        }
    });
});