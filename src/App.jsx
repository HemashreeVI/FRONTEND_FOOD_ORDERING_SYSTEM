import { useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav.jsx';
import Ticker from './components/Ticker.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Specials from './components/Specials.jsx';
import Menu from './components/Menu.jsx';
import Footer from './components/Footer.jsx';
import DishModal from './components/DishModal.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import Checkout from './components/Checkout.jsx';
import Tracker from './components/Tracker.jsx';
import Orders from './components/Orders.jsx';
import useLenis, { getLenis } from './hooks/useLenis.js';
import { useStore } from './state/store.jsx';
import { MENU } from './data/menu.js';
import { flyToCart, toast } from './lib/fx.js';
import { load, save } from './lib/storage.js';

export default function App() {
  useLenis();
  const { dispatch } = useStore();
  const [theme, setTheme] = useState(() => load('tb2.theme', load('tb_theme', null)) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  const [filters, setFilters] = useState({ q: '', cat: 'All', veg: false, sort: 'pop' });
  const [dish, setDish] = useState(null);
  const [panel, setPanel] = useState(null); // 'cart' | 'checkout' | 'orders'
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save('tb2.theme', theme);
  }, [theme]);

  const addToCart = useCallback((d, size, extras, qty, fromEl) => {
    dispatch({ type: 'add', dish: d, size, extras, qty });
    flyToCart(fromEl, d.emoji);
    toast(`${d.emoji} ${d.name} added`);
  }, [dispatch]);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    const lenis = getLenis();
    lenis ? lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView({ behavior: 'smooth' });
  };
  const surprise = () => setDish(MENU[Math.floor(Math.random() * MENU.length)].id);

  return (
    <>
      <a className="skip" href="#menu">Skip to the menu</a>
      <Nav openCart={() => setPanel('cart')} openOrders={() => setPanel('orders')} theme={theme} toggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <Ticker />
      <main>
        <Hero onSearch={(q) => { setFilters((f) => ({ ...f, q, cat: 'All' })); scrollToMenu(); }} onSurprise={surprise} />
        <HowItWorks />
        <Specials onOpen={setDish} onQuickAdd={(d, el) => addToCart(d, 0, [], 1, el)} />
        <Menu filters={filters} setFilters={setFilters} onOpen={setDish} onQuickAdd={(d, el) => addToCart(d, 0, [], 1, el)} />
      </main>
      <Footer onSurprise={surprise} />

      <DishModal id={dish} onClose={() => setDish(null)} onAdd={(d, size, extras, qty, el) => { addToCart(d, size, extras, qty, el); setDish(null); }} />
      <CartDrawer open={panel === 'cart'} onClose={() => setPanel(null)} onCheckout={() => setPanel('checkout')} />
      <Checkout open={panel === 'checkout'} onClose={() => setPanel(null)} onPlaced={(o) => { setPanel(null); setTracking(o.id); }} />
      <Orders open={panel === 'orders'} onClose={() => setPanel(null)} onTrack={(id) => { setPanel(null); setTracking(id); }}
        onReorder={(o) => { dispatch({ type: 'reorder', lines: o.lines }); toast('Order added to your cart'); setPanel('cart'); }} />
      <Tracker orderId={tracking} onClose={() => setTracking(null)} />
      <div id="toast" className="toast" role="status" aria-live="polite" />
    </>
  );
}
