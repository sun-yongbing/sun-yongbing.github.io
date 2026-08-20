"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

export type DriftWallItem = { image: string; title?: string; href?: string };
type Props = { items: DriftWallItem[]; columns?: number; tileWidth?: number; tileHeight?: number; gap?: number; speed?: number; dim?: number; overlayColor?: string; className?: string };

export function DriftWall({ items, columns = 4, tileWidth = 260, tileHeight = 176, gap = 14, speed = 26, dim = .48, overlayColor = "#18251c", className = "" }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const tracks = useRef<(HTMLDivElement | null)[]>([]);
  const offset = useRef<number[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const columnsItems = useMemo(() => {
    const result = Array.from({ length: columns }, () => [] as DriftWallItem[]);
    items.forEach((item, index) => result[index % columns].push(item));
    return result.map((column) => column.length ? [...column, ...column, ...column, ...column] : []);
  }, [columns, items]);

  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    offset.current = columnsItems.map((_, index) => index * 74);
    const animate = (time: number) => {
      const dt = Math.min(.05, (time - previous) / 1000); previous = time;
      tracks.current.forEach((track, index) => {
        if (!track) return;
        const sign = index % 2 ? -1 : 1;
        offset.current[index] = (offset.current[index] + sign * speed * dt) % ((tileHeight + gap) * Math.max(1, columnsItems[index].length / 2));
        track.style.transform = `translate3d(0, ${-offset.current[index]}px, 0)`;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [columnsItems, gap, speed, tileHeight]);

  return <div ref={rootRef} className={`drift-wall ${className}`} style={{ "--dw-tile-w": `${tileWidth}px`, "--dw-tile-h": `${tileHeight}px`, "--dw-gap": `${gap}px`, "--dw-dim": dim, "--dw-overlay": overlayColor } as CSSProperties} onPointerMove={(event) => { const root = rootRef.current; const plane = planeRef.current; if (!root || !plane) return; const rect = root.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5; plane.style.transform = `translate(-50%, -50%) rotateX(${10 - y * 5}deg) rotateY(${-9 + x * 7}deg) translateZ(-80px)`; }} onPointerLeave={() => { if (planeRef.current) planeRef.current.style.transform = "translate(-50%, -50%) rotateX(10deg) rotateY(-9deg) translateZ(-80px)"; }}>
    <div ref={planeRef} className="drift-wall__plane">{columnsItems.map((column, columnIndex) => <div className="drift-wall__column" key={columnIndex}><div className="drift-wall__track" ref={(element) => { tracks.current[columnIndex] = element; }}>{column.map((item, index) => { const id = `${columnIndex}-${index}`; return <Link href={item.href ?? "#"} key={id} className={`drift-wall__tile${active === id ? " is-active" : ""}`} onMouseEnter={() => setActive(id)} onFocus={() => setActive(id)} onMouseLeave={() => setActive(null)}><img src={item.image} alt={item.title ?? "摄影作品"} draggable={false} /><span className="drift-wall__veil" /><span className="drift-wall__caption">{item.title}</span></Link>; })}</div></div>)}</div>
  </div>;
}
