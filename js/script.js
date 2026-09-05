/* ============================
   Kartik's Portfolio · JS
   Modular Vanilla JavaScript
   ============================ */

(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* -------- Year -------- */
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* -------- Mobile Menu -------- */
  const menuBtn = $('#menu-btn');
  const mobileMenu = $('#mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });
    $$('.mobile-link').forEach(l => l.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  /* -------- Navbar scroll state + scroll progress -------- */
  const navbar = $('#navbar');
  const progress = $('#scroll-progress');
  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 20);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = ((y / h) * 100) + '%';
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------- Active nav on scroll -------- */
  const sections = $$('main section[id]');
  const links = $$('.nav-link, .mobile-link');
  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* -------- Reveal on scroll -------- */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 40);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => ro.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* -------- Back to top -------- */
  const toTop = $('#to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* -------- Typed rotating text -------- */
  const typed = $('#typed');
  if (typed) {
    const words = [
      'Full Stack Developer',
      'C++ DSA Problem Solver',
      'AI Enthusiast',
      'Backend Learner',
      'Software Engineering Student'
    ];
    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
      const w = words[wi];
      typed.textContent = deleting ? w.slice(0, --ci) : w.slice(0, ++ci);
      let delay = deleting ? 45 : 85;
      if (!deleting && ci === w.length) { delay = 1400; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* -------- 3D Cube mouse interaction -------- */
  const hero3d = $('#hero-3d');
  const cube = $('#cube');
  if (hero3d && cube && window.matchMedia('(min-width: 768px)').matches) {
    let rx = -20, ry = 0, tx = 0, ty = 0;
    hero3d.addEventListener('mousemove', (e) => {
      const rect = hero3d.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      tx = -y * 30; ty = x * 60;
    });
    hero3d.addEventListener('mouseleave', () => { tx = -20; ty = 0; });

    const loop = () => {
      rx += (tx - rx) * 0.08;
      ry += (ty - ry) * 0.08;
      cube.style.animation = 'none';
      cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      requestAnimationFrame(loop);
    };
    // Only take over after user hovers, otherwise let CSS animation play
    hero3d.addEventListener('mouseenter', () => { loop(); }, { once: true });
  }

  /* -------- Tilt cards (subtle 3D) -------- */
  const tiltCards = $$('.tilt-card, .project-card');
  if (window.matchMedia('(hover: hover)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -6;
        const ry = (px - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* -------- Project filtering -------- */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach(c => {
        const cats = (c.dataset.category || '').split(' ');
        c.style.display = (f === 'all' || cats.includes(f)) ? '' : 'none';
      });
    });
  });

  /* -------- Project modal -------- */
  const modal = $('#modal');
  const mTitle = $('#modal-title');
  const mBody = $('#modal-body');

  const PROJECTS = {
    saas: {
      title: 'SaaS Reporting Platform',
      html: `
        <h4 class="text-white font-semibold">Problem</h4>
        <p>Organizations need a centralized way to manage business data, generate reports, and control user access — without stitching together multiple disconnected tools.</p>

        <h4 class="text-white font-semibold mt-4">Solution</h4>
        <p>A multi-tenant SaaS platform where organizations register, add users under role-based permissions, connect their data, and build custom reports &amp; dashboards.</p>

        <h4 class="text-white font-semibold mt-4">Architecture</h4>
        <p class="font-mono text-xs bg-black/30 p-3 rounded border border-white/10">User → Frontend → REST API → Auth/RBAC → Business Logic → MySQL</p>

        <h4 class="text-white font-semibold mt-4">Engineering Decisions</h4>
        <ul class="list-disc pl-5 space-y-1.5">
          <li><b class="text-white">MySQL:</b> Relational data + strong consistency needed for tenant/user/report joins.</li>
          <li><b class="text-white">REST:</b> Simple, well-understood contract for CRUD on tenants and reports.</li>
          <li><b class="text-white">JWT:</b> Stateless auth — works well for API-driven multi-tenant systems.</li>
          <li><b class="text-white">RBAC:</b> Cleanest way to model per-organization permissions.</li>
          <li><b class="text-white">Multi-tenancy:</b> tenant_id column strategy for isolation with shared schema.</li>
        </ul>

        <h4 class="text-white font-semibold mt-4">Challenges</h4>
        <p>Designing schemas that scale across tenants, keeping the report builder flexible without killing query performance, and modelling role hierarchies cleanly.</p>

        <h4 class="text-white font-semibold mt-4">What I'm Learning</h4>
        <p>Database design under real constraints, API boundary design, and how authentication + authorization actually work in production-style apps.</p>

        <p class="mt-4 text-yellow-400 font-medium">Status: In Development — not production-ready.</p>
      `
    },
    mern: {
      title: 'MERN Full Stack Application',
      html: `
        <h4 class="text-white font-semibold">Problem</h4>
        <p>Move beyond tutorial-level apps and build something that surfaces real engineering concerns — auth flows, schema design, API contracts.</p>

        <h4 class="text-white font-semibold mt-4">Solution</h4>
        <p>A full-stack MERN app with working JWT authentication, RESTful endpoints, and a component-driven React frontend.</p>

        <h4 class="text-white font-semibold mt-4">Engineering Decisions</h4>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>JWT-based auth with protected routes.</li>
          <li>MongoDB collections designed around query patterns.</li>
          <li>Consistent REST naming + status codes.</li>
        </ul>

        <h4 class="text-white font-semibold mt-4">What I Learned</h4>
        <p>State on both sides of the network, error handling across boundaries, and why input validation matters.</p>
      `
    },
    dsa: {
      title: 'DSA Practice Repository',
      html: `
        <h4 class="text-white font-semibold">Purpose</h4>
        <p>Topic-wise DSA problems solved in <b class="text-white">C++</b>, organized to strengthen problem solving and prepare for engineering interviews.</p>

        <h4 class="text-white font-semibold mt-4">Topics</h4>
        <p>Arrays, Strings, Binary Search, Sorting, Recursion, Linked Lists, Stack, Queue, Trees, Graphs, Greedy, DP, Hashing.</p>

        <h4 class="text-white font-semibold mt-4">Approach</h4>
        <ul class="list-disc pl-5 space-y-1.5">
          <li>Brute force → optimal, documented step by step.</li>
          <li>Time &amp; space complexity for every solution.</li>
          <li>Edge cases: empty, duplicates, negatives, overflow.</li>
        </ul>
      `
    }
  };

  const openModal = key => {
    const d = PROJECTS[key]; if (!d) return;
    mTitle.textContent = d.title;
    mBody.innerHTML = d.html;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };
  $$('[data-project]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.project)));
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* -------- DSA topic hover info -------- */
  const topicInfo = $('#topic-info');
  $$('#dsa-topics .topic-card').forEach(t => {
    t.addEventListener('mouseenter', () => {
      if (topicInfo) topicInfo.textContent = '→ ' + t.dataset.info;
    });
  });

  /* -------- Architecture hover -------- */
  const archInfo = $('#arch-info');
  $$('#arch .arch-node').forEach(n => {
    n.addEventListener('mouseenter', () => {
      if (archInfo) archInfo.textContent = '→ ' + n.dataset.info;
    });
  });

  /* -------- Custom cursor -------- */
  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    const hoverables = 'a, button, .tilt-card, .project-card, .topic-card, .arch-node';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverables)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverables)) ring.classList.remove('hover');
    });
  }
})();