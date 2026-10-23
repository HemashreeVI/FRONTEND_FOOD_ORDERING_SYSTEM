import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from '../lib/motion.js';

let lenis = null;
export const getLenis = () => lenis;

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays perfectly in sync. */
export default function useLenis() {
  useEffect(() => {
    if (reducedMotion()) return;
    lenis = new Lenis({ lerp: 0.09, anchors: { offset: -80 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    };
  }, []);
}

/** Pause page scrolling while a drawer or modal is open. */
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
    };
  }, [locked]);
}
