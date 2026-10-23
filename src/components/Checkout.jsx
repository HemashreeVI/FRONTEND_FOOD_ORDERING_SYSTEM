import { useMemo, useState } from 'react';
import { dishById } from '../data/menu.js';
import { money } from '../lib/pricing.js';
import { useStore } from '../state/store.jsx';
import Sheet from './Sheet.jsx';
import Icon from './Icon.jsx';

const PAY = [
  { id: 'cash', icon: 'wallet', title: 'Cash on delivery', note: 'Pay the rider or at the counter' },
  { id: 'card', icon: 'wallet', title: 'Card at the door', note: 'The rider brings a card machine' },
  { id: 'upi', icon: 'phone', title: 'UPI / wallet at the door', note: 'Scan and pay on arrival' },
];

function slots(now = new Date()) {
  const d = new Date(now);
  d.setMinutes(d.getMinutes() < 30 ? 30 : 60, 0, 0);
  d.setMinutes(d.getMinutes() + 30); // first slot at least 30 min out
  return Array.from({ length: 6 }, (_, i) => new Date(d.getTime() + i * 30 * 60000));
}
const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

export default function Checkout({ open, onClose, onPlaced }) {
  return (
    <Sheet open={open} onClose={onClose} label="Checkout" className="checkout">
      {open && <Flow onClose={onClose} onPlaced={onPlaced} />}
    </Sheet>
  );
}

