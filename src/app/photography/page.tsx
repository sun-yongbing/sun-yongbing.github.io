import Link from "next/link";
import { Header } from "@/components/Header";
import { photos } from "@/lib/content";

export default function PhotographyPage() {
  return <><Header /><main className="workspace-page"><header className="workspace-hero"><span>VISUAL ARCHIVE</span><h1>摄影作品</h1><p>不限定题材。每一张照片，都是一次重新观看生活的练习。</p></header><section className="workspace-toolbar"><b>作品档案 <i>{photos.length}</i></b><div><button className="selected">全部</button><button>人像</button><button>城市</button><button>日常</button></div></section><section className="workspace-photo-grid">{photos.map((photo, index) => <Link href={`/photography/${photo.slug}`} className="workspace-photo" key={photo.slug}><img src={photo.image} alt={photo.title} /><div><small>0{index + 1} / {photo.category}</small><h2>{photo.title}</h2><p>{photo.place} · {photo.date}</p></div></Link>)}</section></main></>;
}
