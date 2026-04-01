import { useEffect } from 'react';

// Sparkle emojis / chars to pop on click
const SPARKS = ['✨', '💖', '⭐', '🌸', '💫', '🎀', '💕', '🌟'];
const COLORS = ['#FF3FA4', '#FF85DC', '#FFD700', '#FF6EC7', '#A855F7', '#38BDF8', '#34D399', '#FB923C'];

// Play a short cute "waaah" chirp using Web Audio API (no external files needed)
function playWaaahSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const playTone = (freq, startTime, duration, gainVal) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, startTime + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, startTime + duration);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(800, now, 0.12, 0.18);
    playTone(1000, now + 0.07, 0.12, 0.14);
    playTone(1300, now + 0.14, 0.15, 0.10);

    setTimeout(() => ctx.close(), 500);
  } catch {
    // Web Audio not supported — silently skip
  }
}

// Spawn emoji sparks at (x, y)
function spawnSparks(x, y) {
  const count = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)];
    const angle = (360 / count) * i + (Math.random() * 30 - 15);
    const dist = 40 + Math.random() * 55;
    const rad = (angle * Math.PI) / 180;
    const dx = Math.cos(rad) * dist;
    const dy = Math.sin(rad) * dist;
    const size = 14 + Math.floor(Math.random() * 12);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    Object.assign(el.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      fontSize: `${size}px`,
      color,
      pointerEvents: 'none',
      zIndex: '99999',
      userSelect: 'none',
      transform: 'translate(-50%, -50%)',
      transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease`,
      opacity: '1',
      willChange: 'transform, opacity',
    });

    document.body.appendChild(el);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3)`;
        el.style.opacity = '0';
      });
    });

    setTimeout(() => el.remove(), 600);
  }
}

// "Waaah!" popup text near cursor
function spawnWaaah(x, y) {
  const options = ['waaah! ✨', 'kawaii! 💖', 'kyaa! 🌸', 'sugoi! ⭐'];
  const text = options[Math.floor(Math.random() * options.length)];
  const el = document.createElement('span');
  el.textContent = text;

  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y - 16}px`,
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'Poppins, sans-serif',
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    pointerEvents: 'none',
    zIndex: '99999',
    userSelect: 'none',
    transform: 'translate(-50%, -100%)',
    transition: 'transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease',
    opacity: '1',
    textShadow: '0 1px 4px rgba(0,0,0,0.25)',
    whiteSpace: 'nowrap',
  });

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = 'translate(-50%, -200%)';
      el.style.opacity = '0';
    });
  });

  setTimeout(() => el.remove(), 700);
}

// Ripple circle at click point
function spawnRipple(x, y) {
  const el = document.createElement('span');
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const size = 20;

  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    pointerEvents: 'none',
    zIndex: '99998',
    transform: 'translate(-50%, -50%) scale(1)',
    opacity: '0.8',
    transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
  });

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = 'translate(-50%, -50%) scale(4)';
      el.style.opacity = '0';
    });
  });

  setTimeout(() => el.remove(), 550);
}

// Throttle: min ms between activations
const THROTTLE_MS = 80;
let lastFired = 0;

const ClickEffect = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const now = Date.now();
      if (now - lastFired < THROTTLE_MS) return;
      lastFired = now;

      const { clientX: x, clientY: y } = e;
      spawnSparks(x, y);
      spawnRipple(x, y);

      // Show waaah text ~40% of the time to keep it fun but not overwhelming
      if (Math.random() < 0.4) spawnWaaah(x, y);

      // Play sound
      playWaaahSound();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default ClickEffect;
