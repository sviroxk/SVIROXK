import { useEffect, useRef, type CSSProperties } from 'react'
import { ArrowUpRight, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { type Style, type Project } from '../data'

export function ParticleCanvas() {
 const ref = useRef<HTMLCanvasElement>(null)
 useEffect(() => {
   const canvas = ref.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return
   const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
   let raf = 0
   const pointer = { x: -999, y: -999 }
   const points = Array.from({ length: window.innerWidth < 700 ? 56 : 110 }, () => ({ x: Math.random(), y: Math.random(), phase: Math.random() * 6, speed: .1 + Math.random() * .25, size: .5 + Math.random() * 1.4 }))
   const resize = () => { const ratio = Math.min(devicePixelRatio || 1, 1.5); canvas.width = canvas.clientWidth * ratio; canvas.height = canvas.clientHeight * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0) }
   const move = (event: PointerEvent) => { const box = canvas.getBoundingClientRect(); pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top }
   const draw = (t: number) => { const w = canvas.clientWidth, h = canvas.clientHeight; ctx.clearRect(0, 0, w, h); points.forEach((p, i) => { const x = p.x * w + Math.sin(t * .0002 + p.phase) * 18, y = p.y * h + Math.cos(t * .00016 + p.phase) * 22; const dx = x - pointer.x, dy = y - pointer.y, dist = Math.hypot(dx, dy); const push = dist < 115 && dist > 0 ? (115 - dist) / 115 * 18 : 0; const px = x + dx / (dist || 1) * push, py = y + dy / (dist || 1) * push; ctx.beginPath(); ctx.arc(px, py, p.size, 0, Math.PI * 2); ctx.fillStyle = i % 5 === 0 ? 'rgba(200,255,95,.85)' : 'rgba(230,235,221,.48)'; ctx.fill(); if (i % 4 === 0) { points.slice(i + 1, i + 5).forEach(q => { const qx = q.x * w, qy = q.y * h, d = Math.hypot(px - qx, py - qy); if (d < 105) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.strokeStyle = `rgba(200,255,95,${(1 - d / 105) * .13})`; ctx.stroke() } }) } }); if (!reduce) raf = requestAnimationFrame(draw) }
   resize(); draw(0); window.addEventListener('resize', resize); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', () => { pointer.x = -999 }); return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); canvas.removeEventListener('pointermove', move) }
 }, [])
 return <canvas ref={ref} className="particle-canvas" aria-hidden="true"/>
}

export function StyleArt({ item, compact = false }: { item: Style; compact?: boolean }) {
 return <div className={`style-art art-${item.className} ${compact ? 'compact' : ''}`} aria-label={`${item.name} visual demonstration`}>
  <div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/>
  {item.className === 'dashboard' ? <div className="dash-mini"><span>01 / signal</span><b>84.6</b><i/><div className="bars">{Array.from({length:12},(_,i)=><em key={i} style={{height:`${20+(i*17)%75}%`}}/>)}</div></div> : null}
  {item.className === 'blueprint' ? <div className="plan-lines"><span>SECTION A—A</span><i/><b>1:50</b></div> : null}
  {item.className === 'ascii' ? <pre className="ascii-art">{'░▒▓ ONDA ▓▒░\n  DIGITAL\n  STUDIO  '}</pre> : null}
  {item.className === 'comic' ? <span className="comic-burst">POP!</span> : null}
  {item.className === 'pixel' ? <div className="pixel-tiles">{Array.from({length:25},(_,i)=><i key={i}/>)}</div> : null}
  {item.className === 'bauhaus' ? <><i className="bauhaus-shape circle"/><i className="bauhaus-shape square"/><i className="bauhaus-shape triangle"/></> : null}
  {item.className === 'brutal' ? <div className="brutal-sticker">NO<br/>RULES</div> : null}
  {item.className === 'deco' ? <div className="deco-sun">✳</div> : null}
  {item.className === 'isometric' ? <div className="iso-cube"><i/><i/><i/></div> : null}
  {item.className === 'wireframe' ? <div className="wire-sphere"/> : null}
  {item.className === 'clay' ? <div className="clay-shapes"><i/><i/><i/></div> : null}
  {item.className === 'halftone' ? <div className="halftone-orb"/> : null}
  {item.className === 'retro' ? <><div className="retro-grid"/><span className="retro-sun"/></> : null}
  {item.className === 'maximal' ? <span className="maximal-star">✳</span> : null}
  {item.className === 'particle' ? <div className="particle-swarm">{Array.from({length:18},(_,i)=><i key={i} style={{'--n':i} as CSSProperties}/>)}</div> : null}
  {item.className === 'holo' ? <div className="holo-disc"/> : null}
  {item.className === 'neon' ? <span className="neon-word">NIGHT<br/>SHIFT</span> : null}
  {item.className === 'glass' ? <div className="glass-stack"><i/><i/><i/></div> : null}
  {item.className === 'editorial' ? <div className="editorial-type">Field<br/>notes<span>VOL. 01</span></div> : null}
  {item.className === 'aurora' ? <div className="aurora-ribbon"/> : null}
  {item.className === 'gradient' ? <div className="gradient-blob"/> : null}
  <span className="art-index">{item.eyebrow.split('/')[0]}</span><span className="art-word">{item.name.split(' ')[0]}<sup>®</sup></span>
 </div>
}

