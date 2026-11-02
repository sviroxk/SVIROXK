import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight, Heart, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { type Style, type Project, projects, styles } from '../data'

export function CosmicBackground(){
 const ref=useRef<HTMLCanvasElement>(null)
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let raf=0,visible=true
  const pointer={x:-1000,y:-1000};const count=Math.min(180,Math.max(70,Math.round(window.innerWidth*window.innerHeight/9000)))
  const stars=Array.from({length:count},()=>({x:Math.random(),y:Math.random(),r:.35+Math.random()*1.15,phase:Math.random()*Math.PI*2,drift:.15+Math.random()*.6}))
  const resize=()=>{const ratio=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(innerWidth*ratio);canvas.height=Math.round(innerHeight*ratio);ctx.setTransform(ratio,0,0,ratio,0,0)}
  const frame=(time:number)=>{if(!visible||document.hidden||reduced.matches)return;const w=innerWidth,h=innerHeight;ctx.clearRect(0,0,w,h);for(const star of stars){const dx=pointer.x-w/2,dy=pointer.y-h/2;const px=star.x*w+dx*.004*star.drift,py=star.y*h+dy*.004*star.drift;const pulse=.38+.62*(.5+.5*Math.sin(time*.0007+star.phase));ctx.beginPath();ctx.arc(px,py,star.r,0,Math.PI*2);ctx.fillStyle=`rgba(216,229,255,${pulse*.68})`;ctx.fill()}if(Math.hypot(pointer.x-w/2,pointer.y-h/2)<430){const g=ctx.createRadialGradient(pointer.x,pointer.y,0,pointer.x,pointer.y,240);g.addColorStop(0,'rgba(112,150,224,.09)');g.addColorStop(1,'rgba(112,150,224,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}raf=requestAnimationFrame(frame)}
  const play=()=>{cancelAnimationFrame(raf);if(visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;play()});observer.observe(canvas)
  const move=(e:PointerEvent)=>{pointer.x=e.clientX;pointer.y=e.clientY};const clear=()=>{pointer.x=-1000;pointer.y=-1000}
  resize();window.addEventListener('resize',resize);window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerleave',clear);document.addEventListener('visibilitychange',play);reduced.addEventListener('change',play);play()
  return()=>{cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move);window.removeEventListener('pointerleave',clear);document.removeEventListener('visibilitychange',play);reduced.removeEventListener('change',play)}
 },[])
 return <canvas ref={ref} className="cosmic-background" aria-hidden="true"/>
}

export function ParticleCanvas() {
 const ref=useRef<HTMLCanvasElement>(null)
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');let raf=0,visible=true,hovered=false
  const pointer={x:-999,y:-999};const count=window.innerWidth<700?34:window.innerWidth<1100?55:82
  const points=Array.from({length:count},()=>({x:Math.random(),y:Math.random(),phase:Math.random()*6,size:.55+Math.random()*1.15}))
  const resize=()=>{const ratio=Math.min(devicePixelRatio||1,1.25);canvas.width=canvas.clientWidth*ratio;canvas.height=canvas.clientHeight*ratio;ctx.setTransform(ratio,0,0,ratio,0,0)}
  const move=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top}
  const frame=(t:number)=>{if(!visible||document.hidden||reduced.matches)return;const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);points.forEach((p,i)=>{const x=p.x*w+Math.sin(t*.00018+p.phase)*13,y=p.y*h+Math.cos(t*.00015+p.phase)*16,dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy),push=d<92&&d>0?(92-d)/92*13:0,px=x+dx/(d||1)*push,py=y+dy/(d||1)*push;ctx.beginPath();ctx.arc(px,py,p.size,0,Math.PI*2);ctx.fillStyle=i%6===0?'rgba(217,255,102,.78)':'rgba(230,235,221,.36)';ctx.fill();if(i%5===0)for(let j=i+1;j<Math.min(points.length,i+4);j++){const q=points[j],qx=q.x*w,qy=q.y*h,dist=Math.hypot(px-qx,py-qy);if(dist<88){ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(qx,qy);ctx.strokeStyle=`rgba(217,255,102,${(1-dist/88)*.11})`;ctx.stroke()}}});if(hovered)raf=requestAnimationFrame(frame)}
  const play=()=>{cancelAnimationFrame(raf);if(visible&&hovered&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame)}
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;play()},{threshold:0});observer.observe(canvas)
  const enter=()=>{hovered=true;play()};const leave=()=>{hovered=false;pointer.x=-999;pointer.y=-999;cancelAnimationFrame(raf);ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)};resize();window.addEventListener('resize',resize);document.addEventListener('visibilitychange',play);reduced.addEventListener('change',play);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerenter',enter);canvas.addEventListener('pointerleave',leave)
  return()=>{cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',play);reduced.removeEventListener('change',play);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerenter',enter);canvas.removeEventListener('pointerleave',leave)}
 },[])
 return <canvas ref={ref} className="particle-canvas" aria-hidden="true"/>
}

