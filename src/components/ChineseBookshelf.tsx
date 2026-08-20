"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { notes } from "@/lib/content";

const covers = ["#6f3025", "#254b45", "#24384f", "#876a2e", "#51334a", "#4f4433"];

export function ChineseBookshelf() {
  const [active, setActive] = useState(0);
  const [drift, setDrift] = useState(0);
  const books = useMemo(() => Array.from({ length: 12 }, (_, index) => ({ note: notes[index % notes.length], index })), []);
  const selected = notes[active];

  return <section className="bookshelf" onPointerMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); setDrift(((event.clientX - box.left) / box.width - .5) * -150); }} onPointerLeave={() => setDrift(0)}>
    <div className="bookshelf__room"><div className="bookshelf__shadow" /><div className="bookshelf__rail"><div className="bookshelf__books" style={{ transform: `translateX(${drift}px)` }}>{books.map(({ note, index }) => { const selectedBook = index % notes.length === active; return <button type="button" key={`${note.slug}-${index}`} className={`book-spine${selectedBook ? " is-selected" : ""}`} style={{ "--book-color": covers[index % covers.length], "--book-height": `${188 + (index % 3) * 27}px` } as CSSProperties} onClick={() => setActive(index % notes.length)} aria-pressed={selectedBook}><span className="book-spine__seal">藏</span><span className="book-spine__title">{note.title}</span><span className="book-spine__theme">{note.theme}</span></button>; })}</div></div></div>
    <aside className="book-detail"><span>已选书目 / {selected.theme}</span><h2>{selected.title}</h2><p>{selected.summary}</p><div><small>{selected.status} · 更新于 {selected.updatedAt}</small><Link href={`/learning/${selected.slug}`}>打开这本书 →</Link></div></aside>
    <p className="bookshelf__hint">左右移动鼠标，浏览书架；点选书脊，再打开阅读。</p>
  </section>;
}