export function StyleCard({ item, index = 0 }: { item: Style; index?: number }) {
 return <motion.article className={`style-card card-${item.className}`} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.5,delay:(index%3)*.06}}><Link to={`/styles/${item.slug}`} className="card-link"><StyleArt item={item} compact/><div className="style-card-info"><div><span className="eyebrow">{item.category} · {item.eyebrow.split('/')[0]}</span><h3>{item.name}</h3></div><span className="circle-arrow"><ArrowUpRight size={17}/></span></div></Link></motion.article>
}

export function ProjectArtwork({ slug, compact = false }: { slug: string; compact?: boolean }) {
 const labels: Record<string, string> = { morrow:'MORROW / botanical light study', objects:'OBJECTS / kinetic still life', after:'AFTER HOURS / live frequency', form:'FORM / architectural study', tinyworlds:'TINY WORLDS / soft landscape', still:'STILL / prismatic product study' }
 return <div className={`project-art scene-${slug} ${compact ? 'scene-compact' : ''}`} role="img" aria-label={labels[slug] ?? 'ONDA original digital art direction'}>
  <div className="scene-grid"/><div className="scene-noise"/>
  {slug === 'morrow' && <div className="morrow-world"><i/><b/><span/></div>}
  {slug === 'objects' && <div className="objects-world"><i/><b/><span/><em/></div>}
  {slug === 'after' && <div className="after-world"><i/>{Array.from({length:37},(_,i)=><b key={i} style={{'--bar':`${18 + Math.abs(Math.sin(i*.59))*78}%`,'--n':i} as CSSProperties}/>) }<span>23:48 ━━━●━━ ◀ Ⅱ ▶</span></div>}
  {slug === 'form' && <div className="form-world"><i/><b/><span/><em/><small>SECTION 01 / SCALE 1:100</small></div>}
  {slug === 'tinyworlds' && <div className="tiny-world"><i/><b/><span/><em/><small/></div>}
  {slug === 'still' && <div className="still-world"><i/><b/><span/><em/></div>}
  <span className="scene-index">ONDA / 0{Math.max(1, ['morrow','objects','after','form','tinyworlds','still'].indexOf(slug)+1)}</span>
 </div>
}

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
 return <motion.article className={`project-card project-${project.tone}`} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay:(index%2)*.12}}><Link to={`/work/${project.slug}`} className="project-link"><div className="project-image"><ProjectArtwork slug={project.slug} compact/><span className="project-open"><MoveUpRight size={19}/></span><span className="concept-tag">Original art direction · 2025</span></div><div className="project-copy"><div><span className="eyebrow">{project.category} / {project.style}</span><h3>{project.title}</h3></div><p>{project.kind}</p></div></Link></motion.article>
}