export const STYLE_VISUAL_CLASS_NAMES = ['particle','holo','neon','wireframe','glass','editorial','bauhaus','brutal','isometric','pixel','aurora','blueprint','deco','dashboard','comic','clay','swiss','retro','ascii','gradient','halftone','maximal','volt','pulse','folio','signal','kinetic'] as const
const projectSceneNames:Record<string,string>={morrow:'morrow-world',objects:'objects-world',after:'after-world',form:'form-world',tinyworlds:'tiny-world',still:'still-world',volt:'volt-world',northstar:'northstar-world',ledger:'ledger-world',pulse:'pulse-world',saffron:'saffron-world',folio:'folio-world',kinetic:'kinetic-world',common:'common-world',orbit:'orbit-world',frame:'frame-world',mechanica:'kinetic-world',civic:'civic-world',atelier:'atelier-world',signal:'after-world',commonwealth:'form-world',daybreak:'daybreak-world',fieldnotes:'folio-world',terracotta:'objects-world',orbitlab:'orbit-world'}
export const PROJECT_SCENE_NAMES=projectSceneNames
export const PROJECT_SCENE_BASE_CLASSES:Record<string,string>={morrow:'morrow-world',objects:'objects-world',after:'after-world',form:'form-world',tinyworlds:'tiny-world',still:'still-world',volt:'volt-world',northstar:'northstar-world',ledger:'ledger-world',pulse:'pulse-world',saffron:'saffron-world',folio:'folio-world',kinetic:'kinetic-world',common:'common-world',orbit:'orbit-world',frame:'frame-world',mechanica:'kinetic-world',civic:'civic-world',atelier:'atelier-world',signal:'after-world',commonwealth:'form-world',daybreak:'daybreak-world',fieldnotes:'folio-world',terracotta:'objects-world',orbitlab:'orbit-world'}

