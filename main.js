'use strict';
// ═══════════════════════════════════════════════════════════
//  THE AESTHETIC — main.js  (ES6+ Modular Logic)
// ═══════════════════════════════════════════════════════════

// ─── THEME TOGGLE ───────────────────────────────────────────
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('ta-theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('ta-theme', next);
});
themeToggle.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') themeToggle.click(); });

// ─── NAVBAR SCROLL ──────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── MOBILE MENU ────────────────────────────────────────────
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('nav-mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
});
mobileMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ─── HERO PARTICLES ─────────────────────────────────────────
(function createParticles() {
  const hero = document.getElementById('hero');
  const colors = ['rgba(212,175,55,', 'rgba(226,185,179,', 'rgba(15,148,136,'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 4 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = [
      `width:${size}px`, `height:${size}px`,
      `background:${color}${Math.random() * 0.5 + 0.2})`,
      `left:${Math.random() * 100}%`,
      `bottom:${Math.random() * 20}%`,
      `animation-duration:${Math.random() * 12 + 8}s`,
      `animation-delay:${Math.random() * 6}s`
    ].join(';');
    hero.appendChild(p);
  }
})();

// ─── COUNTER ANIMATION ─────────────────────────────────────
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + suffix;
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => animateCounter(document.getElementById('stat-years'), 25, '+', 1200), 0);
      setTimeout(() => animateCounter(document.getElementById('stat-cases'), 10000, '+', 1800), 200);
      setTimeout(() => {
        const el = document.getElementById('stat-sat');
        let v = 0;
        const iv = setInterval(() => {
          v = Math.min(v + 1.2, 99.4);
          el.textContent = v.toFixed(1) + '%';
          if (v >= 99.4) { el.textContent = '99.4%'; clearInterval(iv); }
        }, 20);
      }, 400);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const statsCard = document.getElementById('hero-stats-card');
if (statsCard) statsObserver.observe(statsCard);

