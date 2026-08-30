import { useEffect, useRef } from "react";

interface InteractiveBackgroundProps {
  imageUrl: string;
}

export function InteractiveBackground({ imageUrl }: InteractiveBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const image = imageRef.current;

    if (!root || !image) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion || !finePointer) {
      return;
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const move = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;

      targetX = (x - 0.5) * -14;
      targetY = (y - 0.5) * -10;

      root.style.setProperty("--pointer-x", `${x * 100}%`);
      root.style.setProperty("--pointer-y", `${y * 100}%`);
    };

    const leave = () => {
      targetX = 0;
      targetY = 0;
      root.style.setProperty("--pointer-x", "50%");
      root.style.setProperty("--pointer-y", "50%");
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      image.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1.035)`;
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="corelink-interactive-background" aria-hidden="true">
      <div
        ref={imageRef}
        className="corelink-interactive-background__image"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="corelink-interactive-background__light" />
      <div className="corelink-interactive-background__shade" />
    </div>
  );
}
