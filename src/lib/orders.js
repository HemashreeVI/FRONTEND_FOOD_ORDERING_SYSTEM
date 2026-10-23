// Order progress is derived from time, so the tracker and history stay right after a refresh.
export const STEP_MS = 6000; // demo speed: each stage takes 6 seconds

export function stages(mode) {
  const delivery = mode === 'delivery';
  return [
    { key: 'placed', title: 'Order confirmed', note: 'The kitchen has your order', icon: 'check' },
    { key: 'cooking', title: 'Chef is cooking', note: 'Fresh, made to order', icon: 'chef' },
    delivery
      ? { key: 'onway', title: 'Rider is on the way', note: 'Following the fastest route', icon: 'bike' }
      : { key: 'ready', title: 'Ready for pickup', note: 'Packed and waiting at the counter', icon: 'store' },
    { key: 'done', title: delivery ? 'Delivered. Enjoy!' : 'Picked up. Enjoy!', note: 'Bon appétit', icon: 'sparkle' },
  ];
}

export function progress(order, now = Date.now()) {
  const start = order.scheduledFor && order.scheduledFor > order.at ? order.scheduledFor : order.at;
  const elapsed = Math.max(0, now - start);
  const step = Math.min(3, Math.floor(elapsed / STEP_MS));
  const frac = Math.min(1, elapsed / (STEP_MS * 3)); // 0 → 1 across the whole journey
  return { step, frac, done: step >= 3, waiting: now < start };
}