// ─── 3D CARD TILT ───────────────────────────────────────────
const statsCardEl = document.getElementById('hero-stats-card');
if (statsCardEl) {
  statsCardEl.addEventListener('mousemove', e => {
    const rect = statsCardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    statsCardEl.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  statsCardEl.addEventListener('mouseleave', () => {
    statsCardEl.style.transform = '';
  });
}

// ─── SCROLL REVEAL ──────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in-view'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── BEFORE / AFTER SLIDER ──────────────────────────────────
(function initBaSlider() {
  const wrapper = document.getElementById('ba-slider');
  const handle = document.getElementById('ba-handle');
  const canvasBefore = document.getElementById('ba-canvas-before');
  const canvasAfter = document.getElementById('ba-canvas-after');
  const baName = document.getElementById('ba-name');
  const baDesc = document.getElementById('ba-desc');
  if (!wrapper) return;

  const categories = {
    facial: {
      name: 'Facial Rejuvenation — Facelift & Blepharoplasty',
      desc: 'Patient age 52 · Performed at Max Patparganj · Dr. Manoj K. Johar',
      beforeColor: ['#c2a882', '#a08060', '#8a6844'],
      afterColor: ['#e8c8a0', '#d4a878', '#c09058'],
      label: 'Facelift'
    },
    body: {
      name: 'Body Contouring — Liposuction & Abdominoplasty',
      desc: 'Patient age 38 · Post-partum · Performed at Max Vaishali · Dr. Manoj K. Johar',
      beforeColor: ['#8090b0', '#607090', '#405070'],
      afterColor: ['#a0c0e0', '#80a0c8', '#6090b0'],
      label: 'Body Contouring'
    },
    hair: {
      name: 'Hair Restoration — FUE Transplant',
      desc: 'Patient age 44 · Grade IV hair loss · Performed at Max Noida · Dr. Abid',
      beforeColor: ['#505060', '#404050', '#303040'],
      afterColor: ['#202030', '#181825', '#101018'],
      label: 'Hair Restoration'
    },
    nonsurgical: {
      name: 'Non-Surgical — Botox, Fillers & Thread Lift',
      desc: 'Patient age 46 · Combined treatment · Performed at Max Patparganj · Dr. Naina',
      beforeColor: ['#b09080', '#907060', '#705040'],
      afterColor: ['#d8b090', '#c09070', '#a07050'],
      label: 'Non-Surgical'
    }
  };

  let currentCategory = 'facial';
  let sliderPos = 0.5;
  let isDragging = false;

  function drawCanvas(canvas, colors, isAfter, pos) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth || 800;
    const h = canvas.height = canvas.offsetHeight || 480;

    // Gradient background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, colors[0]);
    bg.addColorStop(0.5, colors[1]);
    bg.addColorStop(1, colors[2]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Decorative elements for "face"
    ctx.save();
    // Oval face shape
    ctx.beginPath();
    ctx.ellipse(w/2, h * 0.42, w * 0.22, h * 0.32, 0, 0, Math.PI * 2);
    ctx.fillStyle = isAfter ? 'rgba(255,220,180,0.55)' : 'rgba(200,160,120,0.45)';
    ctx.fill();

    // Eyes
    const eyeY = h * 0.36;
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.ellipse(w/2 + side * w * 0.07, eyeY, w * 0.04, h * 0.022, 0, 0, Math.PI * 2);
      ctx.fillStyle = isAfter ? 'rgba(60,40,20,0.9)' : 'rgba(80,55,30,0.7)';
      ctx.fill();
    });

    // Nose
    ctx.beginPath();
    ctx.moveTo(w/2, h * 0.40);
    ctx.lineTo(w/2 - w * 0.025, h * 0.47);
    ctx.lineTo(w/2 + w * 0.025, h * 0.47);
    ctx.strokeStyle = isAfter ? 'rgba(160,100,60,0.5)' : 'rgba(120,80,50,0.7)';
    ctx.lineWidth = isAfter ? 1.5 : 2.5;
    ctx.stroke();

    // Mouth
    ctx.beginPath();
    ctx.ellipse(w/2, h * 0.51, w * 0.055, isAfter ? h * 0.015 : h * 0.012, 0, 0, Math.PI);
    ctx.fillStyle = isAfter ? 'rgba(180,80,80,0.8)' : 'rgba(150,70,70,0.7)';
    ctx.fill();

    // Wrinkle lines (before = more, after = fewer)
    if (!isAfter) {
      ctx.strokeStyle = 'rgba(100,70,50,0.35)';
      ctx.lineWidth = 1;
      [h*0.33, h*0.35, h*0.37].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(w/2 - w*0.12, y);
        ctx.quadraticCurveTo(w/2, y - 3, w/2 + w*0.12, y);
        ctx.stroke();
      });
    }

    // Label overlay
    ctx.fillStyle = isAfter ? 'rgba(212,175,55,0.18)' : 'rgba(0,0,0,0.20)';
    ctx.fillRect(0, 0, w, h);

    // "Clinical" overlay text
    ctx.fillStyle = isAfter ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.18)';
    ctx.font = `bold ${Math.floor(h*0.022)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(isAfter ? 'POST-PROCEDURE' : 'PRE-PROCEDURE', w/2, h * 0.88);
    ctx.font = `${Math.floor(h*0.018)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = isAfter ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.25)';
    ctx.fillText(`The Aesthetic · ${categories[currentCategory].label}`, w/2, h * 0.93);

    ctx.restore();
  }

  function setSlider(pct) {
    sliderPos = Math.max(0.02, Math.min(0.98, pct));
    const pctStr = `${(1 - sliderPos) * 100}%`;
    canvasAfter.style.clipPath = `inset(0 ${pctStr} 0 0)`;
    handle.style.left = `${sliderPos * 100}%`;
    handle.setAttribute('aria-valuenow', Math.round(sliderPos * 100));
    drawCanvas(canvasBefore, categories[currentCategory].beforeColor, false, sliderPos);
    drawCanvas(canvasAfter, categories[currentCategory].afterColor, true, sliderPos);
  }

  function updateCategory(cat) {
    currentCategory = cat;
    baName.textContent = categories[cat].name;
    baDesc.textContent = categories[cat].desc;
    setSlider(0.5);
  }

  function getEventX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onStart(e) {
    isDragging = true;
    e.preventDefault();
  }
  function onMove(e) {
    if (!isDragging) return;
    const rect = wrapper.getBoundingClientRect();
    setSlider((getEventX(e) - rect.left) / rect.width);
  }
  function onEnd() { isDragging = false; }

  handle.addEventListener('mousedown', onStart);
  handle.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);

  // Keyboard support
  handle.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') setSlider(sliderPos - 0.05);
    if (e.key === 'ArrowRight') setSlider(sliderPos + 0.05);
  });

  // Tabs
  document.querySelectorAll('.ba-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ba-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      updateCategory(tab.dataset.category);
    });
  });

  // Initial render + resize
  const initRender = () => { setSlider(0.5); };
  initRender();
  const ro = new ResizeObserver(initRender);
  ro.observe(wrapper);

  // BA consult button
  document.getElementById('ba-consult-btn')?.addEventListener('click', openModal);
})();

