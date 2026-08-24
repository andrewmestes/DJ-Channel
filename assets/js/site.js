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
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeBox(); closeVid(); }
  });

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
     Plays on phones too, with a 3.3MB 360p cut instead of the 6.3MB 480p one.
     It loads only after `load` + idle so it never competes with the poster
     image for LCP — the hero still paints instantly, the video fades in behind
     it a moment later. Skipped entirely for reduced-motion, Data Saver, and
     2G. If autoplay is blocked (iOS Low Power Mode), the poster just stays. */
  function whenIdle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1800 });
    else setTimeout(fn, 500);
  }
  var hv = $('[data-hero-video]');
  if (hv) {
    var conn = navigator.connection || navigator.webkitConnection || {};
    var thrifty = conn.saveData === true || /(^|\-)2g$/.test(conn.effectiveType || '');
    var startHero = function () {
      if (hv.src) return;
      hv.src = (window.innerWidth < 768 && hv.dataset.heroMobile)
        ? hv.dataset.heroMobile
        : hv.dataset.heroVideo;
      hv.addEventListener('canplay', function () { hv.classList.add('is-ready'); }, { once: true });
      var p = hv.play();
      if (p && p.catch) p.catch(function () {
        // iOS Low Power Mode blocks autoplay outright. The poster carries the
        // hero until the first touch, then we try once more and stop asking.
        var retry = function () {
          hv.play().catch(function () {});
          window.removeEventListener('touchstart', retry);
          window.removeEventListener('scroll', retry);
        };
        window.addEventListener('touchstart', retry, { once: true, passive: true });
        window.addEventListener('scroll', retry, { once: true, passive: true });
      });
    };
    if (!reduce && !thrifty) {
      if (document.readyState === 'complete') whenIdle(startHero);
      else window.addEventListener('load', function () { whenIdle(startHero); });
    }
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

  /* ---------- 360 booth video modal ----------
     Facade pattern: the thumbnails are plain <img>, and no YouTube code is
     fetched until someone actually presses play. */
  var vm = $('.vmodal'), vmFrame = $('.vmodal__frame');
  function openVid(id, title) {
    if (!vm) return;
    vmFrame.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" ' +
      'title="' + (title || 'DJ CHANNELL video') + '" allow="accelerometer; autoplay; ' +
      'clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
      'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    vm.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeVid() {
    if (!vm) return;
    vm.classList.remove('is-open');
    vmFrame.innerHTML = '';           // stops playback
    document.body.style.overflow = '';
  }
  $$('[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () { openVid(b.dataset.yt, b.getAttribute('aria-label')); });
  });
  if (vm) {
    $('.vmodal__close', vm).addEventListener('click', closeVid);
    vm.addEventListener('click', function (e) { if (e.target === vm) closeVid(); });
  }


  /* ---------- reviews: show four on mobile, rest on request ---------- */
  var moreBtn = $('#moreReviews'), rgrid = $('#rgrid');
  if (moreBtn && rgrid) {
    moreBtn.addEventListener('click', function () {
      rgrid.classList.remove('is-collapsed');
      document.body.classList.add('reviews-open');
    });
  }

  /* ---------- marquee: duplicate track so the loop is seamless ---------- */
  $$('[data-loop]').forEach(function (track) {
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
