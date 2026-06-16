
// Cursor
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animateCursor() {
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

// Nav
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal + language bars
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // animate language bars
      e.target.querySelectorAll && e.target.querySelectorAll('.lang-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .timeline-item, .lang-card').forEach(el => observer.observe(el));

// Stagger timeline
document.querySelectorAll('.timeline-item').forEach((el, i) => { el.style.transitionDelay = (i * 0.15) + 's'; });

// Tab switcher
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    // update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // update panels
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + target).classList.add('active');
    // re-trigger reveal on newly shown cards
    document.querySelectorAll('#tab-' + target + ' .reveal').forEach(el => {
      el.classList.remove('visible');
      void el.offsetHeight; // reflow
      observer.observe(el);
    });
  });
});

// Canvas particles
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  const PARTICLES = [];
  const COUNT = 75;
  const C1 = [0,255,195], C2 = [123,94,167];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.z = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.c = Math.random() > 0.6 ? C1 : C2;
      this.a = Math.random() * 0.45 + 0.1;
    }
    update() {
      this.x += this.vx * this.z; this.y += this.vy * this.z;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * this.z, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c.join(',')},${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) PARTICLES.push(new P());

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255,255,255,0.018)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  }

  function drawLines() {
    for (let i = 0; i < PARTICLES.length; i++) {
      for (let j = i + 1; j < PARTICLES.length; j++) {
        const dx = PARTICLES[i].x - PARTICLES[j].x, dy = PARTICLES[i].y - PARTICLES[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
          ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
          ctx.strokeStyle = `rgba(0,255,195,${(1 - d/120) * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  (function animate() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawLines();
    PARTICLES.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  })();
})();