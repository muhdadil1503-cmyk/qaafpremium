/**
 * QaaF Premium — script.js
 * Handles: cursor, letter animation, nav, scroll reveal,
 *          buy page navigation (index.html only)
 */

'use strict';

/* ═══════════════════════════════════════════════════
   UTILITY
═══════════════════════════════════════════════════ */
function lerp(a, b, t) { return a + (b - a) * t; }
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

/* ═══════════════════════════════════════════════════
   CURSOR  (desktop / fine pointer only)
═══════════════════════════════════════════════════ */
(function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  }, { passive: true });

  (function tick() {
    dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  })();

  /* Expand ring on interactive elements */
  const targets = 'button, a, .fcell, .pclick, .szp, .h-letter';
  qsa(targets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cb'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cb'));
  });
})();

/* ═══════════════════════════════════════════════════
   LETTER ANIMATION
═══════════════════════════════════════════════════ */
(function initLetters() {
  const letters  = qsa('.h-letter');
  const hero     = document.getElementById('sh');
  if (!letters.length) return;

  const isFine = window.matchMedia('(pointer: fine)').matches;

  /* Desktop: hover neighbouring letters slightly */
  if (isFine) {
    letters.forEach((l, i) => {
      l.addEventListener('mouseenter', () => {
        const prev = letters[i - 1];
        const next = letters[i + 1];
        if (prev) prev.style.transform = 'translateY(-4px) scale(1.015)';
        if (next) next.style.transform = 'translateY(-4px) scale(1.015)';
      });
      l.addEventListener('mouseleave', () => {
        letters.forEach(ll => { if (!ll.matches(':hover')) ll.style.transform = ''; });
      });
    });
  }

  /* Mobile: idle wave + touch trigger */
  let waveTimer = null;

  function triggerWave() {
    clearTimeout(waveTimer);
    letters.forEach((l, i) => {
      setTimeout(() => {
        l.classList.add('lift');
        setTimeout(() => l.classList.remove('lift'), 420);
      }, i * 80);
    });
    waveTimer = setTimeout(triggerWave, 4200);
  }

  if (!isFine) {
    setTimeout(triggerWave, 2800);

    if (hero) {
      hero.addEventListener('touchstart', () => {
        clearTimeout(waveTimer);
        letters.forEach((l, i) => {
          setTimeout(() => {
            l.classList.add('lift');
            setTimeout(() => l.classList.remove('lift'), 420);
          }, i * 70);
        });
        waveTimer = setTimeout(triggerWave, 4200);
      }, { passive: true });
    }
  }
})();

/* ═══════════════════════════════════════════════════
   STICKY NAV
═══════════════════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('stk', window.scrollY > 50);
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════ */
(function initReveal() {
  const items = qsa('.rv');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.11, rootMargin: '0px 0px -32px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════
   INTRO  (index.html only)
═══════════════════════════════════════════════════ */
(function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  if (sessionStorage.getItem('qaafIntroPlayed')) {
    intro.style.display = 'none';
    return;
  }
  sessionStorage.setItem('qaafIntroPlayed', 'true');

  const il = document.getElementById('il');
  const ib = document.getElementById('ib');
  const iw = document.getElementById('iw');

  setTimeout(() => il && il.classList.add('on'),  110);
  setTimeout(() => ib && ib.classList.add('on'),  560);
  setTimeout(() => iw && iw.classList.add('on'), 1860);

  setTimeout(() => {
    intro.classList.add('out');
    setTimeout(() => { intro.style.display = 'none'; }, 520);
  }, 4600);
})();



/* ═══════════════════════════════════════════════════
   SETTINGS & DARK MODE
═══════════════════════════════════════════════════ */
(function initSettings() {
  const hmBtn = document.getElementById('hmBtn');
  const spClose = document.getElementById('spClose');
  const sidePanel = document.getElementById('sidePanel');
  const spOverlay = document.getElementById('spOverlay');
  const themeToggle = document.getElementById('themeToggle');

  // Load theme preference immediately
  const currentTheme = localStorage.getItem('qaafTheme');
  if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.checked = true;
  }

  // Panel Open/Close
  function openPanel() {
    if(sidePanel) sidePanel.classList.add('open');
    if(spOverlay) spOverlay.classList.add('show');
  }
  function closePanel() {
    if(sidePanel) sidePanel.classList.remove('open');
    if(spOverlay) spOverlay.classList.remove('show');
  }

  if (hmBtn) hmBtn.addEventListener('click', openPanel);
  if (spClose) spClose.addEventListener('click', closePanel);
  if (spOverlay) spOverlay.addEventListener('click', closePanel);

  // Theme Toggle
  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('qaafTheme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('qaafTheme', 'light');
      }
    });
  }
})();
