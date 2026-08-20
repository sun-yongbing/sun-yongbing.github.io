import { Header } from "@/components/Header";
import { about, hikes, notes, photos } from "@/lib/content";

export default function AboutPage() {
  return <><Header /><main className="workspace-page"><header className="workspace-hero"><span>{about.eyebrow}</span><h1>{about.title}</h1><p>{about.intro}</p></header><section className="profile-workspace"><aside><div className="profile-avatar">YOU</div><h2>{about.name}</h2><p>{about.role}</p><dl><div><dt>当前关注</dt><dd>{about.focuses.join("、")}</dd></div><div><dt>记录方式</dt><dd>{about.recording}</dd></div><div><dt>联系邮箱</dt><dd>{about.email}</dd></div></dl></aside><div className="profile-main"><section><small>ABOUT THIS SPACE</small><h2>{about.statementTitle}</h2>{about.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section><section className="profile-stat-grid"><article><span>学习</span><b>{notes.length}</b><p>篇笔记</p></article><article><span>旅行</span><b>{hikes.length}</b><p>个地点</p></article><article><span>摄影</span><b>{photos.length}</b><p>张作品</p></article></section><section className="profile-main__note"><small>COMING NEXT</small><h3>{about.future}</h3></section></div></section></main></>;
}
