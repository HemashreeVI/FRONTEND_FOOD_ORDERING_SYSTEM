import { useState } from 'react';
import { dishById, SIZES, EXTRAS } from '../data/menu.js';
import { money, promoError, PROMOS, FREE_DELIVERY_AT } from '../lib/pricing.js';
import { useStore } from '../state/store.jsx';
import { toast } from '../lib/fx.js';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';

export default function CartDrawer({ open, onClose, onCheckout }) {
  const { cart, mode, tip, promo, totals: t, dispatch } = useStore();
  const [code, setCode] = useState('');

  const apply = (e) => {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    const err = promoError(c, t.sub);
    if (err) return toast(err);
    dispatch({ type: 'promo', code: c });
    setCode('');
    toast(`Promo ${c} applied 🎉`);
  };

  return (
    <Sheet open={open} onClose={onClose} kind="drawer" label="Your cart">
      <div className="dh">
        <h2>Your cart</h2>
        <button className="ib" onClick={onClose} aria-label="Close cart"><Icon name="x" /></button>
      </div>
      <div className="seg" role="radiogroup" aria-label="Delivery or pickup">
        {[['delivery', 'bike', 'Delivery'], ['pickup', 'store', 'Pickup']].map(([m, ic, label]) => (
          <button key={m} role="radio" aria-checked={mode === m} className={mode === m ? 'on' : ''} onClick={() => dispatch({ type: 'mode', mode: m })}>
            <Icon name={ic} size={16} /> {label}
          </button>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="fb">
          {mode === 'pickup' ? <><Icon name="store" size={15} /> No delivery fee when you pick up</> :
            t.ship === 0 ? <><Icon name="sparkle" size={15} /> Free delivery unlocked</> :
              <>Add <b>{money(t.toFree)}</b> more for free delivery<div className="bar"><i style={{ width: `${Math.min(100, (t.net / FREE_DELIVERY_AT) * 100)}%` }} /></div></>}
        </div>
      )}
      <div className="items">
        {cart.length === 0 && <div className="empty"><span className="empty-emoji">🛒</span>Your cart is empty.<br />Pick something delicious from the menu.</div>}
        {cart.map((l) => {
          const d = dishById(l.id);
          return (
            <div className="ci" key={l.key}>
              <span className="ci-emoji" aria-hidden="true">{d.emoji}</span>
              <div className="ci-main">
                <b>{d.name}</b>
                <small>{SIZES[l.size].name}{l.extras.map((i) => ` + ${EXTRAS[i].name}`).join('')}</small>
                <div className="qty">
                  <button onClick={() => dispatch({ type: 'qty', key: l.key, by: -1 })} aria-label={`One less ${d.name}`}><Icon name="minus" size={14} /></button>
                  <b>{l.qty}</b>
                  <button onClick={() => dispatch({ type: 'qty', key: l.key, by: 1 })} aria-label={`One more ${d.name}`}><Icon name="plus" size={14} /></button>
                </div>
              </div>
              <div className="ci-side">
                <b>{money(l.unit * l.qty)}</b>
                <button className="rm" onClick={() => dispatch({ type: 'remove', key: l.key })} aria-label={`Remove ${d.name}`}><Icon name="trash" size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="df">
        <form className="row" onSubmit={apply}>
          <label className="search small grow"><Icon name="tag" size={16} /><input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" list="promo-hints" /></label>
          <datalist id="promo-hints">{Object.keys(PROMOS).map((k) => <option key={k} value={k} />)}</datalist>
          <button className="apply" type="submit">Apply</button>
        </form>
        <div className="row tips" role="radiogroup" aria-label="Tip">
          {[0, 10, 15, 20].map((p) => (
            <button key={p} role="radio" aria-checked={tip === p} className={`chip ${tip === p ? 'on' : ''}`} onClick={() => dispatch({ type: 'tip', tip: p })}>{p ? `${p}%` : 'No tip'}</button>
          ))}
        </div>
        <dl className="totals">
          <div><dt>Subtotal</dt><dd>{money(t.sub)}</dd></div>
          {t.disc > 0 && <div className="good"><dt>Promo {promo}</dt><dd>−{money(t.disc)}</dd></div>}
          <div><dt>Delivery</dt><dd>{t.ship ? money(t.ship) : 'Free'}</dd></div>
          <div><dt>Tax (8%)</dt><dd>{money(t.tax)}</dd></div>
          <div><dt>Tip</dt><dd>{money(t.tip)}</dd></div>
          <div className="tot"><dt>Total</dt><dd>{money(t.total)}</dd></div>
        </dl>
        <button className="btn wide" disabled={!cart.length} onClick={onCheckout}>
          {cart.length ? <>Checkout · {money(t.total)} <Icon name="arrow" /></> : 'Checkout'}
        </button>
      </div>
    </Sheet>
  );
}
