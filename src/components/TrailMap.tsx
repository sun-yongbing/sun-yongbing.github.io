"use client";

import L from "leaflet";
import Link from "next/link";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Hike } from "@/lib/content";

const icon = L.divIcon({ className: "pin", html: "<span></span>", iconSize: [20, 20], iconAnchor: [10, 10] });

export function TrailMap({ hikes }: { hikes: Hike[] }) {
  return <div className="map-shell"><MapContainer center={[29.5, 116.5]} zoom={5} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{hikes.map((hike) => <Marker key={hike.slug} position={[hike.lat, hike.lng]} icon={icon}><Popup><strong>{hike.title}</strong><br />{hike.place}<br /><Link href={`/hikes/${hike.slug}`}>查看记录</Link></Popup></Marker>)}</MapContainer></div>;
}
