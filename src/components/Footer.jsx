import ClickSpark from '../bits/ClickSpark.jsx';
import ShinyText from '../bits/ShinyText.jsx';
import Magnet from '../bits/Magnet.jsx';
import Icon from './Icon.jsx';
import { PROMOS } from '../lib/pricing.js';

export default function Footer({ onSurprise }) {
  return (
    <footer className="footer">
      <ClickSpark sparkColor="#ffb800" sparkCount={10} sparkRadius={34} shape="star" glow={0.5}>
        <div className="wrap cta">
          <p className="kicker"><ShinyText text="still scrolling?" speed={2.5} color="var(--mut)" shineColor="var(--ink)" /></p>
          <h2 className="cta-title">Hungry yet?</h2>
          <div className="cta-row">
            <Magnet padding={60} magnetStrength={3}>
              <a className="btn" href="#menu">Order now <Icon name="arrow" /></a>
            </Magnet>
            <button className="btn btn-ghost" onClick={onSurprise}><Icon name="dice" /> Surprise me</button>
          </div>
          <ul className="codes">
            {Object.entries(PROMOS).map(([k, v]) => <li key={k}><code>{k}</code> {v.label}</li>)}
          </ul>
        </div>
      </ClickSpark>
      <div className="wrap foot-bottom">
        <span>Made with 🍅 for hungry people · prices in USD · a front-end demo, nothing is charged</span>
        <a href="./classic/">Classic version</a>
        <a href="https://github.com/HemashreeVI/FRONTEND_FOOD_ORDERING_SYSTEM">Source on GitHub</a>
      </div>
    </footer>
  );
}
