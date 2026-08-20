import type { Metadata } from "next";
import { DraggablePet } from "@/components/DraggablePet";
import "./globals.css";

export const metadata: Metadata = {
  title: "个人学习实验室",
  description: "持续学习，持续观察。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}<DraggablePet /></body></html>;
}
