"use client";

import { useCallback, useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";

type Props = {
  text: string;
  tag?: "h1" | "h2" | "p";
  mediaType?: "image" | "video";
  src: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: "rise" | "wipe" | "fade" | "none";
  trigger?: "view" | "mount" | "hover";
  duration?: number;
  stagger?: number;
  align?: "left" | "center" | "right";
  weight?: number;
  tracking?: number;
  lineHeight?: number;
  textScale?: number;
  className?: string;
  style?: CSSProperties;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function MaskedHeading({
  text,
  tag = "h2",
  mediaType = "image",
  src,
  poster = "",
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = "rise",
  trigger = "view",
  duration = 1.1,
  stagger = 0.09,
  align = "center",
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = "",
  style,
}: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const revealRef = useRef<HTMLSpanElement | null>(null);
  const mediaRef = useRef<HTMLSpanElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const baseRefs = useRef<(HTMLElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const offsets = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const clipId = `masked-heading-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text]);
  const settings = useMemo(
    () => ({ fillScale, parallax, drift, brightness, saturation, grayscale, textScale }),
    [brightness, drift, fillScale, grayscale, parallax, saturation, textScale],
  );

  const placeMedia = useCallback(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;
    const config = settings;
    const maxX = Math.max(0, ((config.fillScale - 1) / 2) * root.clientWidth);
    const maxY = Math.max(0, ((config.fillScale - 1) / 2) * root.clientHeight);
    const offset = offsets.current;
    media.style.transform = `translate3d(${clamp(offset.x, -maxX, maxX).toFixed(2)}px, ${clamp(offset.y, -maxY, maxY).toFixed(2)}px, 0) scale(${config.fillScale})`;
    media.style.filter = `brightness(${config.brightness}) saturate(${config.saturation})${config.grayscale ? " grayscale(1)" : ""}`;
  }, [settings]);

  const sync = useCallback(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    root.style.fontSize = `${clamp(root.clientWidth * settings.textScale, 20, 200).toFixed(1)}px`;
    const computed = window.getComputedStyle(measure);
    wordRefs.current.forEach((word, index) => {
      const base = baseRefs.current[index];
      const glyph = glyphRefs.current[index];
      if (!word || !base || !glyph) return;
      glyph.setAttribute("x", `${word.offsetLeft}`);
      glyph.setAttribute("y", `${base.offsetTop}`);
      glyph.style.fontFamily = computed.fontFamily;
      glyph.style.fontSize = computed.fontSize;
      glyph.style.fontWeight = computed.fontWeight;
      glyph.style.letterSpacing = computed.letterSpacing;
    });
    placeMedia();
  }, [placeMedia, settings]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(root);
    document.fonts?.ready.then(sync).catch(() => undefined);
    let frameId = 0;
    let last = performance.now();
    let clock = 0;
    const frame = (now: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += delta;
      const offset = offsets.current;
      const config = settings;
      const dx = Math.sin(clock * 0.21) * config.drift;
      const dy = Math.cos(clock * 0.17) * config.drift * 0.6;
      const ease = 1 - Math.exp(-delta / 0.18);
      offset.x += (offset.tx + dx - offset.x) * ease;
      offset.y += (offset.ty + dy - offset.y) * ease;
      placeMedia();
      frameId = requestAnimationFrame(frame);
    };
    const move = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      offsets.current.tx = clamp(((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1, -1, 1) * -settings.parallax;
      offsets.current.ty = clamp(((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1, -1, 1) * -settings.parallax;
    };
    const leave = () => { offsets.current.tx = 0; offsets.current.ty = 0; };
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerleave", leave);
    frameId = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(frameId); observer.disconnect(); root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", leave); };
  }, [placeMedia, settings, sync]);

  useEffect(() => { sync(); }, [sync, words, align, weight, tracking, lineHeight, textScale]);

  useEffect(() => {
    const root = rootRef.current;
    const layer = revealRef.current;
    const glyphs = glyphRefs.current.filter((item): item is SVGTextElement => Boolean(item));
    if (!root || !layer || !glyphs.length) return;
    const settle = () => gsap.set([glyphs, layer], { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" });
    const play = () => {
      tweenRef.current?.kill();
      if (reveal === "wipe") {
        const state = { progress: 100 };
        tweenRef.current = gsap.to(state, { progress: 0, duration, ease: "power3.inOut", onUpdate: () => { layer.style.clipPath = `inset(0% ${state.progress}% 0% 0%)`; } });
      } else if (reveal === "fade") {
        tweenRef.current = gsap.fromTo(layer, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration, ease: "power3.out" });
      } else {
        const distance = (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15;
        tweenRef.current = gsap.fromTo(glyphs, { y: distance }, { y: 0, duration, stagger, ease: "power4.out" });
      }
    };
    if (reveal === "none" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { settle(); return; }
    if (trigger === "hover") { settle(); root.addEventListener("pointerenter", play); return () => { root.removeEventListener("pointerenter", play); tweenRef.current?.kill(); }; }
    if (trigger === "view") {
      settle(); layer.style.clipPath = reveal === "wipe" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 0%)";
      const observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) { play(); observer.disconnect(); } }, { threshold: 0.25 });
      observer.observe(root);
      return () => { observer.disconnect(); tweenRef.current?.kill(); };
    }
    play();
    return () => tweenRef.current?.kill();
  }, [duration, reveal, stagger, trigger, words]);

  const Tag = tag;
  return <Tag ref={rootRef as never} className={`masked-heading ${className}`.trim()} style={{ textAlign: align, fontWeight: weight, letterSpacing: `${tracking}em`, lineHeight, ...style }}>
    <span ref={measureRef} className="masked-heading__measure">{words.map((word, index) => <span key={`${word}-${index}`} ref={(element) => { wordRefs.current[index] = element; }} className="masked-heading__word">{word}<i ref={(element) => { baseRefs.current[index] = element; }} className="masked-heading__baseline" /></span>)}</span>
    <svg className="masked-heading__defs" aria-hidden="true"><defs><clipPath id={clipId} clipPathUnits="userSpaceOnUse">{words.map((word, index) => <text key={`${word}-${index}`} ref={(element) => { glyphRefs.current[index] = element; }}>{word}</text>)}</clipPath></defs></svg>
    <span ref={revealRef} className="masked-heading__reveal"><span className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}><span ref={mediaRef} className="masked-heading__media">{mediaType === "video" ? <video className="masked-heading__source" src={src} poster={poster} autoPlay muted loop playsInline /> : <img className="masked-heading__source" src={src} alt="" draggable={false} />}</span></span></span>
  </Tag>;
}
