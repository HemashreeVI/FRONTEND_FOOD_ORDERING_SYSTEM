import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import Icon from './Icon.jsx';

const STEPS = [
  { icon: 'search', title: 'Pick your craving', text: 'Search, filter by veg or spice, or let “Surprise me” decide. Heart the ones you love.' },
  { icon: 'chef', title: 'Make it yours', text: 'Choose a size, add extras, and watch the price update live before it hits your cart.' },
  { icon: 'bike', title: 'Track it to your door', text: 'Follow your rider on a live map, from the kitchen to your doorstep.' },
];

// The road the scooter follows (SVG coordinates).
const ROAD = 'M60 300 C 140 300, 150 170, 250 170 S 360 300, 450 250 S 560 80, 650 110';

/** Pinned scrollytelling: as you scroll, the scooter rides the road and each step lights up. */
export default function HowItWorks() {
  const root = useRef(null);
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const road = q('.road-done')[0];
    const len = road.getTotalLength();
    gsap.set(road, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(q('.scooter'), { x: 60, y: 300 });
    if (reducedMotion()) {
      gsap.set(road, { strokeDashoffset: 0 });
      gsap.set(q('.how-step'), { opacity: 1 });
      return;
    }
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: root.current, start: 'top top', end: '+=180%', pin: true, scrub: 0.8 },
    });
    tl.to(road, { strokeDashoffset: 0, duration: 3 }, 0)
      .to(q('.scooter'), { duration: 3, motionPath: { path: ROAD } }, 0);
    q('.how-step').forEach((el, i) => {
      tl.fromTo(el, { opacity: 0.25, x: 0 }, { opacity: 1, x: 10, duration: 0.3, ease: 'power2.out' }, i)
        .to(q('.pin-stop')[i], { scale: 1.35, fill: 'var(--a)', duration: 0.3, transformOrigin: '50% 50%' }, i);
      if (i < 2) tl.to(el, { opacity: 0.45, x: 0, duration: 0.3 }, i + 0.8);
    });
    tl.to(q('.home-pin'), { y: -10, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }, 2.8);
  }, { scope: root });

  return (
    <section className="how" id="how" ref={root}>
      <div className="wrap how-grid">
        <div>
          <p className="kicker">How it works</p>
          <h2 className="section-title">From craving to doorstep in three moves.</h2>
          <ol className="how-steps">
            {STEPS.map((s, i) => (
              <li className="how-step" key={s.title}>
                <span className="how-ico"><Icon name={s.icon} size={22} /></span>
                <div><b><small>0{i + 1}</small> {s.title}</b><p>{s.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
        <div className="map-card" aria-hidden="true">
          <svg viewBox="0 0 700 380" className="map">
            <defs>
              <pattern id="blocks" width="70" height="70" patternUnits="userSpaceOnUse">
                <rect width="70" height="70" fill="none" stroke="var(--ln)" strokeWidth="2" />
              </pattern>
            </defs>
            <rect width="700" height="380" fill="url(#blocks)" rx="24" />
            <circle cx="560" cy="300" r="46" fill="color-mix(in srgb, var(--c) 22%, transparent)" />
            <circle cx="140" cy="90" r="34" fill="color-mix(in srgb, var(--b) 22%, transparent)" />
            <path d={ROAD} fill="none" stroke="var(--ln)" strokeWidth="22" strokeLinecap="round" />
            <path d={ROAD} fill="none" stroke="var(--card)" strokeWidth="2" strokeDasharray="10 12" />
            <path className="road-done" d={ROAD} fill="none" stroke="var(--a)" strokeWidth="8" strokeLinecap="round" />
            {[[60, 300], [250, 170], [650, 110]].map(([x, y], i) => <circle key={i} className="pin-stop" cx={x} cy={y} r="11" fill="var(--card)" stroke="var(--a)" strokeWidth="4" />)}
            <text x="60" y="352" textAnchor="middle" fontSize="40">🏪</text>
            <g className="home-pin"><text x="650" y="78" textAnchor="middle" fontSize="44">🏠</text></g>
            <text className="scooter" x="0" y="0" fontSize="46" textAnchor="middle" dominantBaseline="central">🛵</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
