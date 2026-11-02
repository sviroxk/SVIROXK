import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, MoveUpRight } from 'lucide-react'
import { Link, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Footer, Header, PageIntro, SectionHead } from './components/Chrome'
import { ParticleCanvas, ProjectCard, StyleArt, StyleCard } from './components/Visual'
import { projects, services, steps, styles } from './data'

function SEO({ title, description }: { title: string; description: string }) {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const canonical = (document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null) ?? document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${window.location.origin}${import.meta.env.BASE_URL}`
    if (!canonical.parentNode) document.head.appendChild(canonical)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
  }, [title, description, pathname, hash])
  return null
}

function Layout() {
  return <><Header/><main><Routes>
    <Route path="/" element={<Home/>}/><Route path="/work" element={<Work/>}/><Route path="/work/:slug" element={<ProjectDetail/>}/>
    <Route path="/styles" element={<StyleCatalog/>}/><Route path="/styles/:slug" element={<StyleDetail/>}/><Route path="/services" element={<Services/>}/>
    <Route path="/process" element={<Process/>}/><Route path="/order" element={<Order/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/>
  </Routes></main><Footer/></>
}

function Home() {
  return <><SEO title="ONDA Studio — цифровые впечатления с характером" description="Независимая digital-студия ONDA. Авторские сайты, интерактивные системы и цифровые впечатления с характером."/>
    <section className="hero"><ParticleCanvas/><div className="hero-top"><span className="eyebrow">INDEPENDENT DIGITAL STUDIO · EST. 2020</span><span className="hero-coordinate">55°45' N&nbsp; 37°37' E<br/>WORKING EVERYWHERE</span></div>
      <div className="hero-title-wrap"><motion.span className="hero-side-note" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.9}}>WE MAKE<br/>THE WEB FEEL<br/>SOMETHING.</motion.span>
        <motion.h1 initial={{opacity:0,y:55}} animate={{opacity:1,y:0}} transition={{duration:.85,ease:[.2,.7,.2,1]}}>FORM<br/><span>FOLLOWS</span><br/><i>FEELING</i><sup>®</sup></motion.h1><div className="hero-orb" aria-hidden="true"><span>O</span><i/><b/></div></div>
      <div className="hero-bottom"><p>Мы проектируем цифровой опыт,<br/>который остаётся с вами.</p><Link className="hero-link" to="/work">Исследовать студию <ArrowDown size={16}/></Link><span className="hero-caption">DESIGN · DIGITAL · MOTION</span></div><div className="hero-scroll-line"/>
    </section>
    <section className="manifesto section-pad"><div className="manifesto-label"><span className="eyebrow">01 / OUR POINT OF VIEW</span><span>ИНТЕРНЕТ МОЖЕТ<br/>ЧУВСТВОВАТЬСЯ.</span></div><div className="manifesto-copy"><p>Хороший сайт не просто показывает. <em>Он открывает дверь</em> в мир, которого до этого не было.</p><div className="manifesto-foot"><span>Идеи на стыке ясности<br/>и приятного удивления.</span><Link to="/services" className="text-link">Что мы создаём <ArrowUpRight size={15}/></Link></div></div></section>
    <section className="work-preview section-pad"><SectionHead kicker="02 / SELECTED WORLDS" title={<>Вымышленные миры.<br/>Настоящее мастерство.</>} href="/work" label="Все концепты"/><div className="project-grid home-projects">{projects.slice(0,3).map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div><p className="concept-note"><i/> Авторские концепции студии · Не являются коммерческими заказами</p></section>
    <section className="style-preview section-pad"><div className="style-preview-heading"><div><span className="eyebrow">03 / A WORLD OF DIRECTIONS</span><h2>Один замысел.<br/><em>Много состояний.</em></h2></div><p>Выберите визуальный язык, который<br/>говорит за ваш бренд.</p></div><div className="style-mosaic">{styles.slice(0,4).map((s,i)=><StyleCard key={s.slug} item={s} index={i}/>)}</div><Link to="/styles" className="style-discover">ОТКРЫТЬ АТЛАС НАПРАВЛЕНИЙ <ArrowUpRight size={15}/></Link></section>
    <section className="home-cta"><div className="cta-grain"/><span className="eyebrow">04 / YOUR NEXT CHAPTER</span><h2>А что, если<br/><em>ваш сайт</em> —<br/>это целый мир?</h2><Link to="/order" className="button-light">Начать разговор <MoveUpRight size={17}/></Link><span className="cta-star">✳</span></section>
  </>
}

function Work() {
  const [filter,setFilter] = useSearchParams()
  const categories = ['Все направления','Бренд-концепт','Арт-дирекшн','Цифровая культура','Архитектура','Образование','Beauty & care','Liquid gradient','Swiss precision','Neo-noir','Blueprint','Soft sculpture','Holographic','Интернет-магазин','Промо-сайт','Портфолио','Веб-приложение','Лендинг']
  const current = filter.get('type') ?? 'Все направления'
  const shown = current === 'Все направления' ? projects : projects.filter(p => p.category===current || p.style===current || p.kind===current)
  return <><SEO title="Концептуальные проекты — ONDA Studio" description="Галерея авторских концептуальных цифровых проектов ONDA Studio."/><PageIntro index="01" title={<>Визуальные<br/><em>исследования.</em></>} text="Каждый проект здесь — авторская концепция и способ проверить, куда может привести одна хорошая идея."/>
    <section className="work-gallery section-pad"><div className="filter-row"><span className="eyebrow">{String(shown.length).padStart(2,'0')} / CONCEPT STUDIES</span><div className="filter-pills">{categories.map(c=><button className={current===c?'active':''} onClick={()=>setFilter(c==='Все направления'?{}:{type:c})} key={c}>{c}</button>)}</div></div>
      <div className="project-grid gallery-grid">{shown.map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div><p className="concept-note"><i/> Все работы — авторские концептуальные проекты ONDA Studio, не реальные клиентские заказы.</p></section>
  </>
}

function ProjectDetail() {
  const {slug}=useParams(); const project=projects.find(p=>p.slug===slug); if(!project)return <NotFound/>; const next=projects[(projects.indexOf(project)+1)%projects.length]
  return <><SEO title={`${project.title} — концепт ONDA Studio`} description={project.description}/><section className="detail-hero"><Link to="/work" className="back-link"><ArrowLeft size={15}/> Все концепты</Link><span className="eyebrow">CONCEPT STUDY / 2025 · {project.category}</span><h1>{project.title}</h1><p>{project.description}</p><div className="detail-image"><img src={`https://images.unsplash.com/${project.image}?auto=format&fit=crop&w=2000&q=88`} alt={`Концептуальный проект ${project.title}`}/><span className="concept-tag">ONDA / INDEPENDENT EXPLORATION</span></div></section>
    <section className="project-story section-pad"><div><span className="eyebrow">THE IDEA / 01</span><h2>Цифровое пространство<br/>с собственным <em>ритмом.</em></h2></div><div><p>{project.description} Мы исследуем, как типографика, движение и композиция могут превращать обычный просмотр в небольшой опыт.</p><div className="project-meta"><span>НАПРАВЛЕНИЕ <b>{project.style}</b></span><span>ТИП <b>{project.kind}</b></span><span>СТАТУС <b>Авторский концепт</b></span></div></div></section><Link className="next-project" to={`/work/${next.slug}`}><span>СЛЕДУЮЩИЙ КОНЦЕПТ</span><b>{next.title}</b><ArrowRight/></Link>
  </>
}

