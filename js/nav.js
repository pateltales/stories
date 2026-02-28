/**
 * Nav scroll behaviour — matches pateltales.github.io
 * Adds `.scrolled` class when user scrolls past 10px.
 * Pages with a dark hero start with a transparent nav;
 * pages without one should add `.scrolled` in HTML directly.
 */
window.addEventListener('scroll', () => {
  document.querySelector('.nav')
    .classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });
