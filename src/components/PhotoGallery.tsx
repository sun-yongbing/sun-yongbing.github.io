"use client";
import { useMemo, useState } from "react";
import { photos } from "@/lib/content";
import { DriftWall } from "@/components/DriftWall";
const categories = ["全部", "人像", "城市", "街头", "日常", "建筑", "自然"];
export function PhotoGallery(){const [category,setCategory]=useState("全部");const items=useMemo(()=>category==="全部"?photos:photos.filter(photo=>photo.category===category),[category]);return <><div className="filters" role="tablist" aria-label="摄影题材筛选">{categories.map(item=><button key={item} onClick={()=>setCategory(item)} className={category===item?"active":""} role="tab" aria-selected={category===item}>{item}</button>)}</div><div className="photo-drift"><DriftWall items={items.map(photo=>({image:photo.image,title:`${photo.title} · ${photo.place}`,href:`/photography/${photo.slug}`}))} columns={4} tileWidth={260} tileHeight={176} gap={14} speed={24} dim={.5} overlayColor="#263328" /></div></>}