function StyleCatalog() {
  const [filter,setFilter]=useSearchParams(); const categories=['Все направления',...Array.from(new Set(styles.map(s=>s.category)))]; const current=filter.get('category')??'Все направления'; const shown=current==='Все направления'?styles:styles.filter(s=>s.category===current)
  return <><SEO title="Атлас визуальных направлений — ONDA Studio" description="Интерактивная коллекция из 22 визуальных языков для авторских цифровых проектов."/><PageIntro index="02" title={<>Атлас<br/><em>возможностей.</em></>} text="Двадцать два самостоятельных визуальных языка. Не шаблоны — отправные точки для проектов, у которых ещё нет готовой формы."/>
    <section className="atlas section-pad"><div className="atlas-intro"><span>22<br/>визуальных языка</span><p>Каждое направление — маленький самостоятельный мир со своим светом, ритмом и настроением.</p></div><div className="filter-row"><span className="eyebrow">EXPLORE BY MOOD</span><div className="filter-pills">{categories.map(c=><button className={current===c?'active':''} onClick={()=>setFilter(c==='Все направления'?{}:{category:c})} key={c}>{c}</button>)}</div></div><div className="atlas-grid">{shown.map((s,i)=><StyleCard key={s.slug} item={s} index={i}/>)}</div></section>
  </>
}

