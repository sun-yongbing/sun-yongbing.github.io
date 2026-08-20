"use client";

import dynamic from "next/dynamic";
import type { Hike } from "@/lib/content";

const TrailMap = dynamic(() => import("./TrailMap").then((module) => module.TrailMap), {
  ssr: false,
  loading: () => <div className="map-shell" aria-label="地图加载中" />,
});

export function HikeMapClient({ hikes }: { hikes: Hike[] }) {
  return <TrailMap hikes={hikes} />;
}
