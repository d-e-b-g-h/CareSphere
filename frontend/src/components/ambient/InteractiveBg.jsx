import React, { useEffect, useRef } from "react";

// Premium interactive canvas background
// - Continuous theme across the page
// - Draws a subtle deep-colored path following cursor movement and clicks
// - Honors reduced motion preference
export const InteractiveBg = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const pointsRef = useRef([]);
  const intensityRef = useRef(1);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "interactive-bg-canvas";
    canvasRef.current = canvas;
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h, dpr };
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Clear on resize
      ctx.clearRect(0, 0, w, h);
    };

    fit();
    window.addEventListener("resize", fit);

    // Base style
    canvas.style.position = "fixed";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 0;
    canvas.style.pointerEvents = "none";

    let lastT = 0;
    const maxPoints = 80; // trail history

    const addPoint = (x, y, boost = 0) => {
      pointsRef.current.push({ x, y, life: 1, boost });
      if (pointsRef.current.length > maxPoints) pointsRef.current.shift();
    };

    const onMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      addPoint(x, y, 0);
    };

    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      addPoint(t.clientX, t.clientY, 0);
    };

    const onDown = (e) => {
      intensityRef.current = 2.2; // click boost
      addPoint(e.clientX, e.clientY, 1);
    };

    const fade = () => {
      // Subtle alpha wipe to create persistence without harsh clears
      ctx.fillStyle = "rgba(230, 238, 236, 0.06)"; // matches page tint
      ctx.fillRect(0, 0, sizeRef.current.w, sizeRef.current.h);
    };

    const draw = (t) => {
      rafRef.current = requestAnimationFrame(draw);
      const now = t || performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.033);
      lastT = now;

      // Fade canvas slightly
      fade();

      // Draw trail
      const pts = pointsRef.current;
      if (pts.length > 1) {
        for (let i = 1; i < pts.length; i++) {
          const p0 = pts[i - 1];
          const p1 = pts[i];
          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const dist = Math.hypot(dx, dy) || 1;
          const width = Math.min(10, 2 + (8 / Math.max(1, dist)) * intensityRef.current);

          const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
          grad.addColorStop(0, "rgba(15,71,61,0.18)"); // deep jade
          grad.addColorStop(1, "rgba(49,196,161,0.14)"); // mint

          ctx.strokeStyle = grad;
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();

          // Decay
          p0.life -= dt * 0.7;
        }
        // Remove dead points
        while (pts.length && pts[0].life <= 0) pts.shift();
      }

      // Ease intensity back down
      intensityRef.current += (1 - intensityRef.current) * 0.06;
    };

    if (!prefersReduced) rafRef.current = requestAnimationFrame(draw);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", fit);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("pointerdown", onDown);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return null; // canvas is directly appended to body
};