// ─── TREATMENT SELECTOR ─────────────────────────────────────
(function initTreatmentSelector() {
  const treatmentData = {
    face_surgical: {
      name: 'Surgical Facial Aesthetics',
      desc: 'Comprehensive surgical approach to facial reshaping and rejuvenation, delivering permanent, transformative results tailored to your unique anatomy.',
      type: 'Surgical',
      options: ['Rhinoplasty (Nose Reshaping)', 'Facelift (Rhytidectomy)', 'Blepharoplasty (Eyelid Surgery)', 'Otoplasty (Ear Reshaping)', 'Mentoplasty (Chin Augmentation)'],
      recovery: '2–4 Weeks',
      anaesthesia: 'General / Local',
      duration: '2–5 Hours',
      longevity: 'Permanent'
    },
    face_nonsurgical: {
      name: 'Non-Surgical Facial Rejuvenation',
      desc: 'Advanced non-invasive treatments to refresh and enhance facial appearance with minimal downtime and natural-looking results.',
      type: 'Non-Surgical',
      options: ['Botulinum Toxin (Botox)', 'Dermal Fillers (HA)', 'Thread Lift', 'Chemical Peels', 'Microneedling RF'],
      recovery: '0–3 Days',
      anaesthesia: 'Topical',
      duration: '30–90 Min',
      longevity: '6–18 Months'
    },
    face_laser: {
      name: 'Laser Facial Treatments',
      desc: 'Cutting-edge laser and energy-based technologies for skin resurfacing, pigmentation, and anti-aging without surgery.',
      type: 'Laser & Energy',
      options: ['CO2 Fractional Laser', 'Q-Switch Laser', 'IPL Photofacial', 'Radiofrequency Tightening', 'HIFU'],
      recovery: '3–7 Days',
      anaesthesia: 'Topical',
      duration: '45–120 Min',
      longevity: '12–24 Months'
    },
    face_combination: {
      name: 'Combination Facial Programme',
      desc: 'Our signature multi-modal approach combining surgical and non-surgical modalities for the most comprehensive facial transformation.',
      type: 'Combination',
      options: ['Mini Facelift + Fillers', 'Blepharoplasty + Botox', 'Rhinoplasty + Skin Resurfacing', 'Full Face Rejuvenation Package'],
      recovery: '1–3 Weeks',
      anaesthesia: 'Variable',
      duration: 'Variable',
      longevity: 'Long-term'
    },
    body_surgical: {
      name: 'Surgical Body Contouring',
      desc: 'Precision surgical procedures to reshape, sculpt, and refine the body, delivering dramatic and permanent aesthetic improvements.',
      type: 'Surgical',
      options: ['Liposuction (VASER / Power-Assisted)', 'Abdominoplasty (Tummy Tuck)', 'Breast Augmentation', 'Breast Reduction', 'Body Lift (Post-Bariatric)'],
      recovery: '3–6 Weeks',
      anaesthesia: 'General',
      duration: '2–6 Hours',
      longevity: 'Permanent'
    },
    body_nonsurgical: {
      name: 'Non-Surgical Body Sculpting',
      desc: 'Advanced body contouring without surgery using cryolipolysis, radiofrequency, and other proven technologies.',
      type: 'Non-Surgical',
      options: ['Cryolipolysis (Fat Freezing)', 'HIFU Body Tightening', 'Radiofrequency Body', 'Mesotherapy', 'Carboxytherapy'],
      recovery: '0–2 Days',
      anaesthesia: 'None',
      duration: '60–90 Min',
      longevity: 'Moderate'
    },
    body_laser: { name: 'Laser Body Treatments', desc: 'Laser-based body treatments for stretch marks, pigmentation, and skin texture improvement.', type: 'Laser', options: ['Stretch Mark Laser', 'Scar Revision Laser', 'Hair Reduction Laser', 'Skin Tightening Laser'], recovery: '2–5 Days', anaesthesia: 'Topical', duration: '45–90 Min', longevity: '12–24 Months' },
    body_combination: { name: 'Total Body Transformation', desc: 'A holistic body transformation programme combining surgical sculpting and non-surgical refinement.', type: 'Combination', options: ['Lipo + Skin Tightening', 'Tummy Tuck + Liposuction', 'Mummy Makeover Package', 'Brazilian Body Lift'], recovery: '4–8 Weeks', anaesthesia: 'General', duration: 'Variable', longevity: 'Long-term' },
    skin_surgical: { name: 'Surgical Skin Procedures', desc: 'Surgical-grade skin corrections including scar revision, mole removal, and excision procedures.', type: 'Surgical', options: ['Scar Revision Surgery', 'Keloid Excision', 'Skin Tag Removal', 'Mole Excision & Biopsy'], recovery: '1–2 Weeks', anaesthesia: 'Local', duration: '30–120 Min', longevity: 'Permanent' },
    skin_nonsurgical: { name: 'Advanced Skin Treatments', desc: 'Medical-grade non-surgical skin treatments addressing acne, pigmentation, ageing, and overall skin health.', type: 'Non-Surgical', options: ['PRP Therapy', 'Mesotherapy Skin Booster', 'Chemical Peels', 'Microneedling', 'Vampire Facial'], recovery: '1–5 Days', anaesthesia: 'Topical', duration: '45–90 Min', longevity: '3–12 Months' },
    skin_laser: { name: 'Medical Laser Skin Care', desc: 'The gold standard in treating acne scars, sun damage, melasma, and premature skin ageing with precision lasers.', type: 'Laser', options: ['Fractional CO2 Resurfacing', 'Picosecond Laser', 'Nd:YAG Laser', 'Clear + Brilliant'], recovery: '5–10 Days', anaesthesia: 'Topical', duration: '60–90 Min', longevity: '18–36 Months' },
    skin_combination: { name: 'Comprehensive Skin Programme', desc: 'A curated multi-step skin rejuvenation programme designed for maximum, long-lasting results.', type: 'Combination', options: ['Glow Programme (6 sessions)', 'Anti-Aging Masterplan', 'Acne Scar Correction Series', 'Wedding Glow Package'], recovery: 'Minimal', anaesthesia: 'Topical', duration: 'Monthly sessions', longevity: 'Maintained' },
    reconstruction_surgical: { name: 'Reconstructive Surgery', desc: 'Expert reconstructive procedures restoring function and form following trauma, disease, burns, or congenital conditions.', type: 'Surgical', options: ['Post-Burn Reconstruction', 'Trauma Reconstruction', 'Microsurgery & Flap Procedures', 'Congenital Deformity Correction', 'Cancer Reconstruction'], recovery: '4–12 Weeks', anaesthesia: 'General', duration: '3–12 Hours', longevity: 'Long-term' },
    reconstruction_nonsurgical: { name: 'Non-Surgical Scar Management', desc: 'Advanced non-surgical protocols for scar reduction, burn scar treatment, and post-surgical scar management.', type: 'Non-Surgical', options: ['Steroid Injections', 'Scar Gel Therapy', 'Silicone Sheeting', 'Compression Therapy'], recovery: '0 Days', anaesthesia: 'None', duration: '30–60 Min', longevity: 'Ongoing' },
    reconstruction_laser: { name: 'Laser Scar Treatments', desc: 'Laser resurfacing and vascular treatments specifically targeting traumatic scars, burn scars, and keloids.', type: 'Laser', options: ['Fractional Laser Scar', 'Vascular Laser (PDL)', 'CO2 Scar Revision', 'Ablative Resurfacing'], recovery: '7–14 Days', anaesthesia: 'Local/Topical', duration: '60–120 Min', longevity: 'Significant improvement' },
    reconstruction_combination: { name: 'Comprehensive Reconstruction', desc: 'Multi-stage reconstruction programmes combining surgery, laser, and non-surgical modalities for complete restoration.', type: 'Combination', options: ['Burn Rehabilitation Programme', 'Post-Trauma Full Restoration', 'Staged Reconstruction Plan', 'Cancer Recovery Programme'], recovery: 'Variable', anaesthesia: 'Variable', duration: 'Multi-stage', longevity: 'Permanent improvement' }
  };

  let selectedConcern = null, selectedTreatment = null;
  const panel1 = document.getElementById('selector-panel-1');
  const panel2 = document.getElementById('selector-panel-2');
  const panel3 = document.getElementById('selector-panel-3');
  const ind1 = document.getElementById('step-ind-1');
  const ind2 = document.getElementById('step-ind-2');
  const ind3 = document.getElementById('step-ind-3');
  const nextBtn1 = document.getElementById('step1-next');
  const nextBtn2 = document.getElementById('step2-next');

  function setActivePanel(num) {
    [panel1, panel2, panel3].forEach((p, i) => p.classList.toggle('active', i + 1 === num));
    [ind1, ind2, ind3].forEach((ind, i) => {
      ind.classList.remove('active', 'done');
      if (i + 1 === num) ind.classList.add('active');
      else if (i + 1 < num) ind.classList.add('done');
      const stepNum = ind.querySelector('.step-num');
      stepNum.textContent = i + 1 < num ? '✓' : i + 1;
    });
  }

  document.querySelectorAll('.concern-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.concern-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedConcern = card.dataset.concern;
      nextBtn1.disabled = false;
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
  });

  document.querySelectorAll('.treatment-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.treatment-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedTreatment = card.dataset.treatment;
      nextBtn2.disabled = false;
    });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') card.click(); });
  });

  nextBtn1.addEventListener('click', () => { if (selectedConcern) setActivePanel(2); });
  nextBtn2.addEventListener('click', () => {
    if (!selectedConcern || !selectedTreatment) return;
    const key = `${selectedConcern}_${selectedTreatment}`;
    const data = treatmentData[key] || treatmentData['face_surgical'];
    renderResult(data);
    setActivePanel(3);
  });

  document.getElementById('step2-back').addEventListener('click', () => setActivePanel(1));
  document.getElementById('step3-back').addEventListener('click', () => {
    selectedConcern = null; selectedTreatment = null;
    document.querySelectorAll('.concern-card,.treatment-card').forEach(c => c.classList.remove('selected'));
    nextBtn1.disabled = true; nextBtn2.disabled = true;
    setActivePanel(1);
  });

  function renderResult(data) {
    const rc = document.getElementById('result-card');
    rc.innerHTML = `
      <div class="result-header">
        <div>
          <h3 style="font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;margin-bottom:8px">${data.name}</h3>
          <p style="font-size:.9rem;color:var(--text-secondary);line-height:1.6">${data.desc}</p>
        </div>
        <span class="result-badge">${data.type}</span>
      </div>
      <div class="result-details-grid">
        <div class="result-detail"><div class="rd-label">Recovery</div><div class="rd-value">${data.recovery}</div></div>
        <div class="result-detail"><div class="rd-label">Anaesthesia</div><div class="rd-value">${data.anaesthesia}</div></div>
        <div class="result-detail"><div class="rd-label">Duration</div><div class="rd-value">${data.duration}</div></div>
        <div class="result-detail"><div class="rd-label">Longevity</div><div class="rd-value">${data.longevity}</div></div>
      </div>
      <div style="margin-bottom:28px">
        <div style="font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px">Available Procedures</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${data.options.map(o => `<span style="padding:6px 14px;background:rgba(255,255,255,.04);border:1px solid var(--border-glass);border-radius:var(--radius-full);font-size:.78rem;font-weight:600;color:var(--text-secondary)">${o}</span>`).join('')}
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="openModal()" aria-label="Book specialist consultation">
        ✦ Book Specialist Consultation for This Procedure
      </button>
    `;
  }
})();

