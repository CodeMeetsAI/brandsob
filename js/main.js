/* ============================================================
   BRANDSOB — GLOBAL SCRIPT (runs on every page)
   ============================================================ */

/* ===== HEADER SCROLL ===== */
const header = document.getElementById('siteHeader');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
}

/* ===== MOBILE MENU ===== */
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
}

/* ===== ACTIVE NAV LINK ===== */
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el => io.observe(el));
}

/* ===== ANIMATED COUNTERS ===== */
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let cur = 0;
        const step = Math.max(1, Math.round(target / 60));
        const tick = () => {
          cur += step;
          if (cur >= target) { el.textContent = target; return; }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
        counterIO.unobserve(el);
      }
    });
  }, {threshold:0.5});
  counters.forEach(c => counterIO.observe(c));
}

/* ===== PORTFOLIO DATA (shared: home preview + full portfolio page) ===== */
const portfolioData = [
  {title:"Luxury Brand Identity", cat:"branding", tag:"Branding", img:"brand-1.jpg", desc:"Complete brand strategy, logo, typography, colors and guidelines built for a premium retail label."},
  {title:"Corporate Website", cat:"web", tag:"Web Design", img:"web-1.jpg", desc:"Modern responsive website with smooth animations and sub-second load times."},
  {title:"SEO Growth Campaign", cat:"seo", tag:"SEO", img:"seo-1.jpg", desc:"Technical audit and content strategy that tripled organic search traffic in two quarters."},
  {title:"Performance Marketing Campaign", cat:"marketing", tag:"Marketing", img:"marketing-1.jpg", desc:"Paid acquisition system engineered around measurable ROAS across three channels."},
  {title:"Commercial Brand Shoot", cat:"photo", tag:"Photography", img:"photo-1.jpg", desc:"Full-day commercial shoot delivering product and lifestyle assets for launch."},
  {title:"Social Media Branding", cat:"branding", tag:"Branding", img:"brand-2.jpg", desc:"Cohesive visual system built for consistent multi-platform social presence."},
  {title:"AI Customer Support Agent", cat:"ai", tag:"AI &amp; Automation", img:"ai-1.jpg", desc:"Agentic support assistant that resolves 70% of inbound tickets autonomously."},
  {title:"E-Commerce Experience", cat:"web", tag:"Web Design", img:"web-2.jpg", desc:"Custom storefront with a streamlined, high-conversion checkout flow."},
  {title:"Product Landing Page", cat:"web", tag:"Web Design", img:"web-3.jpg", desc:"High-converting landing page built to launch and scale a new product line."},
  {title:"Restaurant Brand Identity", cat:"branding", tag:"Branding", img:"brand-3.jpg", desc:"Warm, distinctive identity system for a growing restaurant group."},
  {title:"Local SEO Growth", cat:"seo", tag:"SEO", img:"seo-2.jpg", desc:"Local search optimization that doubled qualified inbound leads in 90 days."},
  {title:"Workflow Automation Suite", cat:"ai", tag:"AI &amp; Automation", img:"ai-2.jpg", desc:"Internal automation system replacing 12+ hours a week of manual operations work."},
];

function pfCardHTML(p){
  return `
    <div class="pf-card reveal in" data-cat="${p.cat}">
      <div class="pf-thumb" style="background-image:url('images/portfolio/${p.img}');"><span class="glyph">01/${p.cat}</span></div>
      <div class="pf-body">
        <span class="pf-tag">${p.tag}</span>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <button type="button" class="pf-link">View Case Study <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button>
      </div>
    </div>
  `;
}

/* Full portfolio grid (portfolio.html) */
const fullGrid = document.getElementById('portfolioGrid');
if (fullGrid) {
  fullGrid.innerHTML = portfolioData.map(pfCardHTML).join('');
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.pf-card').forEach(card => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

/* Home preview grid (index.html) — first 6 items only */
const previewGrid = document.getElementById('portfolioPreview');
if (previewGrid) {
  previewGrid.innerHTML = portfolioData.slice(0,6).map(pfCardHTML).join('');
}

/* ===== CASE STUDY MODAL ===== */
let pfModalEl = null;
function getPfModal(){
  if (pfModalEl) return pfModalEl;
  pfModalEl = document.createElement('div');
  pfModalEl.className = 'pf-modal';
  pfModalEl.setAttribute('role','dialog');
  pfModalEl.setAttribute('aria-modal','true');
  pfModalEl.setAttribute('aria-label','Project case study');
  pfModalEl.innerHTML = `
    <div class="pf-modal-backdrop"></div>
    <div class="pf-modal-card">
      <button type="button" class="pf-modal-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="pf-modal-media"></div>
      <div class="pf-modal-body">
        <span class="pf-tag"></span>
        <h3></h3>
        <p></p>
        <a href="contact.html" class="btn btn-primary btn-sm">Start A Project Like This <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>
      </div>
    </div>
  `;
  pfModalEl.querySelector('.pf-modal-backdrop').addEventListener('click', closePfModal);
  pfModalEl.querySelector('.pf-modal-close').addEventListener('click', closePfModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePfModal(); });
  document.body.appendChild(pfModalEl);
  return pfModalEl;
}
function openPfModal(data){
  const m = getPfModal();
  m.querySelector('.pf-modal-media').style.backgroundImage = `url('${data.img}')`;
  m.querySelector('.pf-tag').textContent = data.tag;
  m.querySelector('.pf-modal-body h3').textContent = data.title;
  m.querySelector('.pf-modal-body p').textContent = data.desc;
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePfModal(){
  if (!pfModalEl) return;
  pfModalEl.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', (e) => {
  const link = e.target.closest('.pf-link');
  if (!link) return;
  e.preventDefault();
  const card = link.closest('.pf-card');
  if (!card) return;
  const thumb = card.querySelector('.pf-thumb');
  const bg = (thumb && thumb.style.backgroundImage) || '';
  const img = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  const tag = (card.querySelector('.pf-tag') || {}).textContent || '';
  const title = (card.querySelector('h3') || {}).textContent || '';
  const desc = (card.querySelector('.pf-body p') || {}).textContent || '';
  openPfModal({ img, tag, title, desc });
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ===== CONTACT FORM VALIDATION ===== */
const form = document.getElementById('contactForm');
if (form) {
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    const checks = [
      [name, name.value.trim().length > 1],
      [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
      [subject, subject.value.trim().length > 1],
      [message, message.value.trim().length >= 10],
    ];

    checks.forEach(([field, ok]) => {
      field.closest('.form-group').classList.toggle('error', !ok);
      if(!ok) valid = false;
    });

    if(valid){
      status.style.display = 'block';
      form.reset();
      setTimeout(() => status.style.display = 'none', 5000);
    } else {
      status.style.display = 'none';
    }
  });
}