function StyleDetail() {
  const{slug}=useParams(); const style=styles.find(s=>s.slug===slug); if(!style)return <NotFound/>
  return <><SEO title={`${style.name} — визуальное направление ONDA`} description={style.description}/><section className={`style-detail style-detail-${style.className}`}><Link to="/styles" className="back-link"><ArrowLeft size={15}/> Атлас направлений</Link><span className="eyebrow">{style.eyebrow} · VISUAL LANGUAGE</span><h1>{style.name}<sup>®</sup></h1><p>{style.description}</p><StyleArt item={style}/><div className="style-detail-foot"><span>НАСТРОЕНИЕ <b>{style.mood}</b></span><span>ПРИМЕР <b>{style.example}</b></span><Link to={`/order?style=${style.slug}`} className="button-dark">Создать сайт в этом стиле <MoveUpRight size={16}/></Link></div></section>
    <section className="style-notes section-pad"><span className="eyebrow">A CLOSER LOOK / {style.slug.toUpperCase()}</span><div className="style-notes-grid"><div><span className="eyebrow">ЦВЕТОВАЯ ПАЛИТРА</span><div className="palette-swatches">{style.palette.map(color=><span key={color} style={{backgroundColor:color}} title={color}/>)}</div><div className="palette-codes">{style.palette.map(c=><code key={c}>{c}</code>)}</div></div><div><span className="eyebrow">ИНТОНАЦИЯ</span><h2>{style.mood.split(' · ').join(' / ')}</h2><p>Дизайн задаёт настроение до первого прочитанного слова. Мы адаптируем визуальный язык к смыслу и задачам вашего проекта.</p></div></div></section>
  </>
}

function Services() {
  return <><SEO title="Услуги студии — ONDA Studio" description="Разработка сайтов, digital identity, интернет-магазины, интерактивный web и редизайн."/><PageIntro index="03" title={<>Делаем сложное<br/><em>ощутимым.</em></>} text="Собираем стратегию, выразительный дизайн и аккуратную разработку в единый цифровой опыт."/>
    <section className="services-list section-pad">{services.map(s=><article className="service-row" key={s.number}><span className="service-number">{s.number}</span><div className="service-main"><h2>{s.name}</h2><p>{s.details}</p></div><span className="service-tags">{s.tags}</span><Link to={`/order?service=${encodeURIComponent(s.name)}`} className="service-arrow" aria-label={`Заказать: ${s.name}`}><ArrowUpRight/></Link></article>)}</section>
    <section className="service-examples section-pad"><SectionHead kicker="A GOOD PLACE TO BEGIN" title="Не знаете, с чего начать?"/><p>Расскажите, чего хотите достичь. Вместе выберем формат, масштаб и направление.</p><Link to="/order" className="button-dark">Обсудить задачу <MoveUpRight size={16}/></Link><div className="service-styles">{styles.slice(2,5).map((s,i)=><StyleCard key={s.slug} item={s} index={i}/>)}</div></section>
  </>
}