// ─── PATIENT JOURNEY ────────────────────────────────────────
(function initJourney() {
  const details = [
    { icon: '🤝', title: 'Confidential Consultation', content: 'Your journey begins with a private, one-on-one consultation with our senior specialist. In a completely confidential and non-judgemental environment, you\'ll discuss your aesthetic goals, medical history, and any concerns. Our doctor will provide an honest assessment and recommend the most appropriate treatment path for your unique situation.', highlights: ['60-90 minute deep dive session', 'HIPAA-protected & fully confidential', '3D analysis of concern areas', 'Preliminary treatment plan provided'] },
    { icon: '🔮', title: '3D Virtual Simulation', content: 'Experience the future of surgical planning. Using advanced 3D imaging technology, we create a detailed digital model of your anatomy and simulate your potential post-procedure results. This allows you to see expected outcomes, refine your goals with your surgeon, and make a fully informed decision before any procedure begins.', highlights: ['Cutting-edge Vectra 3D imaging', 'Realistic outcome visualisation', 'Collaborative goal refinement', 'Full documentation provided'] },
    { icon: '⚕️', title: 'Precision Procedure', content: 'Your safety is our absolute priority. All procedures are performed at NABH-accredited Max Super Specialty Hospital facilities by our board-certified surgical team. We use the latest surgical techniques, medical-grade equipment, and the highest sterilisation standards to ensure optimal outcomes and safety.', highlights: ['NABH-accredited facilities', 'Board-certified surgical team', 'Latest anaesthesia techniques', 'Real-time surgical monitoring'] },
    { icon: '💎', title: 'Post-Op Aftercare', content: 'Our commitment to you extends far beyond the procedure. Our comprehensive aftercare programme includes scheduled follow-up consultations, dedicated wound care guidance, 24/7 patient helpline access, and ongoing monitoring until you achieve complete healing. We celebrate your transformation journey together.', highlights: ['24/7 patient helpline support', 'Scheduled follow-up consultations', 'Personalised recovery protocols', 'Long-term results maintenance guidance'] }
  ];

  const steps = document.querySelectorAll('.journey-step');
  const panel = document.getElementById('journey-detail-panel');

  steps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      const isAlreadyActive = step.classList.contains('active');
      steps.forEach(s => s.classList.remove('active'));
      panel.classList.remove('visible');
      if (!isAlreadyActive) {
        step.classList.add('active');
        const d = details[idx];
        panel.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start">
            <div>
              <div style="font-size:2.5rem;margin-bottom:16px" aria-hidden="true">${d.icon}</div>
              <h3 style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;margin-bottom:16px;color:var(--accent-gold)">${d.title}</h3>
              <p style="font-size:.95rem;color:var(--text-secondary);line-height:1.75">${d.content}</p>
            </div>
            <div>
              <div style="font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px">Key Highlights</div>
              <div style="display:flex;flex-direction:column;gap:12px">
                ${d.highlights.map(h => `<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;background:rgba(212,175,55,.08);border:1px solid var(--border-gold);border-radius:var(--radius-md);font-size:.88rem;font-weight:600"><span style="color:var(--accent-gold);flex-shrink:0" aria-hidden="true">✦</span>${h}</div>`).join('')}
              </div>
              <button class="btn btn-primary" style="width:100%;margin-top:24px" onclick="openModal()" aria-label="Book consultation">Book This Step →</button>
            </div>
          </div>
        `;
        setTimeout(() => panel.classList.add('visible'), 10);
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    step.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') step.click(); });
  });
})();

// ─── TESTIMONIALS CAROUSEL ──────────────────────────────────
(function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const wrap = document.getElementById('testimonials-wrap');
  const prevBtn = document.getElementById('tc-prev');
  const nextBtn = document.getElementById('tc-next');
  const dots = document.querySelectorAll('.tc-dot');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const cardWidth = () => cards[0].offsetWidth + 24; // gap
  let currentIndex = 0;
  let isDragging = false, startX = 0, currentX = 0;

  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex % dots.length));
  }

  function goTo(idx) {
    const maxIdx = cards.length - 1;
    currentIndex = Math.max(0, Math.min(idx, maxIdx));
    track.style.transform = `translateX(-${currentIndex * cardWidth()}px)`;
    updateDots();
  }

  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Drag / swipe
  wrap.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; track.style.transition = 'none'; });
  wrap.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].clientX; track.style.transition = 'none'; }, { passive: true });
  wrap.addEventListener('mousemove', e => { if (!isDragging) return; currentX = e.clientX - startX; track.style.transform = `translateX(${-currentIndex * cardWidth() + currentX}px)`; });
  wrap.addEventListener('touchmove', e => { if (!isDragging) return; currentX = e.touches[0].clientX - startX; track.style.transform = `translateX(${-currentIndex * cardWidth() + currentX}px)`; }, { passive: true });
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';
    if (currentX < -60) goTo(currentIndex + 1);
    else if (currentX > 60) goTo(currentIndex - 1);
    else goTo(currentIndex);
    currentX = 0;
  };
  wrap.addEventListener('mouseup', endDrag);
  wrap.addEventListener('touchend', endDrag);

  // Auto-scroll
  let autoTimer = setInterval(() => goTo(currentIndex + 1 > cards.length - 1 ? 0 : currentIndex + 1), 5000);
  wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
  wrap.addEventListener('mouseleave', () => { autoTimer = setInterval(() => goTo(currentIndex + 1 > cards.length - 1 ? 0 : currentIndex + 1), 5000); });
})();

// ─── MODAL ──────────────────────────────────────────────────
const modal = document.getElementById('booking-modal');
const modalClose = document.getElementById('modal-close');
const bookingForm = document.getElementById('booking-form');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('field-name').focus();
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// All book buttons
['nav-book-btn', 'hero-book-btn', 'mobile-book-btn'].forEach(id => {
  document.getElementById(id)?.addEventListener('click', openModal);
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// File Upload
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('field-photo');
const uploadNote = document.getElementById('upload-note');

uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault(); uploadArea.classList.remove('drag-over');
  if (e.dataTransfer.files[0]) { fileInput.files = e.dataTransfer.files; uploadNote.textContent = `✓ ${e.dataTransfer.files[0].name} selected`; }
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) uploadNote.textContent = `✓ ${fileInput.files[0].name} selected`;
});

// ─── FORM VALIDATION ────────────────────────────────────────
function setFieldState(id, valid, errId) {
  const field = document.getElementById(id);
  const err = document.getElementById(errId);
  field.classList.toggle('valid', valid);
  field.classList.toggle('error', !valid);
  err.classList.toggle('visible', !valid);
  return valid;
}

function validateForm() {
  const name = document.getElementById('field-name').value.trim();
  const phone = document.getElementById('field-phone').value.trim();
  const email = document.getElementById('field-email').value.trim();
  const treatment = document.getElementById('field-treatment').value;

  const nameOk = setFieldState('field-name', name.length >= 2, 'err-name');
  const phoneOk = setFieldState('field-phone', /^[\+]?[\d\s\-]{10,15}$/.test(phone), 'err-phone');
  const emailOk = setFieldState('field-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'err-email');
  const treatOk = setFieldState('field-treatment', !!treatment, 'err-treatment');

  return nameOk && phoneOk && emailOk && treatOk;
}

// Real-time validation
['field-name', 'field-phone', 'field-email', 'field-treatment'].forEach(id => {
  document.getElementById(id)?.addEventListener('blur', validateForm);
  document.getElementById(id)?.addEventListener('input', () => {
    const el = document.getElementById(id);
    if (el.classList.contains('error')) validateForm();
  });
});

document.getElementById('form-submit-btn').addEventListener('click', () => {
  if (validateForm()) {
    closeModal();
    showToast('success', '🎉 Consultation Requested!', 'Our specialist coordinator will call you within 2 hours to confirm your appointment.');
    bookingForm.reset();
    document.querySelectorAll('.form-input,.form-select,.form-textarea').forEach(el => el.classList.remove('valid', 'error'));
    uploadNote.textContent = 'JPG, PNG, WEBP up to 10MB · Strictly confidential';
  } else {
    showToast('error', '⚠️ Please check your details', 'Some required fields need attention. Please review and try again.');
  }
});

// ─── TOAST ──────────────────────────────────────────────────
function showToast(type, title, msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-icon').textContent = type === 'success' ? '✅' : '⚠️';
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-msg').textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}
document.getElementById('toast-close').addEventListener('click', () => document.getElementById('toast').classList.remove('show'));
document.getElementById('toast-close').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('toast').classList.remove('show'); });

// ─── SMOOTH SCROLL ──────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

console.log('%c THE AESTHETIC ', 'background:#D4AF37;color:#0B0F17;font-size:14px;font-weight:800;padding:6px 14px;border-radius:4px');
console.log('%c Premium Plastic & Cosmetic Surgery — Delhi NCR ', 'color:#D4AF37;font-size:11px');
