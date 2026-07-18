import { useEffect, useRef } from 'react';

// shared timestamp so every instance pauses while a tab transition settles
let lastTabNavAt = 0;
export const markTabNav = () => {
  lastTabNavAt = Date.now();
};

// fires onNext/onPrev when the user keeps scrolling past a page edge
// (wheel or touch swipe). A page that pages internally instead of
// scrolling (the experience stepper) marks itself [data-manual-edge-nav],
// mounts its own instance with manual: true + requireEdges: false, and
// the app-level instance stands down while that page is on screen.
const useEdgeNav = ({
  onNext,
  onPrev,
  manual = false,
  requireEdges = true,
  threshold = 160,
  cooldown = 1400,
}) => {
  const cb = useRef({ onNext, onPrev });
  cb.current = { onNext, onPrev };
  const acc = useRef(0);
  const lastWheel = useRef(0);
  const lastFire = useRef(0);
  const touchY = useRef(null);

  useEffect(() => {
    const atTop = () => window.scrollY <= 1;
    const atBottom = () =>
      window.innerHeight + Math.ceil(window.scrollY) >=
      document.documentElement.scrollHeight - 2;
    const blocked = () =>
      Date.now() - lastFire.current < cooldown || Date.now() - lastTabNavAt < cooldown;
    const skip = () =>
      !manual && document.querySelector('[data-manual-edge-nav]') != null;

    const fire = (dir) => {
      lastFire.current = Date.now();
      acc.current = 0;
      (dir > 0 ? cb.current.onNext : cb.current.onPrev)?.();
    };

    const onWheel = (e) => {
      if (blocked() || skip()) return;
      const now = Date.now();
      if (now - lastWheel.current > 400) acc.current = 0;
      lastWheel.current = now;
      const down = e.deltaY > 0;
      if (down && (!requireEdges || atBottom())) {
        acc.current = Math.max(acc.current, 0) + e.deltaY;
        if (acc.current >= threshold) fire(1);
      } else if (!down && (!requireEdges || atTop())) {
        acc.current = Math.min(acc.current, 0) + e.deltaY;
        if (acc.current <= -threshold) fire(-1);
      } else {
        acc.current = 0;
      }
    };

    const onTouchStart = (e) => {
      touchY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (touchY.current == null || blocked() || skip()) return;
      const delta = touchY.current - e.touches[0].clientY;
      if (delta > 80 && (!requireEdges || atBottom())) {
        touchY.current = null;
        fire(1);
      } else if (delta < -80 && (!requireEdges || atTop())) {
        touchY.current = null;
        fire(-1);
      }
    };
    const onTouchEnd = () => {
      touchY.current = null;
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [manual, requireEdges, threshold, cooldown]);
};

export default useEdgeNav;