function Flow({ onClose, onPlaced }) {
  const { mode, cart, totals: t, addresses, dispatch, placeOrder } = useStore();
  const delivery = mode === 'delivery';
  const last = addresses[0];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: last?.name || '', phone: last?.phone || '', street: last?.street || '', extra: last?.extra || '', note: '' });
  const [remember, setRemember] = useState(true);
  const [when, setWhen] = useState('asap');
  const [pay, setPay] = useState('cash');
  const [touched, setTouched] = useState(false);
  const options = useMemo(() => slots(), []);

  const errors = {
    name: form.name.trim().length < 2 ? 'Please add your name' : '',
    phone: !/^[+\d][\d\s-]{6,16}$/.test(form.phone.trim()) ? 'Enter a valid phone number' : '',
    street: delivery && form.street.trim().length < 5 ? 'Where should we deliver?' : '',
  };
  const ok = !errors.name && !errors.phone && !errors.street;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const STEPS = [delivery ? 'Address' : 'Contact', 'Time', 'Payment'];

  const next = () => {
    if (step === 0 && !ok) return setTouched(true);
    setStep((s) => s + 1);
  };
  const place = () => {
    if (delivery && remember) {
      const id = `${form.street.trim().toLowerCase()}`;
      dispatch({ type: 'address', address: { id, name: form.name.trim(), phone: form.phone.trim(), street: form.street.trim(), extra: form.extra.trim() } });
    }
    const order = placeOrder({
      customer: { name: form.name.trim(), phone: form.phone.trim() },
      address: delivery ? `${form.street.trim()}${form.extra.trim() ? ', ' + form.extra.trim() : ''}` : 'Pickup at Tasty Bites Kitchen',
      note: form.note.trim(),
      scheduledFor: when === 'asap' ? null : when,
      payment: PAY.find((p) => p.id === pay).title,
    });
    onPlaced(order);
  };

  return (
    <div className="flow">
      <div className="dh">
        <h2>Checkout</h2>
        <button className="ib" onClick={onClose} aria-label="Close checkout"><Icon name="x" /></button>
      </div>
      <ol className="progress" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''} aria-current={i === step ? 'step' : undefined}>
            <span>{i < step ? <Icon name="check" size={14} /> : i + 1}</span>{s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="step">
          {delivery && addresses.length > 0 && (
            <div className="saved">
              <h4>Saved addresses</h4>
              {addresses.map((a) => (
                <div key={a.id} className={`saved-item ${form.street === a.street ? 'on' : ''}`}>
                  <button onClick={() => setForm((f) => ({ ...f, name: a.name, phone: a.phone, street: a.street, extra: a.extra }))}>
                    <Icon name="pin" size={16} /> <span><b>{a.street}</b><small>{a.name} · {a.phone}</small></span>
                  </button>
                  <button className="rm" onClick={() => dispatch({ type: 'forgetAddress', id: a.id })} aria-label={`Forget ${a.street}`}><Icon name="trash" size={15} /></button>
                </div>
              ))}
            </div>
          )}
          <div className="fields">
            <Field label="Your name" icon="user" value={form.name} onChange={set('name')} error={touched && errors.name} autoComplete="name" />
            <Field label="Phone" icon="phone" value={form.phone} onChange={set('phone')} error={touched && errors.phone} autoComplete="tel" inputMode="tel" />
            {delivery ? (
              <>
                <Field label="Street address" icon="home" value={form.street} onChange={set('street')} error={touched && errors.street} autoComplete="street-address" className="span2" />
                <Field label="Flat, floor or landmark (optional)" icon="pin" value={form.extra} onChange={set('extra')} className="span2" />
              </>
            ) : (
              <p className="span2 pickup-note"><Icon name="store" size={16} /> Pick up at <b>Tasty Bites Kitchen</b>, 12 Market Street. We'll call when it's ready.</p>
            )}
            <Field label="Note for the kitchen (optional)" icon="chef" value={form.note} onChange={set('note')} className="span2" placeholder="No onions, extra napkins…" />
            {delivery && <label className="check span2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Save this address for next time</label>}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="step">
          <div className="choices">
            <button className={`choice ${when === 'asap' ? 'on' : ''}`} aria-pressed={when === 'asap'} onClick={() => setWhen('asap')}>
              <Icon name="bike" /><span><b>As soon as possible</b><small>About 25 minutes</small></span>
            </button>
          </div>
          <h4>Or schedule for later today</h4>
          <div className="opts">
            {options.map((d) => (
              <button key={d.getTime()} className={`chip ${when === d.getTime() ? 'on' : ''}`} aria-pressed={when === d.getTime()} onClick={() => setWhen(d.getTime())}>
                <Icon name="calendar" size={14} /> {fmtTime(d)}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step">
          <div className="choices">
            {PAY.map((p) => (
              <button key={p.id} className={`choice ${pay === p.id ? 'on' : ''}`} aria-pressed={pay === p.id} onClick={() => setPay(p.id)}>
                <Icon name={p.icon} /><span><b>{p.title}</b><small>{p.note}</small></span>
              </button>
            ))}
          </div>
          <p className="demo-note">This is a demo: nothing is charged and no card details are ever asked for.</p>
          <div className="review">
            <h4>Order summary</h4>
            {cart.map((l) => <div key={l.key}><span>{l.qty} × {dishById(l.id).name}</span><span>{money(l.unit * l.qty)}</span></div>)}
            <div className="tot"><span>Total</span><span>{money(t.total)}</span></div>
            <small className="muted">{delivery ? `To ${form.street}` : 'Pickup'} · {when === 'asap' ? 'ASAP' : `at ${fmtTime(when)}`}</small>
          </div>
        </div>
      )}

      <div className="flow-foot">
        {step > 0 ? <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>Back</button> : <span />}
        {step < 2
          ? <button className="btn" onClick={next}>Continue <Icon name="arrow" /></button>
          : <button className="btn" onClick={place}>Place order · {money(t.total)}</button>}
      </div>
    </div>
  );
}

function Field({ label, icon, error, className = '', ...input }) {
  return (
    <label className={`field ${className} ${error ? 'bad' : ''}`}>
      <span>{label}</span>
      <span className="field-box"><Icon name={icon} size={16} /><input {...input} aria-invalid={!!error} /></span>
      {error && <small role="alert">{error}</small>}
    </label>
  );
}