export function StyleArt({ item, compact = false }: { item: Style; compact?: boolean }) {
 const visualByClass:Record<string,React.ReactNode>={
  particle:<div className="particle-swarm">{Array.from({length:18},(_,i)=><i key={i} style={{'--n':i} as CSSProperties}/>)}</div>,
  holo:<div className="holo-disc"/>, neon:<span className="neon-word">НОЧНОЙ<br/>ЭФИР</span>,
  wireframe:<div className="wire-sphere"/>,glass:<div className="glass-stack"><i/><i/><i/></div>,
  editorial:<div className="editorial-type">Полевые<br/>заметки<span>ВЫПУСК 01</span></div>,
  bauhaus:<div className="bauhaus-composition"><i/><b/><span/></div>,
  brutal:<div className="brutal-sticker">БЕЗ<br/>РАМОК</div>,isometric:<div className="iso-cube"><i/><i/><i/></div>,
  pixel:<div className="pixel-tiles">{Array.from({length:25},(_,i)=><i key={i}/>)}</div>,
  aurora:<div className="aurora-ribbon"/>,blueprint:<div className="plan-lines"><span>СЕЧЕНИЕ А—А</span><i/><b>1:50</b></div>,
  deco:<div className="deco-sun">✳</div>,dashboard:<div className="dash-mini"><span>ОБЗОР / ДАННЫЕ</span><b>84,6</b><i/><div className="bars">{Array.from({length:12},(_,i)=><em key={i} style={{height:`${20+(i*17)%75}%`}}/>)}</div></div>,
  comic:<span className="comic-burst">УХ!</span>,clay:<div className="clay-shapes"><i/><i/><i/></div>,
  swiss:<div className="swiss-grid"><i/><i/><i/><span>01 / 03</span></div>,retro:<><div className="retro-grid"/><span className="retro-sun"/></>,
  ascii:<pre className="ascii-art">{'░▒▓ SVIROXK ▓▒░\n  ЦИФРОВОЙ\n  ДИЗАЙН'}</pre>,gradient:<div className="gradient-blob"/>,
  halftone:<div className="halftone-orb"/>,maximal:<span className="maximal-star">✳</span>,
  volt:<div className="volt-card"><i/><span>МОДЕЛЬ / 01</span></div>,
  pulse:<div className="pulse-card"><i/><i/><i/><span>СОСТОЯНИЕ / В НОРМЕ</span></div>,
  folio:<div className="folio-type">ПОЛЕ<br/>ЗАПИСЕЙ</div>,
  signal:<div className="signal-bars">{Array.from({length:19},(_,i)=><i key={i} style={{'--bar':`${16+Math.abs(Math.sin(i*.6))*80}%`} as CSSProperties}/>)}</div>,
  kinetic:<div className="kinetic-form"><i/><i/><i/></div>,
 }
 return <div className={`style-art art-${item.className} ${compact?'compact':''}`} data-style-visual={item.className} role="img" aria-label={`Демонстрация стиля «${item.localName}»`} style={{'--palette-accent':item.palette[1],'--palette-primary':item.palette[0],'--palette-third':item.palette[2]} as CSSProperties}>
  <span className="style-art-index">{item.eyebrow.split('/')[0]} / SVIROXK</span>
  <div className={`style-art-scene scene-style-${item.className}`} aria-hidden="true"><i/><i/><i/><b/><b/><span/></div>
  {visualByClass[item.className]}
  <div className="style-demo-ui" aria-hidden="true"><span className="style-demo-label">{item.category} / ИНТЕРФЕЙС</span><b>{item.localName}</b><i>{item.example}</i><span className="style-demo-action">СМОТРЕТЬ ПРОЕКТ <em>↗</em></span><span className="style-demo-palette">{item.palette.map(color=><em key={color} style={{backgroundColor:color}}/>)}</span></div>
  <div className="style-art-caption"><strong>{item.localName}</strong><span>{item.name}</span></div>
 </div>
}
export function StyleCard({ item, index = 0 }: { item: Style; index?: number }) {
 const [saved,setSaved]=useState(()=>{try{return (JSON.parse(localStorage.getItem('sviroxk-favorite-styles')||'[]') as string[]).includes(item.slug)}catch{return false}})
 const toggleFavorite=(event:React.MouseEvent<HTMLButtonElement>)=>{event.preventDefault();event.stopPropagation();try{const favorites=JSON.parse(localStorage.getItem('sviroxk-favorite-styles')||'[]') as string[];const next=saved?favorites.filter(slug=>slug!==item.slug):[...new Set([...favorites,item.slug])];localStorage.setItem('sviroxk-favorite-styles',JSON.stringify(next));setSaved(!saved);window.dispatchEvent(new CustomEvent('sviroxk-favorites-changed',{detail:next}))}catch{/* Private browsing may disable local storage. */}}
 return <motion.article className={`style-card card-${item.className}`} data-style-card={item.slug} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.5,delay:(index%3)*.06}}><Link to={`/styles/${item.slug}`} className="card-link"><StyleArt item={item} compact/><div className="style-card-info"><div><span className="eyebrow">{item.category} · {item.eyebrow.split('/')[0]}</span><h3>{item.localName}</h3><span className="style-international-name">{item.name}</span></div><span className="circle-arrow"><ArrowUpRight size={17}/></span></div></Link><button className={`favorite-style ${saved?'saved':''}`} type="button" aria-pressed={saved} aria-label={`${saved?'Убрать из избранного':'Добавить в избранное'}: ${item.localName}`} onClick={toggleFavorite}><Heart size={16} fill={saved?'currentColor':'none'}/></button></motion.article>
}

