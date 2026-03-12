const prefersReducedMotion =
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const canvas = document.getElementById("bg");
const ctx = canvas?.getContext?.("2d");

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const { innerWidth: w, innerHeight: h } = window;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const particles = [];
let mouse = { x: 0, y: 0, has: false };

function seedParticles() {
  particles.length = 0;
  const count = Math.floor(Math.min(120, Math.max(55, window.innerWidth / 18)));
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 0.6 + Math.random() * 1.8,
      vx: -0.15 + Math.random() * 0.3,
      vy: -0.12 + Math.random() * 0.24,
      a: 0.12 + Math.random() * 0.22,
    });
  }
}

function draw() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const gx = mouse.has ? (mouse.x - window.innerWidth / 2) * 0.00035 : 0;
  const gy = mouse.has ? (mouse.y - window.innerHeight / 2) * 0.00035 : 0;

  for (const p of particles) {
    p.x += p.vx + gx * 40 * p.a;
    p.y += p.vy + gy * 40 * p.a;

    if (p.x < -20) p.x = window.innerWidth + 20;
    if (p.x > window.innerWidth + 20) p.x = -20;
    if (p.y < -20) p.y = window.innerHeight + 20;
    if (p.y > window.innerHeight + 20) p.y = -20;

    const alpha = p.a * (0.55 + 0.45 * Math.sin((p.x + p.y) * 0.004));
    ctx.beginPath();
    ctx.fillStyle = `rgba(248, 249, 252, ${clamp01(alpha)})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

function setupOrbParallax() {
  const orbs = document.querySelector(".orbs");
  if (!orbs) return;

  function onMove(e) {
    mouse = { x: e.clientX, y: e.clientY, has: true };
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    orbs.style.setProperty("--px", String(nx));
    orbs.style.setProperty("--py", String(ny));
  }

  function onLeave() {
    mouse.has = false;
    orbs.style.setProperty("--px", "0");
    orbs.style.setProperty("--py", "0");
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });
}

resizeCanvas();
seedParticles();
setupOrbParallax();

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

if (!prefersReducedMotion) {
  draw();
} else if (ctx) {
  // Draw a static frame for reduced-motion users.
  for (const p of particles) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(248, 249, 252, 0.10)";
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

