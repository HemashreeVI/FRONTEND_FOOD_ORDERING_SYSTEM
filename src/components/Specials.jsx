import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { MENU, GRADIENTS } from '../data/menu.js';
import { money } from '../lib/pricing.js';
import Icon from './Icon.jsx';

/** Pinned horizontal rail of popular dishes; cards swing in like a carousel as you scroll. */
export default function Specials({ onOpen, onQuickAdd }) {
  const root = useRef(null);
  const track = useRef(null);
  const picks = MENU.filter((m) => m.popular).sort((a, b) => b.rating - a.rating).slice(0, 8);

  useGSAP(() => {
    if (reducedMotion() || window.innerWidth < 760) {
      gsap.utils.toArray('.special').forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));
      return;
    }
    const el = track.current;
    const distance = () => el.scrollWidth - window.innerWidth + 64;
    const slide = gsap.to(el, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: { trigger: root.current, pin: true, start: 'top top', end: () => '+=' + distance(), scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => gsap.set('.specials-progress i', { scaleX: self.progress }) },
    });
    gsap.utils.toArray('.special').forEach((card) => {
      gsap.fromTo(card, { rotateY: -24, rotateZ: 3, scale: 0.88 }, {
        rotateY: 0, rotateZ: 0, scale: 1, ease: 'none',
        scrollTrigger: { containerAnimation: slide, trigger: card, start: 'left right', end: 'center 60%', scrub: true },
      });
      gsap.fromTo(card.querySelector('.special-emoji'), { rotation: -40, scale: 0.6 }, {
        rotation: 0, scale: 1, ease: 'none',
        scrollTrigger: { containerAnimation: slide, trigger: card, start: 'left right', end: 'center center', scrub: true },
      });
    });
  }, { scope: root });

  return (
    <section className="specials" id="specials" ref={root}>
      <div className="wrap specials-head">
        <div>
          <p className="kicker">Today's specials</p>
          <h2 className="section-title">The dishes everyone's ordering.</h2>
        </div>
        <div className="specials-progress" aria-hidden="true"><i /></div>
      </div>
      <div className="specials-track" ref={track}>
        {picks.map((m, i) => (
          <article key={m.id} className="special" style={{ '--g1': GRADIENTS[m.category][0], '--g2': GRADIENTS[m.category][1] }}>
            <button className="special-hit" onClick={() => onOpen(m.id)} aria-label={`Customize ${m.name}`} />
            <span className="special-rank">#{i + 1}</span>
            <span className="special-emoji" aria-hidden="true">{m.emoji}</span>
            <div className="special-info">
              <span className="special-cat">{m.category}</span>
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
              <div className="special-row">
                <span><Icon name="star" size={15} filled /> {m.rating}</span>
                <span><Icon name="clock" size={15} /> {m.time} min</span>
                <strong>{money(m.price)}</strong>
                <button className="add" onClick={(e) => onQuickAdd(m, e.currentTarget)} aria-label={`Add ${m.name} to cart`}><Icon name="plus" size={22} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
