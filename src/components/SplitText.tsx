"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GsapSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GsapSplitText, useGSAP);

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  tag?: "h1" | "h2" | "p" | "span";
};

export function SplitText({ text, className = "", delay = 65, duration = 0.9, tag = "h1" }: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { document.fonts.ready.then(() => setReady(true)); }, []);
  useGSAP(() => {
    if (!ready || !ref.current) return;
    const split = new GsapSplitText(ref.current, { type: "chars", charsClass: "split-char" });
    const tween = gsap.fromTo(split.chars, { opacity: 0, y: 52, rotateX: -48 }, { opacity: 1, y: 0, rotateX: 0, duration, ease: "power3.out", stagger: delay / 1000, force3D: true });
    return () => { tween.kill(); split.revert(); };
  }, { dependencies: [ready, text, delay, duration], scope: ref });
  const Tag = tag;
  return <Tag ref={ref as never} className={`split-parent ${className}`}>{text}</Tag>;
}
