import Link from "next/link";
import { Header } from "@/components/Header";
import { notes } from "@/lib/content";

export default function LearningPage() {
  return <><Header /><main className="workspace-page"><header className="workspace-hero"><span>LEARNING LIBRARY</span><h1>学习书架</h1><p>把正在理解的问题、练习与复盘，放进同一个会持续更新的个人系统。</p></header><section className="workspace-toolbar"><b>全部笔记 <i>{notes.length}</i></b><div><button className="selected">全部</button><button>AI</button><button>投资金融</button><button>技能</button></div></section><section className="workspace-grid">{notes.map((note, index) => <Link href={`/learning/${note.slug}`} className="workspace-card" key={note.slug}><small>0{index + 1} / {note.theme}</small><h2>{note.title}</h2><p>{note.summary}</p><footer><span>{note.status}</span><b>阅读 →</b></footer></Link>)}</section></main></>;
}
