import { gsap, reducedMotion } from './motion.js';

/** Fly a copy of the dish emoji from the clicked element into the cart button. */
export function flyToCart(fromEl, emoji) {
  const cart = document.querySelector('[data-cart-target]');
  if (!fromEl || !cart || reducedMotion()) return;
  const a = fromEl.getBoundingClientRect();
  const b = cart.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'fly';
  el.textContent = emoji;
  document.body.appendChild(el);
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
  const x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
  gsap.set(el, { x: x0, y: y0, xPercent: -50, yPercent: -50 });
  gsap.timeline({ onComplete: () => el.remove() })
    .to(el, { duration: 0.75, ease: 'power1.inOut', motionPath: { path: [{ x: x0, y: y0 }, { x: (x0 + x1) / 2, y: Math.min(y0, y1) - 140 }, { x: x1, y: y1 }], curviness: 1.4 }, rotation: 360, scale: 0.45 })
    .to(el, { opacity: 0, duration: 0.15 }, '-=0.12');
  gsap.fromTo(cart, { scale: 1 }, { scale: 1.18, duration: 0.18, yoyo: true, repeat: 1, delay: 0.6, ease: 'power2.out' });
}

/** Food confetti for the "delivered" moment. */
export function confetti(n = 46) {
  if (reducedMotion()) return;
  const bits = ['🎉', '🍕', '⭐', '🍓', '✨', '🌮', '🍩'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'cf';
    s.textContent = bits[i % bits.length];
    document.body.appendChild(s);
    gsap.fromTo(s,
      { x: window.innerWidth / 2, y: window.innerHeight * 0.55, scale: 0.4, rotation: 0 },
      {
        x: `+=${gsap.utils.random(-window.innerWidth / 2, window.innerWidth / 2)}`,
        y: `-=${gsap.utils.random(200, window.innerHeight * 0.7)}`,
        scale: gsap.utils.random(0.8, 1.6), rotation: gsap.utils.random(-540, 540),
        duration: gsap.utils.random(0.8, 1.2), ease: 'power3.out',
      })
      .then(() => gsap.to(s, { y: `+=${window.innerHeight}`, opacity: 0, duration: gsap.utils.random(1.2, 2), ease: 'power1.in', onComplete: () => s.remove() }));
  }
}

let toastTimer;
export function toast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2000);
}
