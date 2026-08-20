"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Position = { x: number; y: number };
const fallback = { x: -24, y: -24 };
const assetPrefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function DraggablePet() {
  const [position, setPosition] = useState<Position>(fallback);
  const positionRef = useRef<Position>(fallback);
  const [ready, setReady] = useState(false);
  const drag = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("learning-lab-pet-position");
    if (saved) { const next = JSON.parse(saved) as Position; positionRef.current = next; setPosition(next); }
    setReady(true);
  }, []);

  const move = (event: PointerEvent) => {
    if (!drag.current) return;
    const x = Math.min(0, Math.max(-(window.innerWidth - 72), drag.current.originX + event.clientX - drag.current.startX));
    const y = Math.min(0, Math.max(-(window.innerHeight - 72), drag.current.originY + event.clientY - drag.current.startY));
    const next = { x, y };
    positionRef.current = next;
    setPosition(next);
  };

  const stop = () => {
    if (!drag.current) return;
    drag.current = null;
    window.localStorage.setItem("learning-lab-pet-position", JSON.stringify(positionRef.current));
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", stop);
  };

  useEffect(() => () => stop(), []);

  if (!ready) return null;
  return <div className="site-pet" style={{ right: `${-position.x}px`, bottom: `${-position.y}px` }}>
    <button type="button" className="site-pet__body" aria-label="拖动小宠物" onPointerDown={(event) => {
      event.preventDefault();
      drag.current = { startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop);
    }}>
      <Image src={`${assetPrefix}/pet/companion.png`} alt="陪伴小宠物" width={220} height={330} priority />
    </button>
    <span>按住我可以拖动</span>
  </div>;
}
