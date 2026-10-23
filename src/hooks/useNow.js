import { useEffect, useState } from 'react';

/** Re-render every `ms` while `active`, returning the current time. */
export default function useNow(ms = 250, active = true) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms, active]);
  return now;
}
