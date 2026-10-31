/* ======================================================
   SUBHADIP MAITY — PORTFOLIO V8 — Script
   ====================================================== */

// ---- Theme Toggle ----
// Theme toggle removed

// ---- Custom Cursor Glow ----
(function() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || !window.matchMedia('(hover: hover)').matches) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let gx = mx, gy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  });

  function tick() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(tick);
  }
  tick();
})();

// ---- Scroll Progress Bar + Pill scrolled state ----
(function() {
  const bar = document.getElementById('progressBar');
  const pill = document.getElementById('pill');
  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
    if (pill) pill.classList.toggle('scrolled', scrollTop > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---- Active Section Highlight ----
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const links = document.querySelectorAll('.links a');
  const indicator = document.getElementById('indicator');
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;

  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.section);
      if (target) {
        setActive(a);
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
      }
    });
  });

  function setActive(el) {
    links.forEach(l => l.classList.remove('active'));
    el.classList.add('active');
    if (indicator) {
      const linksEl = document.getElementById('links');
      const linksRect = linksEl.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      indicator.style.left = (elRect.left - linksRect.left) + 'px';
      indicator.style.width = elRect.width + 'px';
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(checkActive);
      ticking = true;
    }
  }

  function checkActive() {
    ticking = false;
    const scrollY = window.scrollY;
    const viewportCenter = scrollY + window.innerHeight / 2;
    let newActive = null;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
        newActive = document.querySelector(`.links a[href="#${section.id}"]`);
        break;
      }
    }

    // If scrolled past last section
    if (!newActive && sections.length > 0) {
      const last = sections[sections.length - 1];
      if (scrollY + window.innerHeight > last.offsetTop + last.offsetHeight) {
        newActive = document.querySelector(`.links a[href="#${last.id}"]`);
      }
    }

    if (newActive) {
      setActive(newActive);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  checkActive();
})();

// ---- Mobile Menu ----
// Removed — replaced with My_Portfolio floating pill navbar

// ---- Scroll Reveal ----
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');

  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

// ---- Animated Counters ----
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('.stat-num[data-target]');

  if (prefersReduced) {
    nums.forEach(n => n.textContent = n.dataset.target);
    return;
  }

  function animateNum(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNum(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();

// ---- Typing Effect ----
(function() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'AI/ML Engineer',
    'Data Scientist',
    'Deep Learning Enthusiast',
    'Problem Solver'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let pauseEnd = 0;

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      // Typing
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        // Finished typing — pause before deleting
        pauseEnd = performance.now() + 2500;
        setTimeout(() => {
          deleting = true;
          requestAnimationFrame(type);
        }, 2500);
        return;
      }

      // Variable typing speed
      const delay = 60 + Math.random() * 80;
      setTimeout(() => requestAnimationFrame(type), delay);
    } else {
      // Deleting
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        // Move to next phrase
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        requestAnimationFrame(type);
        return;
      }

      const delay = 30;
      setTimeout(() => requestAnimationFrame(type), delay);
    }
  }

  // Start after a brief delay
  setTimeout(() => requestAnimationFrame(type), 800);
})();

// ---- Project Filtering ----
(function() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.proj-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = `cardIn .5s ${i * 0.05}s ease both`;
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

// ---- Contact Form Handler ----
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const original = btn.textContent;

  btn.textContent = '✓ Sent!';
  btn.style.background = 'var(--accent3)';

  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// ---- 3D Perspective Reveal for Glass Cards ----
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const glassCards = document.querySelectorAll('.glass');

  if (prefersReduced) {
    glassCards.forEach(c => c.classList.add('expanded'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('expanded');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  glassCards.forEach(el => observer.observe(el));
})();

// ---- Mouse-follow glow inside glass/project cards ----
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.addEventListener('mousemove', e => {
    const x = e.clientX, y = e.clientY;
    document.querySelectorAll('.glass, .proj-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      const inView = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      if (inView) {
        card.style.setProperty('--gx', ((x - rect.left) / rect.width * 100) + '%');
        card.style.setProperty('--gy', ((y - rect.top) / rect.height * 100) + '%');
      }
    });
  }, { passive: true });
})();

// ---- Floating icons entrance animation ----
(function() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.floating-icon').forEach(icon => icon.style.opacity = '0.6');
    return;
  }
  const icons = document.querySelectorAll('.floating-icon');
  const delays = [0, 1200, 2400, 3600];
  icons.forEach((icon, i) => {
    icon.style.opacity = '0';
    icon.style.transition = 'opacity 0.8s ease ' + delays[i] + 'ms, transform 5s ease-in-out ' + delays[i] + 'ms';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { icon.style.opacity = '0.5'; });
    });
  });
})();

// ---- Smooth anchor offset fix ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
