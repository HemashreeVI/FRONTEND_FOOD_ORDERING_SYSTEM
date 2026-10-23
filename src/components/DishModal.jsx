import { useState } from 'react';
import { GRADIENTS, SIZES, EXTRAS, dishById } from '../data/menu.js';
import { money, unitPrice } from '../lib/pricing.js';
import { useStore } from '../state/store.jsx';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';

export default function DishModal({ id, onClose, onAdd }) {
  const dish = id ? dishById(id) : null;
  return (
    <Sheet open={!!dish} onClose={onClose} label={dish ? `Customize ${dish.name}` : ''} className="dish-modal">
      {dish && <Customizer key={dish.id} dish={dish} onClose={onClose} onAdd={onAdd} />}
    </Sheet>
  );
}

function Customizer({ dish, onClose, onAdd }) {
  const { ratings } = useStore();
  const [size, setSize] = useState(0);
  const [extras, setExtras] = useState([]);
  const [qty, setQty] = useState(1);
  const unit = unitPrice(dish, size, extras);
  const [g1, g2] = GRADIENTS[dish.category];
  const toggle = (i) => setExtras((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]));
  const mine = ratings[dish.id];

  return (
    <>
      <div className="mh" style={{ background: `linear-gradient(135deg, ${g1}, ${g2})` }}>
        <span className="mh-emoji" aria-hidden="true">{dish.emoji}</span>
        <button className="ib close" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
      </div>
      <div className="mb">
        <h2>{dish.name} <i className={`vd ${dish.veg ? 'v' : 'nv'}`} title={dish.veg ? 'Vegetarian' : 'Non-vegetarian'} /></h2>
        <p className="muted">{dish.desc}</p>
        <div className="meta big">
          <span><Icon name="star" size={15} filled /> {dish.rating}</span>
          <span><Icon name="clock" size={15} /> {dish.time} min</span>
          <span>{dish.spice ? '🌶️'.repeat(dish.spice) : 'Mild'}</span>
          <span>{dish.kcal} kcal</span>
        </div>
        {mine && <p className="mine-note">You rated this {'★'.repeat(mine.stars)}{mine.note ? `: “${mine.note}”` : ''}</p>}
        <h4>Size</h4>
        <div className="opts">
          {SIZES.map((s, i) => (
            <button key={s.name} className={`chip ${i === size ? 'on' : ''}`} aria-pressed={i === size} onClick={() => setSize(i)}>
              {s.name}{s.add ? ` +${money(s.add)}` : ''}
            </button>
          ))}
        </div>
        <h4>Extras</h4>
        <div className="opts">
          {EXTRAS.map((x, i) => (
            <button key={x.name} className={`chip ${extras.includes(i) ? 'on' : ''}`} aria-pressed={extras.includes(i)} onClick={() => toggle(i)}>
              {extras.includes(i) && <Icon name="check" size={14} />} {x.name} +{money(x.add)}
            </button>
          ))}
        </div>
        <div className="mf">
          <div className="qty">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="One less"><Icon name="minus" size={16} /></button>
            <b aria-live="polite">{qty}</b>
            <button onClick={() => setQty((q) => q + 1)} aria-label="One more"><Icon name="plus" size={16} /></button>
          </div>
          <button className="btn grow" onClick={(e) => onAdd(dish, size, extras, qty, e.currentTarget)}>
            Add to cart · {money(unit * qty)}
          </button>
        </div>
      </div>
    </>
  );
}
