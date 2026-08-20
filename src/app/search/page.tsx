import { hikes, notes, photos } from "@/lib/content";
import { SearchExperience, type SearchEntry } from "@/components/SearchExperience";

export default function SearchPage() {
  const entries: SearchEntry[] = [
    ...notes.map((item) => ({ type: "学习笔记", title: item.title, summary: `${item.summary} ${item.tags.join(" ")} ${item.body.join(" ")}`, href: `/learning/${item.slug}` })),
    ...hikes.map((item) => ({ type: "旅行日志", title: item.title, summary: `${item.place} ${item.summary} ${item.tags.join(" ")} ${item.body.join(" ")}`, href: `/hikes/${item.slug}` })),
    ...photos.map((item) => ({ type: "摄影作品", title: item.title, summary: `${item.category} ${item.place} ${item.description} ${item.body.join(" ")}`, href: `/photography/${item.slug}` })),
  ];
  return <SearchExperience entries={entries} />;
}