export function ProjectArtwork({ slug, compact = false }: { slug: string; compact?: boolean }) {
 const project=projects.find(item=>item.slug===slug)
 const sceneStyle={'--scene-a':project?.palette[0]??'#d7fb62','--scene-b':project?.palette[1]??'#20251f','--scene-c':project?.palette[2]??'#f0eee7'} as CSSProperties
 const [tilt,setTilt]=useState({x:0,y:0});const labels: Record<string,string>={morrow:'Морроу / предметы для повседневной жизни',objects:'Предметный дизайн / объёмная композиция',after:'Ночное радио / визуализация эфира',form:'Архитектура / чертёжная сцена',tinyworlds:'Маленькие миры / учебная карта',still:'Тихий ритуал / концепция продукта',volt:'Вольт / электромобиль',northstar:'Полярис / карта путешествия',ledger:'Леджер / обзор финансов',pulse:'Пульс / панель данных',saffron:'Шафран и соль / меню ресторана',folio:'Личный архив / творческое портфолио',kinetic:'Движение формы / цифровой эксперимент',common:'Общее дело / корпоративный сайт',orbit:'Орбита / карта обучения',frame:'Кадр за кадром / программа фестиваля',mechanica:'Механика света / редактор графики',civic:'Город рядом / схема городской среды',atelier:'Ателье открытого кода / студия',signal:'Сигнал / музыкальный архив',commonwealth:'Общее пространство / архитектурная схема',daybreak:'Первый свет / уход за кожей',fieldnotes:'Полевые заметки / редакционный журнал',terracotta:'Терракота / каталог предметов',orbitlab:'Лаборатория орбиты / учебный интерфейс'}
 return <div className={`project-art scene-${slug} ${compact?'scene-compact':''}`} data-project-visual={slug} role="img" aria-label={labels[slug]??'Авторская визуальная концепция Студии SVIROXK'} onPointerMove={e=>{if(compact||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=e.currentTarget.getBoundingClientRect();setTilt({x:(e.clientX-r.left)/r.width-.5,y:(e.clientY-r.top)/r.height-.5})}} onPointerLeave={()=>setTilt({x:0,y:0})} style={{...sceneStyle,'--tilt-x':`${tilt.x*5}deg`,'--tilt-y':`${tilt.y*-5}deg`,'--scene-index':String(Math.max(1,['morrow','objects','after','form','tinyworlds','still','volt','northstar','ledger','pulse','saffron','folio','kinetic','common','orbit','frame','mechanica','civic','atelier','signal','commonwealth','daybreak','fieldnotes','terracotta','orbitlab'].indexOf(slug)+1))} as CSSProperties}><div className="scene-grid"/><div className="scene-noise"/>
  {slug==='morrow'&&<div className="morrow-world"><i/><b/><span/></div>}{['objects','terracotta'].includes(slug)&&<div className={`objects-world ${slug==='terracotta'?'terracotta-world':''}`}><i/><b/><span/><em/></div>}{['after','signal'].includes(slug)&&<div className={`after-world ${slug==='signal'?'signal-world':''}`}><i/>{Array.from({length:37},(_,i)=><b key={i} style={{'--bar':`${18+Math.abs(Math.sin(i*.59))*78}%`,'--n':i} as CSSProperties}/>)}<span>23:48 ━━━●━━ ◀ Ⅱ ▶</span></div>}{['form','commonwealth'].includes(slug)&&<div className={`form-world ${slug==='commonwealth'?'commonwealth-world':''}`}><i/><b/><span/><em/><small>СХЕМА 01 / МАСШТАБ 1:100</small></div>}{slug==='tinyworlds'&&<div className="tiny-world"><i/><b/><span/><em/><small/></div>}{slug==='northstar'&&<div className="northstar-world"><i/><b/><span/><em/></div>}{slug==='civic'&&<div className="tiny-world civic-world"><i/><b/><span/><em/><small/></div>}{slug==='still'&&<div className="still-world"><i/><b/><span/><em/></div>}{slug==='saffron'&&<div className="saffron-world"><i/><b/><span/><em/></div>}{slug==='daybreak'&&<div className="still-world daybreak-world"><i/><b/><span/><em/></div>}
  {slug==='volt'&&<div className="volt-world"><i/><b/><span/><em>ВОЛЬТ / ЭЛЕКТРИЧЕСКИЙ ГОРОДСКОЙ АВТОМОБИЛЬ</em></div>}{slug==='ledger'&&<div className="ledger-world"><i/><b>48 290</b><span>{Array.from({length:16},(_,i)=><em key={i} style={{'--bar':`${20+Math.abs(Math.sin(i*.47))*72}%`} as CSSProperties}/>)}</span></div>}{slug==='pulse'&&<div className="pulse-world"><i/><b/><span/><em/></div>}{['folio','fieldnotes'].includes(slug)&&<div className={`folio-world ${slug==='fieldnotes'?'fieldnotes-world':''}`}><i/><b/><span>ЗАПИСИ / АРХИВ / 2026</span></div>}{['kinetic','mechanica'].includes(slug)&&<div className={`kinetic-world ${slug==='mechanica'?'mechanica-world':''}`}><i/><b/><span/><em/></div>}{slug==='atelier'&&<div className="atelier-world"><i/><b/><span/><em/></div>}{slug==='common'&&<div className="common-world"><i/><b/><span/><em/></div>}{['orbit','orbitlab'].includes(slug)&&<div className={`orbit-world ${slug==='orbitlab'?'orbitlab-world':''}`}><i/><b/><span/><em/></div>}{slug==='frame'&&<div className="frame-world"><i/><b/><span/><em>ПРОГРАММА / КИНОФЕСТИВАЛЬ</em></div>}
  <span className="scene-index">SVIROXK / {String(Math.max(1,['morrow','objects','after','form','tinyworlds','still','volt','northstar','ledger','pulse','saffron','folio','kinetic','common','orbit','frame','mechanica','civic','atelier','signal','commonwealth','daybreak','fieldnotes','terracotta','orbitlab'].indexOf(slug)+1)).padStart(2,'0')}</span></div>
}

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
 return <motion.article className={`project-card project-${project.tone}`} whileHover={{y:-9}} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.7,delay:(index%2)*.12}}><Link to={`/work/${project.slug}`} className="project-link"><div className="project-image"><ProjectArtwork slug={project.slug} compact/><span className="project-open"><MoveUpRight size={19}/></span><span className="concept-tag">Концептуальный проект · SVIROXK</span></div><div className="project-copy"><div><span className="eyebrow">{project.category} / {styles.find(style=>style.slug===project.styleSlug)?.localName??project.style}</span><h3>{project.title}</h3></div><p>{project.kind}</p></div></Link></motion.article>
}
