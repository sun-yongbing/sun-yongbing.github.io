import Link from "next/link";
import { Header } from "@/components/Header";
import { HikeMapClient } from "@/components/HikeMapClient";
import { hikes } from "@/lib/content";

export default function HikesPage() {
  return <><Header /><main className="workspace-page"><header className="workspace-hero"><span>TRAVEL LOG</span><h1>旅行日志</h1><p>只保存地点级的记忆：到过哪里、当时看见什么，以及一段愿意再读的文字。</p></header><section className="workspace-map"><div><span>足迹地图</span><h2>{hikes.length} 个地点，正在累计</h2><p>不公开精确轨迹与敏感位置。</p></div><HikeMapClient hikes={hikes} /></section><section className="workspace-grid">{hikes.map((hike, index) => <Link href={`/hikes/${hike.slug}`} className="workspace-card workspace-card--image" key={hike.slug} style={{ backgroundImage: `linear-gradient(180deg,rgba(18,20,23,.05),rgba(18,20,23,.88)),url(${hike.image})` }}><small>0{index + 1} / {hike.date}</small><h2>{hike.title}</h2><p>{hike.place}</p><footer><span>{hike.tags.join(" · ")}</span><b>阅读 →</b></footer></Link>)}</section></main></>;
}
