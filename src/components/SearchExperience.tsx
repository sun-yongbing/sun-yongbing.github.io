"use client";

import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";

export type SearchEntry = { type: string; title: string; summary: string; href: string };

function SearchContent({ entries }: { entries: SearchEntry[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? entries.filter((item) => `${item.title} ${item.summary}`.toLowerCase().includes(term)) : [];
  }, [entries, query]);
  return <><Header /><main className="shell page"><div className="page-head"><span className="eyebrow">Local search</span><h1>找回每一个<br />曾经想过的问题。</h1><p>搜索标题、标签和笔记正文。检索在浏览器中完成，不上传你的内容。</p></div><input className="searchbox" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：AI、长期主义、摄影……" aria-label="搜索学习笔记、旅行和摄影记录" autoFocus />{query && <section aria-live="polite">{results.length ? results.map((item) => <Link className="result" href={item.href} key={item.href}><span>{item.type}</span><h3>{item.title}</h3><p>{item.summary.slice(0, 120)}{item.summary.length > 120 ? "…" : ""}</p></Link>) : <p className="map-note">没有找到结果。试试主题、标签或正文中的其他词。</p>}</section>}</main></>;
}

export function SearchExperience({ entries }: { entries: SearchEntry[] }) {
  return <Suspense fallback={<main className="shell page"><p className="map-note">正在准备检索…</p></main>}><SearchContent entries={entries} /></Suspense>;
}
