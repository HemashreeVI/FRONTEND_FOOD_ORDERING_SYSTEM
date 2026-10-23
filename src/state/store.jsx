import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { dishById } from '../data/menu.js';
import { lineKey, totals, unitPrice } from '../lib/pricing.js';
import { load, save } from '../lib/storage.js';

const Ctx = createContext(null);

function initial() {
  return {
    cart: load('tb2.cart', []),
    favs: load('tb2.favs', load('tb_favs', [])), // keeps favourites from the classic version
    orders: load('tb2.orders', []),
    addresses: load('tb2.addresses', []),
    ratings: load('tb2.ratings', {}),
    mode: load('tb2.mode', 'delivery'),
    tip: load('tb2.tip', 10),
    promo: '',
  };
}

function reducer(s, a) {
  switch (a.type) {
    case 'add': {
      const key = lineKey(a.dish.id, a.size, a.extras);
      const found = s.cart.find((l) => l.key === key);
      const cart = found
        ? s.cart.map((l) => (l.key === key ? { ...l, qty: l.qty + a.qty } : l))
        : [...s.cart, { key, id: a.dish.id, size: a.size, extras: [...a.extras].sort(), qty: a.qty, unit: unitPrice(a.dish, a.size, a.extras) }];
      return { ...s, cart };
    }
    case 'qty':
      return { ...s, cart: s.cart.map((l) => (l.key === a.key ? { ...l, qty: l.qty + a.by } : l)).filter((l) => l.qty > 0) };
    case 'remove':
      return { ...s, cart: s.cart.filter((l) => l.key !== a.key) };
    case 'fav':
      return { ...s, favs: s.favs.includes(a.id) ? s.favs.filter((x) => x !== a.id) : [...s.favs, a.id] };
    case 'mode':
      return { ...s, mode: a.mode };
    case 'tip':
      return { ...s, tip: a.tip };
    case 'promo':
      return { ...s, promo: a.code };
    case 'place':
      return { ...s, cart: [], promo: '', orders: [a.order, ...s.orders].slice(0, 30) };
    case 'orderStatus':
      return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, status: a.status } : o)) };
    case 'reorder':
      return { ...s, cart: a.lines.map((l) => ({ ...l, unit: unitPrice(dishById(l.id), l.size, l.extras) })) };
    case 'address': {
      const rest = s.addresses.filter((x) => x.id !== a.address.id);
      return { ...s, addresses: [a.address, ...rest].slice(0, 5) };
    }
    case 'forgetAddress':
      return { ...s, addresses: s.addresses.filter((x) => x.id !== a.id) };
    case 'rate':
      return { ...s, ratings: { ...s.ratings, [a.id]: { stars: a.stars, note: a.note || '' } } };
    default:
      return s;
  }
}

export function StoreProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, undefined, initial);

  useEffect(() => save('tb2.cart', s.cart), [s.cart]);
  useEffect(() => save('tb2.favs', s.favs), [s.favs]);
  useEffect(() => save('tb2.orders', s.orders), [s.orders]);
  useEffect(() => save('tb2.addresses', s.addresses), [s.addresses]);
  useEffect(() => save('tb2.ratings', s.ratings), [s.ratings]);
  useEffect(() => save('tb2.mode', s.mode), [s.mode]);
  useEffect(() => save('tb2.tip', s.tip), [s.tip]);

  const t = useMemo(() => totals(s.cart, s), [s]);
  const count = s.cart.reduce((a, l) => a + l.qty, 0);
  const placeOrder = useCallback((details) => {
    const order = {
      id: String(Math.floor(100000 + Math.random() * 900000)),
      at: Date.now(),
      lines: s.cart,
      totals: t,
      mode: s.mode,
      status: 'placed',
      ...details,
    };
    dispatch({ type: 'place', order });
    return order;
  }, [s.cart, s.mode, t]);

  const value = useMemo(() => ({ ...s, totals: t, count, dispatch, placeOrder }), [s, t, count, placeOrder]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);
