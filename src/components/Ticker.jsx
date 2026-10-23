import { ScrollVelocity } from '../bits/ScrollVelocity.jsx';

// Promo strip that speeds up and skews with your scroll velocity (React Bits).
export default function Ticker() {
  return (
    <div className="ticker" aria-label="Current offers: TASTY10 for 10% off, YUM5 for $5 off orders over $20, FREESHIP for free delivery, free delivery over $30">
      <ScrollVelocity
        texts={['TASTY10 · 10% off  ✦  YUM5 · $5 off $20+  ✦  FREESHIP · free delivery  ✦  free delivery over $30  ✦  ']}
        velocity={40}
        numCopies={4}
        skewWithVelocity={6}
        parallaxClassName="ticker-parallax"
        scrollerClassName="ticker-scroller"
      />
    </div>
  );
}
