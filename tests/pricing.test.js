import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MENU, dishById } from '../src/data/menu.js';
import { unitPrice, totals, promoError, lineKey } from '../src/lib/pricing.js';

const line = (id, qty = 1, size = 0, extras = []) => ({ unit: unitPrice(dishById(id), size, extras), qty });

test('unit price adds size and extras', () => {
  assert.equal(unitPrice(dishById(1), 1, [0, 2]), 12.99 + 2.5 + 1 + 2.5);
});

test('line keys ignore extra order', () => {
  assert.equal(lineKey(1, 0, [2, 0]), lineKey(1, 0, [0, 2]));
});

test('delivery fee until $30, free after', () => {
  assert.equal(totals([line(3)]).ship, 2.99);
  assert.equal(totals([line(3, 4)]).ship, 0);
  assert.equal(totals([line(3)], { mode: 'pickup' }).ship, 0);
});

test('promo codes', () => {
  assert.equal(totals([line(1)], { promo: 'TASTY10' }).disc, 1.3);
  assert.equal(totals([line(1)], { promo: 'YUM5' }).disc, 0); // under $20
  assert.equal(totals([line(1, 2)], { promo: 'YUM5' }).disc, 5);
  assert.equal(totals([line(1)], { promo: 'FREESHIP' }).ship, 0);
  assert.equal(promoError('NOPE', 50), 'That code is not valid');
  assert.match(promoError('YUM5', 10), /\$20/);
});

test('total = net + delivery + tax + tip', () => {
  const t = totals([line(6, 2)], { tip: 15 });
  assert.equal(t.total, Math.round((t.net + t.ship + t.tax + t.tip) * 100) / 100);
});

test('menu data is consistent', () => {
  const ids = MENU.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(MENU.length >= 24);
});
