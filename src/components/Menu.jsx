import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap, Flip, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion.js';
import { CATEGORIES, MENU } from '../data/menu.js';
import { useStore } from '../state/store.jsx';
import DishCard from './DishCard.jsx';
import Icon from './Icon.jsx';

const SORTS = { pop: 'Most popular', rating: 'Top rated', low: 'Price: low to high', high: 'Price: high to low', fast: 'Fastest' };

export default function Menu({ filters, setFilters, onOpen, onQuickAdd }) {
  const { favs } = useStore();
  const root = useRef(null);
  const flip = useRef(null);
  const { q, cat, veg, sort } = filters;

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const L = MENU.filter((m) =>
      (cat === 'All' || (cat === 'Favorites' ? favs.includes(m.id) : m.category === cat)) &&
      (!veg || m.veg) &&
      (!term || `${m.name} ${m.desc} ${m.category}`.toLowerCase().includes(term)));
    const by = {
      pop: (a, b) => b.popular - a.popular || b.rating - a.rating,
      rating: (a, b) => b.rating - a.rating,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      fast: (a, b) => a.time - b.time,
    }[sort];
    return L.sort(by);
  }, [q, cat, veg, sort, favs]);

  // Capture card positions before a filter change so Flip can glide them to their new spots.
  const change = (patch) => {
    if (!reducedMotion()) flip.current = Flip.getState(root.current.querySelectorAll('.dish'));
    setFilters((f) => ({ ...f, ...patch }));
  };

  useLayoutEffect(() => {
    if (!flip.current) return;
    Flip.from(flip.current, {
      targets: root.current.querySelectorAll('.dish'),
      duration: 0.55, ease: 'power3.inOut', absolute: true, scale: true, nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.03 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    flip.current = null;
  }, [list]);

  useGSAP(() => {
    if (reducedMotion()) return;
    ScrollTrigger.batch('.dish', {
      start: 'top 92%', once: true,
      onEnter: (els) => gsap.fromTo(els, { y: 60, opacity: 0, rotateX: -12 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.07, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity' }),
    });
  }, { scope: root });

  return (
    <section className="menu wrap" id="menu" ref={root}>
      <p className="kicker">The menu</p>
      <h2 className="section-title">Everything, made to order.</h2>
      <div className="filters">
        <div className="chips" role="tablist" aria-label="Categories">
          {['All', ...CATEGORIES, 'Favorites'].map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => change({ cat: c })}>
              {c === 'Favorites' ? <><Icon name="heart" size={14} filled /> Favorites</> : c}
            </button>
          ))}
        </div>
        <div className="tools">
          <label className="search small"><Icon name="search" size={16} /><input value={q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} placeholder="Search the menu" aria-label="Search the menu" /></label>
          <label className="switch"><input type="checkbox" checked={veg} onChange={(e) => change({ veg: e.target.checked })} /><span className="track"><i /></span><Icon name="leaf" size={16} /> Veg only</label>
          <select value={sort} onChange={(e) => change({ sort: e.target.value })} aria-label="Sort dishes">
            {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <span className="count" aria-live="polite">{list.length} dishes</span>
        </div>
      </div>
      <div className="grid">
        {list.map((m) => <DishCard key={m.id} dish={m} onOpen={onOpen} onQuickAdd={onQuickAdd} />)}
        {!list.length && (
          <p className="empty">{cat === 'Favorites' ? 'No favorites yet. Tap the heart on any dish to save it here.' : 'No dishes match. Try another search or clear the filters.'}</p>
        )}
      </div>
    </section>
  );
}
