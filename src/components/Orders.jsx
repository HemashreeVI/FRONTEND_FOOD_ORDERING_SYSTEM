import { dishById } from '../data/menu.js';
import { money } from '../lib/pricing.js';
import { progress, stages } from '../lib/orders.js';
import { useStore } from '../state/store.jsx';
import useNow from '../hooks/useNow.js';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';

export default function Orders({ open, onClose, onTrack, onReorder }) {
  const { orders } = useStore();
  const now = useNow(1000, open);
  return (
    <Sheet open={open} onClose={onClose} kind="drawer" label="Your orders">
      <div className="dh">
        <h2>Your orders</h2>
        <button className="ib" onClick={onClose} aria-label="Close orders"><Icon name="x" /></button>
      </div>
      <div className="items">
        {!orders.length && <div className="empty"><span className="empty-emoji">🧾</span>No orders yet.<br />Your order history will show up here.</div>}
        {orders.map((o) => {
          const p = progress(o, now);
          const st = stages(o.mode)[p.step];
          return (
            <article className="order" key={o.id}>
              <header>
                <b>#{o.id}</b>
                <span className={`status ${p.done ? 'ok' : 'live'}`}>{p.waiting ? 'Scheduled' : p.done ? (o.mode === 'delivery' ? 'Delivered' : 'Picked up') : st.title}</span>
              </header>
              <p className="order-emojis" aria-hidden="true">{o.lines.map((l) => dishById(l.id).emoji).join(' ')}</p>
              <p className="muted small">{o.lines.map((l) => `${l.qty}× ${dishById(l.id).name}`).join(', ')}</p>
              <footer>
                <small className="muted">{new Date(o.at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · {money(o.totals.total)}</small>
                <span className="order-actions">
                  {!p.done && <button className="chip" onClick={() => onTrack(o.id)}><Icon name="bike" size={14} /> Track</button>}
                  {p.done && <button className="chip" onClick={() => onTrack(o.id)}><Icon name="star" size={14} /> Rate</button>}
                  <button className="chip on" onClick={() => onReorder(o)}><Icon name="repeat" size={14} /> Reorder</button>
                </span>
              </footer>
            </article>
          );
        })}
      </div>
    </Sheet>
  );
}
