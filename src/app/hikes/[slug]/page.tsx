import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getHike, hikes } from "@/lib/content";
export function generateStaticParams(){return hikes.map(({slug})=>({slug}));}
export default async function HikePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const hike=getHike(slug);if(!hike)notFound();return <><Header/><main className="shell page"><article className="article"><div className="detail-hero" style={{backgroundImage:`url(${hike.image})`}}/><span className="eyebrow">地点级徒步记录</span><h1>{hike.title}</h1><p className="meta">{hike.date} · {hike.place} · {hike.tags.join(" / ")}</p><div className="body">{hike.body.map((paragraph,index)=><p key={index}>{paragraph}</p>)}<p>这是一条供自己回顾的地点记录。为了保护私人行程与自然环境，页面不会展示精确轨迹、起终点或敏感位置。</p></div></article></main></>}
