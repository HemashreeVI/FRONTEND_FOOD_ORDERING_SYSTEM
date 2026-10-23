import Icon from './Icon.jsx';
import { useStore } from '../state/store.jsx';

export default function Nav({ openCart, openOrders, theme, toggleTheme }) {
  const { count, orders } = useStore();
  return (
    <nav className="nav">
      <div className="wrap nav-bar">
        <a className="logo" href="#top" aria-label="Tasty Bites home"><span className="logo-mark">🍔</span>Tasty<i>Bites</i></a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#specials">Specials</a>
          <a href="#menu">Menu</a>
        </div>
        <span className="grow" />
        <button className="ib" onClick={openOrders} aria-label="Your orders" title="Your orders">
          <Icon name="receipt" />{orders.length > 0 && <span className="dot" />}
        </button>
        <button className="ib" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
        <button className="cart-btn" onClick={openCart} data-cart-target aria-label={`Open cart, ${count} items`}>
          <Icon name="cart" /> <span className="cart-label">Cart</span>
          {count > 0 && <span className="badge">{count}</span>}
        </button>
      </div>
    </nav>
  );
}