function Process() {
  const [active,setActive]=useState(0)
  const details=['Знакомимся, задаём правильные вопросы и проверяем, совпадают ли наши представления о результате.','Разбираемся в аудитории, задачах и содержании. Фиксируем цели, объём работ и ограничения.','Собираем направление: смысл, настроение, референсы и основу будущей системы.','Проектируем страницы, состояния и поведение интерфейса — сначала смысл, затем форма.','Превращаем утверждённую систему в адаптивный интерфейс с аккуратной семантикой и доступностью.','Проверяем разные экраны, интерактивность, контент, производительность и детали.','Готовим production-сборку, настраиваем домен и публикуем согласованную версию.','Передаём исходники и доступы, показываем устройство проекта и остаёмся на связи.']
  return <><SEO title="Как мы работаем — ONDA Studio" description="Восемь этапов разработки сайта: от первого разговора до публикации и передачи."/><PageIntro index="04" title={<>Хорошая работа<br/><em>без загадок.</em></>} text="Понятный процесс, общие решения и регулярная связь. Вы знаете, что происходит и зачем — на каждом шаге."/>
    <section className="process section-pad"><div className="process-label"><span className="eyebrow">THE MAKING OF</span><span>01 — 08</span><div className="process-progress"><i style={{width:`${(active+1)*12.5}%`}}/></div></div><div className="process-layout"><div className="timeline-list">{steps.map((s,i)=><button className={active===i?'timeline-item selected':''} key={s} onClick={()=>setActive(i)}><span>0{i+1}</span><b>{s}</b><ArrowRight size={17}/></button>)}</div><div className="process-stage"><span className="stage-ring"><i>{String(active+1).padStart(2,'0')}</i></span><span className="eyebrow">STAGE {String(active+1).padStart(2,'0')} / FIELD GUIDE</span><h2>{steps[active]}</h2><p>{details[active]}</p><div className="stage-controls"><button onClick={()=>setActive((active+7)%8)} aria-label="Предыдущий этап"><ArrowLeft/></button><button onClick={()=>setActive((active+1)%8)} aria-label="Следующий этап"><ArrowRight/></button></div></div></div></section>
    <section className="process-cta"><span className="eyebrow">READY WHEN YOU ARE</span><h2>У каждого проекта<br/><em>свой первый шаг.</em></h2><Link to="/order" className="button-light">Обсудить ваш проект <MoveUpRight size={16}/></Link></section>
  </>
}

function Order() {
  const[params]=useSearchParams(); const [status,setStatus]=useState<'idle'|'sending'|'sent'|'error'>('idle'); const [message,setMessage]=useState(''); const style=styles.find(s=>s.slug===params.get('style')); const selectedService=params.get('service')??''
  async function submit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); setStatus('sending'); setMessage(''); const form=new FormData(e.currentTarget); const data=Object.fromEntries(form.entries()); const endpoint=import.meta.env.VITE_CONTACT_ENDPOINT; const contactEmail=import.meta.env.VITE_CONTACT_EMAIL
    try {
      if(endpoint) { const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); if(!response.ok)throw new Error('The form endpoint rejected the submission.'); setStatus('sent'); setMessage('Заявка отправлена. Мы свяжемся с вами.') }
      else if(contactEmail) { const body=Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n'); const mailto=`mailto:${contactEmail}?subject=${encodeURIComponent('Новый проект для ONDA Studio')}&body=${encodeURIComponent(body)}`; window.location.href=mailto; setStatus('sent'); setMessage('Открыто письмо в почтовом приложении. Отправьте его, чтобы мы получили заявку.') }
      else { setStatus('error'); setMessage('Форма пока не подключена. Перед публикацией настройте endpoint формы или проверенный адрес электронной почты.') }
    } catch { setStatus('error'); setMessage('Не удалось передать заявку. Проверьте настройки формы или попробуйте позже.') }
  }
  return <><SEO title="Заказать сайт — ONDA Studio" description="Расскажите о проекте, и мы обсудим подходящий формат, визуальное направление и сроки."/><PageIntro index="05" title={<>Начнём<br/><em>с разговора.</em></>} text="Несколько деталей помогут нам подготовиться к первой беседе. Это не обязывает вас заказывать проект."/>
    <section className="order-section section-pad"><aside className="order-aside"><span className="eyebrow">YOUR BRIEF / 01</span><h2>У каждого<br/>хорошего сайта<br/>есть <em>причина.</em></h2><p>Расскажите, что должно измениться, когда сайт появится. Мы ответим в течение двух рабочих дней.</p>{import.meta.env.VITE_CONTACT_EMAIL?<a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} className="text-link">{import.meta.env.VITE_CONTACT_EMAIL} <ArrowUpRight size={15}/></a>:<span className="text-link">Канал связи настраивается при публикации</span>}{style&&<div className="selected-style"><StyleArt item={style} compact/><span className="eyebrow">ВЫБРАННОЕ НАПРАВЛЕНИЕ</span><b>{style.name}</b></div>}</aside>
      <form className="order-form" onSubmit={submit}><label>ИМЯ ИЛИ КОМПАНИЯ <input name="name" placeholder="Как к вам обращаться?" required minLength={2}/></label><label>КОНТАКТНЫЕ ДАННЫЕ <input name="contact" placeholder="Email или телефон" required type="text" minLength={5}/></label>
        <label>ТИП ПРОЕКТА <span className="select-wrap"><select name="type" defaultValue={selectedService}><option value="" disabled>Выберите формат</option>{['Лендинг','Многостраничный сайт','Портфолио','Корпоративный сайт','Интернет-магазин','Веб-приложение','Редизайн','Интерактивный / 3D-сайт','Другое',...services.map(s=>s.name)].map(x=><option key={x}>{x}</option>)}</select><ChevronDown size={15}/></span></label>
        <label>ВИЗУАЛЬНОЕ НАПРАВЛЕНИЕ <span className="select-wrap"><select name="style" defaultValue={style?.slug??''}><option value="">Помогите выбрать</option>{styles.map(s=><option key={s.slug} value={s.slug}>{s.name}</option>)}</select><ChevronDown size={15}/></span></label>
        <div className="form-columns"><label>БЮДЖЕТ <span className="select-wrap"><select name="budget" defaultValue=""><option value="" disabled>Выберите диапазон</option><option>До 5 000 €</option><option>5 000 — 12 000 €</option><option>12 000 — 25 000 €</option><option>25 000 €+</option><option>Обсудим вместе</option></select><ChevronDown size={15}/></span></label><label>СРОКИ <span className="select-wrap"><select name="timeline" defaultValue=""><option value="" disabled>Когда нужен сайт?</option><option>В течение месяца</option><option>1–3 месяца</option><option>3–6 месяцев</option><option>Гибкие сроки</option></select><ChevronDown size={15}/></span></label></div>
        <label>О ПРОЕКТЕ <textarea name="description" placeholder="Задача, аудитория, что уже известно — любая отправная точка." rows={4} required minLength={12}/></label><label>ССЫЛКИ И РЕФЕРЕНСЫ <input name="references" type="url" placeholder="https://"/></label><label className="consent"><input type="checkbox" required/><span>Согласен(на) на обработку данных, указанных для ответа на запрос.</span></label><button className="button-dark submit-button" disabled={status==='sending'}>{status==='sending'?'Отправляем…':'Отправить запрос'} <MoveUpRight size={16}/></button>{message&&<p className={`form-message ${status}`} role="status">{message}</p>}
      </form>
    </section>
  </>
}

