import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { dishById } from '../data/menu.js';
import { money } from '../lib/pricing.js';
import { progress, stages, STEP_MS } from '../lib/orders.js';
import { confetti } from '../lib/fx.js';
import { useStore } from '../state/store.jsx';
import useNow from '../hooks/useNow.js';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';

const ROUTE = 'M70 250 C 120 250, 140 150, 220 150 S 300 60, 380 90 S 470 210, 540 170';

export default function Tracker({ orderId, onClose }) {
  const { orders } = useStore();
  const order = orders.find((o) => o.id === orderId);
  return (
    <Sheet open={!!order} onClose={onClose} label={order ? `Tracking order ${order.id}` : ''} className="tracker">
      {order && <Live key={order.id} order={order} onClose={onClose} />}
    </Sheet>
  );
}

function Live({ order, onClose }) {
  const delivery = order.mode === 'delivery';
  const S = stages(order.mode);
  const now = useNow(200);
  const p = progress(order, now);
  const path = useRef(null);
  const [pt, setPt] = useState({ x: 70, y: 250 });
  const celebrated = useRef(p.done);

  // rider position along the route during the "on the way" stage
  const start = (order.scheduledFor && order.scheduledFor > order.at ? order.scheduledFor : order.at) + 2 * STEP_MS;
  const ride = Math.min(1, Math.max(0, (now - start) / STEP_MS));
  useLayoutEffect(() => {
    const el = path.current;
    if (!el) return;
    const q = el.getPointAtLength(el.getTotalLength() * ride);
    setPt({ x: q.x, y: q.y });
  }, [ride]);

  useEffect(() => {
    if (p.done && !celebrated.current) {
      celebrated.current = true;
      confetti();
    }
  }, [p.done]);

  const eta = p.waiting
    ? `Scheduled for ${new Date(order.scheduledFor).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : p.done ? (delivery ? 'Delivered. Bon appétit!' : 'Picked up. Enjoy!')
      : `${delivery ? 'Arriving' : 'Ready'} in about ${Math.max(1, Math.round(25 * (1 - p.frac)))} min`;

  return (
    <>
      <div className="dh">
        <div><h2>Order #{order.id}</h2><p className="muted">{eta}</p></div>
        <button className="ib" onClick={onClose} aria-label="Close tracker"><Icon name="x" /></button>
      </div>
      {delivery && (
        <svg viewBox="0 0 610 300" className="track-map" role="img" aria-label={`Map: rider ${Math.round(ride * 100)}% of the way`}>
          <defs><pattern id="tblocks" width="56" height="56" patternUnits="userSpaceOnUse"><rect width="56" height="56" fill="none" stroke="var(--ln)" strokeWidth="2" /></pattern></defs>
          <rect width="610" height="300" rx="20" fill="url(#tblocks)" />
          <path ref={path} d={ROUTE} fill="none" stroke="var(--ln)" strokeWidth="16" strokeLinecap="round" />
          <path d={ROUTE} fill="none" stroke="var(--a)" strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ride} className="route-done" />
          <text x="70" y="290" fontSize="34" textAnchor="middle">🏪</text>
          <text x="540" y="140" fontSize="38" textAnchor="middle">🏠</text>
          <g style={{ transform: `translate(${pt.x}px, ${pt.y}px)`, transition: 'transform .2s linear' }}>
            <circle r="24" fill="var(--card)" stroke="var(--a)" strokeWidth="3" />
            <text fontSize="28" textAnchor="middle" dominantBaseline="central">🛵</text>
          </g>
        </svg>
      )}
      <div className="bar big"><i style={{ width: `${p.frac * 100}%` }} /></div>
      <ol className="stages">
        {S.map((s, i) => (
          <li key={s.key} className={i < p.step ? 'done' : i === p.step && !p.waiting ? 'now' : ''}>
            <span className="st-ico"><Icon name={i < p.step ? 'check' : s.icon} size={18} /></span>
            <div><b>{s.title}</b><small>{s.note}</small></div>
          </li>
        ))}
      </ol>
      <div className="track-foot">
        <small className="muted">{order.lines.reduce((a, l) => a + l.qty, 0)} items · {money(order.totals.total)} · {order.payment}</small>
        <small className="muted">Demo tracker: each stage takes a few seconds.</small>
      </div>
      {p.done && <RateOrder order={order} />}
    </>
  );
}

function RateOrder({ order }) {
  const { ratings, dispatch } = useStore();
  const ids = [...new Set(order.lines.map((l) => l.id))];
  return (
    <div className="rate">
      <h4>How was it?</h4>
      {ids.map((id) => {
        const d = dishById(id);
        const r = ratings[id]?.stars || 0;
        return (
          <div className="rate-row" key={id}>
            <span>{d.emoji} {d.name}</span>
            <span className="stars" role="radiogroup" aria-label={`Rate ${d.name}`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} role="radio" aria-checked={r === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} className={n <= r ? 'on' : ''} onClick={() => dispatch({ type: 'rate', id, stars: n })}>
                  <Icon name="star" size={20} filled={n <= r} />
                </button>
              ))}
            </span>
          </div>
        );
      })}
      <small className="muted">Your ratings are saved on this device and shown on the menu.</small>
    </div>
  );
}
