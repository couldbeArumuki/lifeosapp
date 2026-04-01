import { useEffect } from 'react';

const INTERACTIVE = 'button, a, [role="button"], input[type="submit"], input[type="button"], label[for]';

const ClickEffect = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest(INTERACTIVE);
      if (!target) return;

      // Remove the class first in case it's still running from a previous click
      target.classList.remove('animate-pop');
      // Force reflow so re-adding the class restarts the animation
      void target.offsetWidth;
      target.classList.add('animate-pop');

      const cleanup = () => target.classList.remove('animate-pop');
      target.addEventListener('animationend', cleanup, { once: true });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default ClickEffect;
