"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type GalleryItem = { image: string; label: string; link: string; alt: string };
type Props = { items: GalleryItem[]; defaultIndex?: number; height?: number; expandRatio?: number; trigger?: "hover" | "click"; className?: string };

export function AccordionGallery({ items, defaultIndex = 0, height = 460, expandRatio = 0.48, trigger = "hover", className = "" }: Props) {
  const [active, setActive] = useState(() => Math.min(Math.max(defaultIndex, 0), Math.max(items.length - 1, 0)));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const firstRun = useRef(true);

  const applyLayout = useCallback((animate: boolean) => {
    const panels = panelRefs.current;
    if (!panels.length || !items.length) return;
    const ratio = Math.min(Math.max(expandRatio, 0.2), 0.82);
    const growth = items.length > 1 ? (ratio * (items.length - 1)) / (1 - ratio) : 1;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panels.forEach((panel, index) => {
      if (!panel) return;
      const opened = index === active;
      gsap.to(panel, { flexGrow: opened ? growth : 1, rotateY: opened ? 0 : index < active ? 7 : -7, duration: animate && !reduced ? 0.62 : 0, ease: "power3.out", overwrite: true });
      const media = mediaRefs.current[index];
      if (media) gsap.to(media, { xPercent: -50, yPercent: -50, x: opened ? 0 : (active - index) * 14, "--ag-gray": opened ? 0 : 1, "--ag-dim": opened ? 0 : 0.42, duration: animate && !reduced ? 0.62 : 0, ease: "power3.out", overwrite: true });
    });
  }, [active, expandRatio, items.length]);

  useEffect(() => {
    applyLayout(!firstRun.current);
    firstRun.current = false;
  }, [applyLayout]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => root.style.setProperty("--ag-media-size", `${Math.max(260, root.clientWidth * 0.55)}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return <div ref={rootRef} className={`accordion-gallery ${className}`} style={{ height }} role="list" aria-label="学习主题入口">
    {items.map((item, index) => {
      const opened = index === active;
      return <Link key={item.link} ref={(element) => { panelRefs.current[index] = element; }} href={item.link} className={`ag-panel${opened ? " ag-panel--active" : ""}`} onMouseEnter={() => trigger === "hover" && setActive(index)} onFocus={() => setActive(index)} onClick={(event) => { if (!opened) { event.preventDefault(); setActive(index); } }} onKeyDown={(event) => { if (event.key === "ArrowRight") { event.preventDefault(); setActive((index + 1) % items.length); } if (event.key === "ArrowLeft") { event.preventDefault(); setActive((index - 1 + items.length) % items.length); } }} role="listitem" aria-current={opened ? "true" : undefined}>
        <span className="ag-panel__frame"><span ref={(element) => { mediaRefs.current[index] = element; }} className="ag-panel__media"><img src={item.image} alt={item.alt} draggable={false} /></span><span className="ag-panel__overlay" /></span>
        <span className="ag-panel__label"><span className="ag-panel__bar" /><span className="ag-panel__text">{item.label}</span></span>
      </Link>;
    })}
  </div>;
}
