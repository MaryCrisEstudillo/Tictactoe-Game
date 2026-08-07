'use strict';

/* A small canvas confetti burst, no dependencies.
   Confetti.burst({ x, y, colors }) throws pieces out from a point given in
   viewport coordinates; Confetti.stop() clears anything still in the air. */
const Confetti = (() => {
  const COUNT = 90;
  const GRAVITY = 0.3;
  const DRAG = 0.988;
  const LIFE = 150;        // frames a piece lasts, before its random variation
  const FADE_FROM = 0.6;   // fraction of its life at which it starts fading

  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let pieces = [];
  let frame = null;

  /* The canvas is sized by CSS; this matches its backing store to the display
     so the pieces stay sharp on high density screens. */
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createPiece(x, y, colors) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 5 + Math.random() * 11;

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4, // biased upwards, so it arcs
      width: 6 + Math.random() * 7,
      height: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.35,
      age: 0,
      life: LIFE * (0.7 + Math.random() * 0.5),
    };
  }

  function tick() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);
    pieces = pieces.filter(
      (piece) => piece.age < piece.life && piece.y < height + 50
    );

    for (const piece of pieces) {
      piece.age++;
      piece.vy += GRAVITY;
      piece.vx *= DRAG;
      piece.vy *= DRAG;
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.spin;

      const progress = piece.age / piece.life;
      ctx.globalAlpha =
        progress < FADE_FROM ? 1 : 1 - (progress - FADE_FROM) / (1 - FADE_FROM);

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      /* Squashing the height as it spins reads as a piece tumbling in 3D. */
      const flutter = Math.abs(Math.cos(piece.rotation)) * piece.height + 1;
      ctx.fillRect(-piece.width / 2, -flutter / 2, piece.width, flutter);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
    frame = pieces.length > 0 ? requestAnimationFrame(tick) : null;
  }

  function burst({ x, y, colors }) {
    if (reducedMotion.matches) return;

    resize();
    for (let i = 0; i < COUNT; i++) {
      pieces.push(createPiece(x, y, colors));
    }
    if (frame === null) frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    pieces = [];
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', () => {
    if (frame !== null) resize();
  });

  return { burst, stop };
})();
