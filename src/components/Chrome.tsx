import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Menu, MoveUpRight, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const links = [['Работы', '/work'], ['Направления', '/styles'], ['Услуги', '/services'], ['Процесс', '/process']]
export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location])
  return <header className="site-header"><Link className="brand" to="/" aria-label="ONDA — главная"><span className="brand-orb">◉</span><span>onda<span className="brand-dot">.</span></span><small>independent digital studio</small></Link><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'}>{open ? <X/> : <Menu/>}</button><nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Основная навигация">{links.map(([label, path]) => <NavLink key={path} to={path}>{label}</NavLink>)}<Link className="nav-cta" to="/order">Обсудить проект <MoveUpRight size={14}/></Link></nav></header>
}
export function Footer() { return <footer className="footer"><Link className="footer-logo" to="/">onda<span>.</span></Link><span className="footer-note">Независимая digital-студия<br/>Создаём цифровые впечатления с характером.</span><div className="footer-links"><Link to="/faq">FAQ <ArrowUpRight size={14}/></Link><Link to="/history">Мои обращения <ArrowUpRight size={14}/></Link><Link to="/contact">Контакты <ArrowUpRight size={14}/></Link>{import.meta.env.VITE_CONTACT_EMAIL&&<a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}>{import.meta.env.VITE_CONTACT_EMAIL} <ArrowUpRight size={14}/></a>}<span>© ONDA STUDIO 2026</span></div></footer> }
export function PageIntro({ index, title, text }: { index: string; title: ReactNode; text: string }) { return <section className="page-intro"><span className="eyebrow">{index} <i/> ONDA STUDIO</span><h1>{title}</h1><p>{text}</p><span className="intro-mark"><ArrowDownRight/></span></section> }
export function SectionHead({ kicker, title, href, label }: { kicker: string; title: ReactNode; href?: string; label?: string }) { return <div className="section-head"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div>{href && <Link className="text-link" to={href}>{label ?? 'Смотреть всё'} <ArrowUpRight size={16}/></Link>}</div> }
