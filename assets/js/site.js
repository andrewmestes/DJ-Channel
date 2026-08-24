/* DJ CHANNELL — site.js  (no dependencies) */
(function () {
  'use strict';
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav: solidify on scroll + sticky mobile bar ---------- */
  var nav = $('.nav'), bar = $('.bookbar'), hero = $('.hero');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-stuck', y > 40);
    if (bar) bar.classList.toggle('is-up', y > (hero ? hero.offsetHeight * 0.6 : 600));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var burger = $('.nav__burger');
  function closeMenu() { document.body.classList.remove('menu-open'); if (burger) burger.setAttribute('aria-expanded', 'false'); }
  if (burger) {
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('.drawer a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); closeBox(); } });

  /* ---------- scroll reveal ---------- */
  var rv = $$('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    rv.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  }

  /* No count-up on the stat numbers. A counter animating from zero renders
     "0 REVIEWS" / "1 YEARS" for the first second, and those are the exact
     numbers this page is asking people to trust. They stay static. */

  /* ---------- hero video ----------
     Skipped on phones (data) and for reduced-motion. The element is kept, not
     removed, so widening the window later still gets the video. */
  var hv = $('[data-hero-video]');
  if (hv) {
    var wide = window.matchMedia('(min-width: 768px)');
    var loadHero = function () {
      if (reduce || !wide.matches || hv.src) return;
      hv.src = hv.dataset.heroVideo;
      hv.addEventListener('canplay', function () { hv.classList.add('is-ready'); }, { once: true });
      var p = hv.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked — poster stays */ });
    };
    loadHero();
    if (wide.addEventListener) wide.addEventListener('change', loadHero);
    else if (wide.addListener) wide.addListener(loadHero);
  }

  /* ---------- accordions ---------- */
  $$('.acc').forEach(function (acc) {
    var q = $('.acc__q', acc), a = $('.acc__a', acc);
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = acc.classList.contains('is-open');
      var group = acc.closest('[data-acc-group]');
      if (group) {
        $$('.acc.is-open', group).forEach(function (o) {
          if (o === acc) return;
          o.classList.remove('is-open');
          $('.acc__a', o).style.height = '0px';
          $('.acc__q', o).setAttribute('aria-expanded', 'false');
        });
      }
      acc.classList.toggle('is-open', !open);
      q.setAttribute('aria-expanded', String(!open));
      a.style.height = open ? '0px' : a.scrollHeight + 'px';
    });
  });
  window.addEventListener('resize', function () {
    $$('.acc.is-open .acc__a').forEach(function (a) { a.style.height = a.scrollHeight + 'px'; });
  });

  /* ---------- gallery lightbox ---------- */
  var box = $('.lightbox'), boxImg = $('.lightbox img'), shots = $$('[data-lb]'), idx = 0;
  function openBox(i) {
    if (!box) return;
    idx = (i + shots.length) % shots.length;
    var img = shots[idx].querySelector('img');
    boxImg.src = img.dataset.full || img.src;
    boxImg.alt = img.alt || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeBox() {
    if (!box) return;
    box.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  shots.forEach(function (f, i) { f.addEventListener('click', function () { openBox(i); }); });
  if (box) {
    $('.lightbox__close', box).addEventListener('click', closeBox);
    $('.lightbox__nav--prev', box).addEventListener('click', function (e) { e.stopPropagation(); openBox(idx - 1); });
    $('.lightbox__nav--next', box).addEventListener('click', function (e) { e.stopPropagation(); openBox(idx + 1); });
    box.addEventListener('click', function (e) { if (e.target === box || e.target === boxImg) closeBox(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') openBox(idx + 1);
      if (e.key === 'ArrowLeft') openBox(idx - 1);
    });
  }

  /* ---------- marquee: duplicate track so the loop is seamless ---------- */
  $$('.marquee__track').forEach(function (track) {
    var set = track.firstElementChild;
    if (set) track.appendChild(set.cloneNode(true));
  });

  /* ---------- smooth anchor offset for the fixed nav ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      closeMenu();
      var top = t.getBoundingClientRect().top + window.scrollY - 58;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });
})();
