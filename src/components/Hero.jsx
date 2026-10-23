import { useRef, useState } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import SplitText from '../bits/SplitText.jsx';
import RotatingText from '../bits/RotatingText.jsx';
import Magnet from '../bits/Magnet.jsx';
import CountUp from '../bits/CountUp.jsx';
import Icon from './Icon.jsx';
import { MENU } from '../data/menu.js';

const CRAVINGS = ['pizza', 'ramen', 'biryani', 'tacos', 'dessert', 'boba'];
const FLOATERS = [
  { e: '🍕', x: 30, y: 26, s: 96, d: 1.2 }, { e: '🍜', x: 4, y: 56, s: 66, d: 0.7 }, { e: '🍔', x: 70, y: 10, s: 62, d: 1.5 },
  { e: '🌮', x: 68, y: 62, s: 78, d: 0.9 }, { e: '🍰', x: 40, y: 78, s: 58, d: 1.8 }, { e: '🧋', x: 8, y: 16, s: 50, d: 1.1 },
  { e: '🍛', x: 84, y: 38, s: 54, d: 0.6 },
];

export default function Hero({ onSearch, onSurprise }) {
  const root = useRef(null);
  const [q, setQ] = useState('');

  useGSAP(() => {
    if (reducedMotion()) return;
    // the plate spins and drifts as you scroll away
    gsap.to('.plate-ring', { rotation: 220, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.stage', { yPercent: 18, scale: 0.86, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    // floating food: idle bobbing + parallax depth on scroll
    gsap.utils.toArray('.floater').forEach((el, i) => {
      gsap.to(el, { y: -16, rotation: i % 2 ? 8 : -8, duration: 2.2 + (i % 3) * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.2 });
      gsap.to(el.firstChild, { yPercent: -60 * (0.4 + (i % 3) * 0.3), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.from('.floater', { scale: 0, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'back.out(2)', delay: 0.3 });
    gsap.from('.hero-copy > *:not(h1)', { y: 24, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', delay: 0.4 });
    // the floaters lean towards the pointer
    const stage = root.current.querySelector('.stage');
    const moves = gsap.utils.toArray('.floater').map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 0.8 }), k: 10 + Math.random() * 18 }));
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      moves.forEach((m) => { m.x(nx * m.k); });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, { scope: root });

  return (
    <header className="hero wrap" id="top" ref={root}>
      <div className="hero-copy">
        <span className="pill"><Icon name="bike" size={16} /> Hot food in about 25 minutes</span>
        <h1>
          <SplitText text="What are you craving" tag="span" splitType="words" effect="rise" delay={70} duration={1} textAlign="left" className="h1-line" />
          <span className="h1-rot">
            <RotatingText texts={CRAVINGS} mainClassName="rot" rotationInterval={2200} staggerDuration={0.025} staggerFrom="last" splitBy="characters" />
            <span className="qmark">?</span>
          </span>
        </h1>
        <p className="sub">Pizza, ramen, biryani, tacos and dessert from kitchens you'll love. Build your dish exactly how you like it, then watch it ride to your door.</p>
        <form className="search" onSubmit={(e) => { e.preventDefault(); onSearch(q); }} role="search">
          <Icon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pizza, ramen, dessert…" aria-label="Search the menu" />
          <button className="btn" type="submit">Find food</button>
        </form>
        <div className="hero-ctas">
          <Magnet padding={50} magnetStrength={3}>
            <button className="btn btn-ghost" onClick={onSurprise}><Icon name="dice" /> Surprise me</button>
          </Magnet>
          <a className="link" href="#menu">Browse the full menu <Icon name="arrow" size={16} /></a>
        </div>
        <dl className="stats">
          <div><dt><CountUp to={MENU.length} duration={1.4} /></dt><dd>dishes</dd></div>
          <div><dt><CountUp to={25} duration={1.4} /> min</dt><dd>avg delivery</dd></div>
          <div><dt><CountUp to={4.7} decimals={1} duration={1.4} />★</dt><dd>avg rating</dd></div>
        </dl>
      </div>
      <div className="stage" aria-hidden="true">
        <div className="plate-ring" />
        <div className="plate" />
        {FLOATERS.map((f) => (
          <span key={f.e} className="floater" style={{ left: `${f.x}%`, top: `${f.y}%`, fontSize: f.s }}><span>{f.e}</span></span>
        ))}
      </div>
    </header>
  );
}
