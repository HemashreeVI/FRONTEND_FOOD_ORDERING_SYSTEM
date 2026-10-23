// Pure pricing rules, shared by the cart and checkout (and unit-tested).
import { SIZES, EXTRAS } from '../data/menu.js';

export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 2.99;
export const FREE_DELIVERY_AT = 30;

export const PROMOS = {
  TASTY10: { label: '10% off the subtotal' },
  YUM5: { label: '$5 off orders of $20 or more', min: 20 },
  FREESHIP: { label: 'Free delivery' },
};

export const money = (n) => '$' + n.toFixed(2);

export function unitPrice(dish, size = 0, extras = []) {
  return dish.price + SIZES[size].add + extras.reduce((a, i) => a + EXTRAS[i].add, 0);
}

export function lineKey(dishId, size, extras) {
  return `${dishId}|${size}|${[...extras].sort().join(',')}`;
}

/** Returns an error message, or null when the code can be applied. */
export function promoError(code, subtotal) {
  const p = PROMOS[code];
  if (!p) return 'That code is not valid';
  if (p.min && subtotal < p.min) return `${code} needs an order of ${money(p.min)} or more`;
  return null;
}

export function totals(lines, { mode = 'delivery', tip = 10, promo = '' } = {}) {
  const sub = lines.reduce((a, l) => a + l.unit * l.qty, 0);
  const valid = promo && !promoError(promo, sub);
  const disc = !valid ? 0 : promo === 'TASTY10' ? sub * 0.1 : promo === 'YUM5' ? 5 : 0;
  const net = sub - disc;
  const ship = mode === 'pickup' || !sub || net >= FREE_DELIVERY_AT || (valid && promo === 'FREESHIP') ? 0 : DELIVERY_FEE;
  const tax = net * TAX_RATE;
  const tipAmt = net * (tip / 100);
  const round = (n) => Math.round(n * 100) / 100;
  return {
    sub: round(sub), disc: round(disc), net: round(net), ship, tax: round(tax), tip: round(tipAmt),
    total: round(net + ship + tax + tipAmt),
    toFree: Math.max(0, round(FREE_DELIVERY_AT - net)),
    promoApplied: valid ? promo : '',
  };
}
