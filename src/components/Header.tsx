import Link from "next/link";

export function Header({ floating = false }: { floating?: boolean }) {
  return <header className={floating ? "stage-header" : "shell"}>
    <nav className={floating ? "stage-nav" : "nav"} aria-label="主导航">
      {!floating && <Link href="/" className="brand">个人学习实验室</Link>}
      <div className="navlinks">
        <Link href="/">首页</Link>
        <Link href="/learning">学习书架</Link>
        <Link href="/hikes">旅行日志</Link>
        <Link href="/photography">摄影作品</Link>
        <Link href="/about">关于我</Link>
      </div>
    </nav>
  </header>;
}
