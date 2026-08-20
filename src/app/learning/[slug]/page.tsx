import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getNote, notes } from "@/lib/content";
import Link from "next/link";
export function generateStaticParams(){return notes.map(({slug})=>({slug}));}
export default async function NotePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const note=getNote(slug);if(!note)notFound();return <><Header/><main className="shell page"><article className="article"><span className="eyebrow">{note.theme} · {note.status}</span><h1>{note.title}</h1><p className="meta">更新于 {note.updatedAt} · {note.tags.join(" / ")}</p><div className="body">{note.body.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><div className="card"><small>下一步</small><h3>{note.next}</h3><p>关联笔记：{note.related.map((related,index)=><span key={related}>{index>0?"、":""}<Link href={`/learning/${related}`}>{getNote(related)?.title}</Link></span>)}</p></div></article></main></>}
