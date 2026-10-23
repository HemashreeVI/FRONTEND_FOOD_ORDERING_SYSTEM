import { useRef } from 'react';
import { gsap, reducedMotion } from '../lib/motion.js';
import { GRADIENTS } from '../data/menu.js';
import { money } from '../lib/pricing.js';
import { useStore } from '../state/store.jsx';
import Icon from './Icon.jsx';

export default function DishCard({ dish, onOpen, onQuickAdd }) {
  const { favs, ratings, dispatch } = useStore();
  const card = useRef(null);
  const tilt = useRef(null);
  const fav = favs.includes(dish.id);
  const mine = ratings[dish.id];
  const [g1, g2] = GRADIENTS[dish.category];

  // gentle 3D tilt that follows the pointer
  const onMove = (e) => {
    if (reducedMotion() || e.pointerType !== 'mouse') return;
    if (!tilt.current) {
      tilt.current = {
        rx: gsap.quickTo(card.current, 'rotationX', { duration: 0.5, ease: 'power3' }),
        ry: gsap.quickTo(card.current, 'rotationY', { duration: 0.5, ease: 'power3' }),
      };
      gsap.set(card.current, { transformPerspective: 900 });
    }
    const r = card.current.getBoundingClientRect();
    tilt.current.ry(((e.clientX - r.left) / r.width - 0.5) * 10);
    tilt.current.rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  const onLeave = () => tilt.current && (tilt.current.rx(0), tilt.current.ry(0));

  const heart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'fav', id: dish.id });
    if (!fav && !reducedMotion()) gsap.fromTo(e.currentTarget, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' });
  };

  return (
    <article className="dish" data-flip-id={dish.id} ref={card} onPointerMove={onMove} onPointerLeave={onLeave}>
      <button className="dish-hit" onClick={() => onOpen(dish.id)} aria-label={`Customize ${dish.name}`} />
      <div className="dish-pic" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
        <span className="dish-emoji" aria-hidden="true">{dish.emoji}</span>
        {dish.popular && <span className="tag"><Icon name="flame" size={13} /> Popular</span>}
        <button className={`heart ${fav ? 'on' : ''}`} onClick={heart} aria-pressed={fav} aria-label={`${fav ? 'Remove' : 'Add'} ${dish.name} ${fav ? 'from' : 'to'} favorites`}>
          <Icon name="heart" filled={fav} size={18} />
        </button>
      </div>
      <div className="dish-info">
        <h3>{dish.name}<i className={`vd ${dish.veg ? 'v' : 'nv'}`} title={dish.veg ? 'Vegetarian' : 'Non-vegetarian'} /></h3>
        <p>{dish.desc}</p>
        <div className="meta">
          <span><Icon name="star" size={14} filled /> {dish.rating}</span>
          <span><Icon name="clock" size={14} /> {dish.time} min</span>
          <span>{dish.spice ? '🌶️'.repeat(dish.spice) : 'Mild'}</span>
          {mine && <span className="mine" title="Your rating">You: {'★'.repeat(mine.stars)}</span>}
        </div>
        <div className="dish-foot">
          <strong>{money(dish.price)}</strong>
          <button className="add" onClick={(e) => { e.stopPropagation(); onQuickAdd(dish, e.currentTarget); }} aria-label={`Add ${dish.name} to cart`}>
            <Icon name="plus" size={22} />
          </button>
        </div>
      </div>
    </article>
  );
}