function Contact() {
  return <><SEO title="Контакты — ONDA Studio" description="Контакты независимой digital-студии ONDA."/><PageIntro index="06" title={<>Всегда открыты<br/><em>к диалогу.</em></>} text="Расскажите о новой идее, сложной задаче или просто поздоровайтесь."/>
    <section className="contact-section section-pad"><div className="contact-note"><span className="eyebrow">SAY HELLO / 24—7</span>{import.meta.env.VITE_CONTACT_EMAIL?<a href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`} className="contact-email">{import.meta.env.VITE_CONTACT_EMAIL} <ArrowUpRight/></a>:<span className="contact-email">Канал связи настраивается <ArrowUpRight/></span>}<span className="contact-response">Настройте email или endpoint формы перед публикацией.</span><Link to="/order" className="button-dark">Расскажите о проекте <MoveUpRight size={16}/></Link></div>
      <div className="contact-card"><div className="contact-graphic"><span>◉</span><i/><b>ONDA<br/>STUDIO</b><small>55°45' N / 37°37' E</small></div><span className="eyebrow">INDEPENDENT BY NATURE</span><p>Независимая digital-студия, открытая к работе с людьми и идеями по всему миру.</p><div className="contact-detail"><span>РАБОТАЕМ</span><b>Глобально · удалённо</b></div><div className="contact-detail"><span>ФОРМАТ</span><b>Новые проекты — открыто</b></div></div>
    </section>
  </>
}

function NotFound() { return <section className="not-found"><span className="eyebrow">404 / WRONG TURN</span><h1>Эта страница<br/><em>ещё не придумана.</em></h1><Link to="/" className="button-dark">На главную <ArrowLeft size={16}/></Link></section> }
export default function App() { return <Layout/> }
