"use client";

import Link from "next/link";
import { Bell, ChevronDown, ChevronRight, Play, Search, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fade = (delay = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: .6, delay } });

export function HomeExperience() {
  return <main className="nexora-page">
    <video className="nexora-video" autoPlay muted loop playsInline aria-hidden="true"><source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4" type="video/mp4" /></video>
    <div className="nexora-wash" />
    <header className="nexora-nav">
      <Link href="/" className="nexora-logo">✦ 个人学习实验室</Link>
      <nav><Link href="/">首页</Link><Link href="/learning">学习书架</Link><Link href="/hikes">旅行日志</Link><Link href="/photography">摄影作品</Link><Link href="/about">关于我</Link></nav>
      <Link href="/search" className="nexora-nav-cta">开始探索</Link>
    </header>
    <section className="nexora-hero">
      <motion.p {...fade(0)} className="nexora-badge"><Sparkles size={14} /> 现在开始建立你的个人知识系统</motion.p>
      <motion.h1 {...fade(.1)}>让学习，<em>持续发生</em></motion.h1>
      <motion.p {...fade(.2)} className="nexora-subtitle">记录你正在理解的知识、走过的地方与看见的瞬间。它们不是待办清单，而是一份会随时间生长的个人档案。</motion.p>
      <motion.div {...fade(.3)} className="nexora-actions"><Link href="/learning">进入学习书架</Link><Link href="/photography" aria-label="浏览摄影作品"><Play size={15} fill="currentColor" /></Link></motion.div>
      <motion.div {...fade(.48)} className="study-dashboard"><Dashboard /></motion.div>
    </section>
  </main>;
}

function Dashboard() {
  const tasks = [["AI 学习系统", "阅读与整理", "进行中"], ["投资第一性原理", "笔记复盘", "今日"], ["摄影叙事练习", "收集灵感", "本周"]];
  return <div className="dashboard-shell">
    <div className="dashboard-top"><b>✦ <span>Learning OS</span></b><div className="dashboard-search"><Search size={13} /> 搜索笔记、地点和照片 <i>⌘K</i></div><span>建立记录</span><Bell size={15} /><i className="dashboard-avatar">YOU</i></div>
    <div className="dashboard-body"><aside><strong>个人空间</strong><a className="active">概览</a><a>学习书架 <b>6</b></a><a>旅行日志</a><a>摄影作品</a><a>年度回顾</a><small>收藏夹</small><a>灵感收集</a><a>待整理</a><a>设置</a></aside><section className="dashboard-main"><div className="dashboard-greeting"><div><small>2026 / 个人学习实验室</small><h2>欢迎回来，继续前进</h2></div><button><Send size={12} /> 新建记录</button></div><div className="dashboard-pills"><b>学习</b><span>阅读</span><span>行走</span><span>拍摄</span><span>复盘</span><i>自定义</i></div><div className="dashboard-cards"><article className="dashboard-progress"><p>本月学习进度 <i>●</i></p><h3>18 <small>小时</small></h3><div><span>较上月</span><b>+ 6.5 h</b><span> · 3 条旅行记录</span></div><svg viewBox="0 0 380 92" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#5a63ef" stopOpacity=".22"/><stop offset="1" stopColor="#5a63ef" stopOpacity="0"/></linearGradient></defs><path d="M0,81 C36,73 43,66 78,71 C110,77 118,35 151,46 C184,58 196,31 224,37 C253,43 276,14 310,27 C338,39 351,12 380,6 L380,92 L0,92Z" fill="url(#area)"/><path d="M0,81 C36,73 43,66 78,71 C110,77 118,35 151,46 C184,58 196,31 224,37 C253,43 276,14 310,27 C338,39 351,12 380,6" fill="none" stroke="#5a63ef" strokeWidth="2"/></svg></article><article className="dashboard-counts"><header><b>内容档案</b><span>＋</span></header><p><span>学习笔记</span><b>24</b></p><p><span>旅行地点</span><b>08</b></p><p><span>摄影作品</span><b>63</b></p></article></div><section className="dashboard-list"><header><b>最近更新</b><span>查看全部 <ChevronRight size={13} /></span></header>{tasks.map(([title, desc, tag]) => <article key={title}><i>✦</i><div><b>{title}</b><span>{desc}</span></div><small>{tag}</small></article>)}</section></section></div>
  </div>;
}
