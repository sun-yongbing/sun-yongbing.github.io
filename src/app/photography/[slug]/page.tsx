import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { getPhoto, photos } from "@/lib/content";
export function generateStaticParams(){return photos.map(({slug})=>({slug}));}
export default async function PhotoPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const photo=getPhoto(slug);if(!photo)notFound();return <><Header/><main className="shell page"><article className="article"><div className="detail-hero" style={{backgroundImage:`url(${photo.image})`}}/><span className="eyebrow">{photo.category}</span><h1>{photo.title}</h1><p className="meta">{photo.date} · {photo.place}</p><div className="body">{photo.body.map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></article></main></>}
