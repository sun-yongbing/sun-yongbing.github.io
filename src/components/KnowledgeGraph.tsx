"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { notes } from "@/lib/content";

const positions = [[48,13],[17,47],[73,47]];
export function KnowledgeGraph() {
  const [active, setActive] = useState(0);
  const note = notes[active];
  const links = useMemo(() => notes.flatMap((item, index) => item.related.map((target) => [index, notes.findIndex((entry) => entry.slug === target)])), []);
  return <div className="graph" aria-label="自由知识地图">
    <svg viewBox="0 0 100 100" aria-hidden="true">{links.map(([a,b], index)=><line key={index} x1={positions[a][0]} y1={positions[a][1]} x2={positions[b][0]} y2={positions[b][1]} />)}</svg>
    {notes.map((item,index)=><button key={item.slug} className={`graph-node ${active===index?"selected":""}`} style={{left:`${positions[index][0]}%`,top:`${positions[index][1]}%`}} onClick={()=>setActive(index)}><span>{item.theme}</span>{item.title}</button>)}
    <aside className="graph-detail"><span className="eyebrow">{note.status} · {note.updatedAt}</span><h3>{note.title}</h3><p>{note.summary}</p><Link href={`/learning/${note.slug}`}>阅读笔记 →</Link></aside>
  </div>;
}
