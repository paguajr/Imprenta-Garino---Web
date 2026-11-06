(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var nav = document.getElementById('nav');
  var lastY = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 10);
    nav.classList.toggle('is-hidden', y > lastY && y > 400);
    lastY = y;
  }, { passive: true });

  if (!window.gsap || !window.ScrollTrigger || reduce) {
    document.documentElement.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  function has(sel) { return document.querySelector(sel); }

  // Texto "que se lee" con el scroll
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w) {
      return '<span class="word" aria-hidden="true">' + w + ' </span>';
    }).join('');
  });

  /* ---------- HERO ---------- */
  var intro = gsap.timeline({ delay: .15 });
  intro
    .fromTo('.eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .8 }, 0)
    .fromTo('[data-hero-line]', { y: '110%' }, { y: '0%', duration: 1.2, stagger: .14, ease: 'expo.out' }, .1)
    .fromTo('.hero__lead', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9 }, .7)
    .fromTo('.hero__cta', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .9 }, .85);

  if (has('.float')) {
    var rot = { 1: -5, 2: 4, 3: -2 };
    [1, 2, 3].forEach(function (n, i) {
      intro.fromTo('.float--' + n, { opacity: 0, y: 80, rotation: rot[n] * 2.4 },
        { opacity: 1, y: 0, rotation: rot[n], duration: 1.2, ease: 'expo.out' }, .35 + i * .15);
    });
    gsap.to('.float--1', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.float--2', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.float--3', { yPercent: -26, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  if (has('.ui--doc')) {
    intro.fromTo('.ui--doc', { opacity: 0, y: 70, rotation: -9 }, { opacity: 1, y: 0, rotation: -3, duration: 1.2, ease: 'expo.out' }, .4);
    intro.from('.ui__row', { scaleX: 0, transformOrigin: 'left', duration: .7, stagger: .1 }, .9);
    intro.from('.ui__stamp', { scale: 2.2, opacity: 0, duration: .5, ease: 'back.out(2)' }, 1.5);
  }

  var heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
  gsap.to('.hero__ghost', { yPercent: -25, xPercent: -6, ease: 'none', scrollTrigger: heroST });
  gsap.to('.orb--a', { yPercent: 40, ease: 'none', scrollTrigger: heroST });
  gsap.to('.orb--b', { yPercent: -35, ease: 'none', scrollTrigger: heroST });
  gsap.to('.hero__content', { yPercent: 12, opacity: .15, ease: 'none', scrollTrigger: heroST });

  /* ---------- Reveal genérico ---------- */
  gsap.utils.toArray('[data-reveal]').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  gsap.utils.toArray('[data-words]').forEach(function (el) {
    gsap.fromTo(el.querySelectorAll('.word'), { opacity: .14 }, {
      opacity: 1, ease: 'none', stagger: .1,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: .6 }
    });
  });

  /* ---------- GRÁFICOS: tarjetas apiladas ---------- */
  var cards = gsap.utils.toArray('.pcard');
  if (cards.length) {
    ScrollTrigger.matchMedia({
      '(min-width: 981px)': function () {
        cards.forEach(function (card, i) {
          var img = card.querySelector('.pcard__img img');
          if (img) {
            gsap.fromTo(img, { yPercent: -7 }, {
              yPercent: 7, ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
            });
          }
          var next = cards[i + 1];
          if (next) {
            gsap.to(card, {
              scale: .93, filter: 'brightness(.86)', ease: 'none',
              scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 25%', scrub: true }
            });
          }
        });
      },
      '(max-width: 980px)': function () {
        cards.forEach(function (card) {
          gsap.from(card, {
            opacity: 0, y: 60, duration: 1,
            scrollTrigger: { trigger: card, start: 'top 90%', once: true }
          });
        });
      }
    });
  }

  /* ---------- INFORMÁTICOS: bento ---------- */
  var tiles = gsap.utils.toArray('[data-tile]');
  if (tiles.length) {
    gsap.fromTo(tiles, { opacity: 0, y: 60, scale: .96 }, {
      opacity: 1, y: 0, scale: 1, duration: 1, stagger: .09, ease: 'power4.out',
      scrollTrigger: { trigger: '.bento', start: 'top 82%', once: true }
    });
  }

  if (has('.inv')) {
    gsap.from('.inv:not(.inv--back)', { x: 60, rotation: 6, opacity: 0, duration: 1.1, scrollTrigger: { trigger: '.viz-invoice', start: 'top 80%', once: true } });
    gsap.from('.inv__ok', { scale: 2.4, opacity: 0, duration: .5, delay: .9, ease: 'back.out(2)', scrollTrigger: { trigger: '.viz-invoice', start: 'top 80%', once: true } });
  }
  if (has('.viz-flow')) {
    gsap.from('.viz-flow .node', { y: 40, opacity: 0, duration: .9, stagger: .25, scrollTrigger: { trigger: '.viz-flow', start: 'top 80%', once: true } });
  }
  if (has('.viz-cross')) {
    gsap.from('.viz-cross .core', { scale: .4, opacity: 0, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.viz-cross', start: 'top 80%', once: true } });
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
