(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');

  // Sticky nav: sombra al hacer scroll, se oculta al bajar y reaparece al subir
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 10);
    nav.classList.toggle('is-hidden', y > lastY && y > 400);
    lastY = y;
  }, { passive: true });

  // Si GSAP no cargó o el usuario prefiere menos movimiento: contenido visible, sin animar
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    document.documentElement.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // Palabras: separar en spans para el efecto de lectura progresiva
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w) {
      return '<span class="word" aria-hidden="true">' + w + ' </span>';
    }).join('');
  });

  /* ---------- HERO: entrada ---------- */
  var intro = gsap.timeline({ delay: .15 });
  intro
    .fromTo('.eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8 }, 0)
    .fromTo('[data-hero-line]', { y: '110%' }, { y: '0%', duration: 1.2, stagger: .14, ease: 'expo.out' }, .1)
    .fromTo('.hero__lead', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9 }, .65)
    .fromTo('.hero__cta', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9 }, .8);

  /* ---------- HERO: parallax con scroll ---------- */
  var heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__ghost', { yPercent: -25, xPercent: -6, ease: 'none', scrollTrigger: heroST });
  gsap.to('.orb--a', { yPercent: 40, ease: 'none', scrollTrigger: heroST });
  gsap.to('.orb--b', { yPercent: -35, ease: 'none', scrollTrigger: heroST });
  gsap.to('.orb--c', { yPercent: 60, xPercent: -30, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__content', { yPercent: 14, opacity: .15, ease: 'none', scrollTrigger: heroST });

  // Parallax suave con el mouse (solo punteros finos)
  if (window.matchMedia('(pointer: fine)').matches) {
    var hero = document.querySelector('.hero');
    var oa = gsap.quickTo('.orb--a', 'x', { duration: 1.2 });
    var ob = gsap.quickTo('.orb--b', 'x', { duration: 1.4 });
    var oay = gsap.quickTo('.orb--a', 'rotation', { duration: 1.2 });
    hero.addEventListener('mousemove', function (e) {
      var nx = e.clientX / window.innerWidth - .5;
      oa(nx * -60); ob(nx * 50); oay(nx * 8);
    });
  }

  /* ---------- Reveal genérico ---------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------- Texto que se "lee" con el scroll ---------- */
  gsap.utils.toArray('[data-words]').forEach(function (el) {
    gsap.fromTo(el.querySelectorAll('.word'), { opacity: .14 }, {
      opacity: 1, ease: 'none', stagger: .1,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: .6 }
    });
  });

  /* ---------- Contadores ---------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var obj = { v: end > 1000 ? end - 60 : 0 };
    el.textContent = obj.v;
    gsap.to(obj, {
      v: end, duration: 2, ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(obj.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  /* ---------- Tarjetas de divisiones ---------- */
  gsap.utils.toArray('[data-card]').forEach(function (card, i) {
    gsap.from(card, {
      opacity: 0, y: 90, duration: 1.2, ease: 'power4.out', delay: i * .12,
      scrollTrigger: { trigger: card, start: 'top 90%', once: true }
    });
    gsap.fromTo(card.querySelector('.card__media img'), { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Scroll horizontal de valores (solo escritorio) ---------- */
  ScrollTrigger.matchMedia({
    '(min-width: 901px)': function () {
      var track = document.querySelector('.hscroll__track');
      var bar = document.querySelector('.hscroll__bar span');
      var dist = function () { return Math.max(0, track.scrollWidth - window.innerWidth + 48); };

      var scrollTween = gsap.to(track, {
        x: function () { return -dist(); },
        ease: 'none',
        scrollTrigger: {
          trigger: '.hscroll',
          start: 'top top',
          end: function () { return '+=' + dist(); },
          pin: '.hscroll__pin',
          scrub: .8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: function (self) { gsap.set(bar, { scaleX: self.progress }); }
        }
      });

      gsap.utils.toArray('.panel:not(.panel--intro)').forEach(function (p) {
        gsap.from(p, {
          opacity: .35, scale: .94, ease: 'none',
          scrollTrigger: {
            trigger: p, containerAnimation: scrollTween,
            start: 'left 95%', end: 'left 60%', scrub: true
          }
        });
      });
    }
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
