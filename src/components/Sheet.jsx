import { useEffect, useRef } from 'react';
import { gsap, reducedMotion } from '../lib/motion.js';
import { useScrollLock } from '../hooks/useLenis.js';

/** Shared overlay: a centered modal or a right-hand drawer. Esc and backdrop close it; focus is kept inside. */
export default function Sheet({ open, onClose, kind = 'modal', label, children, className = '' }) {
  const panel = useRef(null);
  const back = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const p = panel.current;
    if (!reducedMotion()) {
      gsap.fromTo(back.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      if (kind === 'drawer') gsap.fromTo(p, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'expo.out' });
      else gsap.fromTo(p, { y: 40, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' });
    }
    const first = p.querySelector('button, input, select, textarea, a[href]');
    first?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key === 'Tab') {
        const f = [...p.querySelectorAll('button:not([disabled]), input, select, textarea, a[href]')];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus?.({ preventScroll: true }); };
  }, [open, kind]);

  if (!open) return null;
  return (
    <div className="sheet-back" ref={back} onMouseDown={(e) => e.target === back.current && onClose()}>
      <div className={`${kind} ${className}`} ref={panel} role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent>
        {children}
      </div>
    </div>
  );
}
