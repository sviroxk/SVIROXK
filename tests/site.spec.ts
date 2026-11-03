import { expect, test } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { projects, services, styles } from '../src/data'
import { serviceDetails, caseStudies } from '../src/experience'
import { additionalCaseStudies } from '../src/caseExtras'

const screenshots = process.env.SCREENSHOTS === '1'
test.setTimeout(180_000)
const commonRoutes = ['/', '/work', '/styles', '/services', '/process', '/contact', '/order', '/advisor', '/compare', '/configurator', '/history', '/faq', '/privacy', '/terms']
const allRoutes = [...commonRoutes, ...projects.map(p=>`/work/${p.slug}`), ...styles.map(s=>`/styles/${s.slug}`), ...serviceDetails.map(s=>`/services/${s.slug}`)]

test('project, style and service matrices are complete and unique', async () => {
  expect(projects).toHaveLength(25)
  expect(styles).toHaveLength(27)
  expect(serviceDetails).toHaveLength(11)
  expect(new Set(projects.map(p=>p.slug)).size).toBe(projects.length)
  expect(new Set(styles.map(s=>s.slug)).size).toBe(styles.length)
  expect(new Set(serviceDetails.map(s=>s.slug)).size).toBe(serviceDetails.length)
  for (const project of projects) {
    expect(styles.some(s=>s.slug===project.styleSlug), project.slug).toBeTruthy()
    expect(Boolean(caseStudies[project.slug]||additionalCaseStudies[project.slug]), project.slug).toBeTruthy()
  }
  for (const service of services) expect(serviceDetails.some(d=>d.name===service.name),service.name).toBeTruthy()
})

test('all application routes render content without JS errors or horizontal overflow', async ({page},testInfo) => {
  const errors:string[]=[]
  page.on('pageerror',e=>errors.push(e.message))
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
  for(const route of allRoutes){
    await page.goto(`/#${route}`,{waitUntil:'domcontentloaded'})
    await expect(page.locator('main h1').first(),route).toBeVisible({timeout:15000})
    if(route.startsWith('/styles/')){const slug=route.split('/').at(-1)!;await expect(page.locator(`.style-detail-${styles.find(item=>item.slug===slug)?.className} [data-style-visual]`),route).toHaveCount(1)}
    if(route.startsWith('/work/'))await expect(page.locator(`[data-project-visual="${route.split('/').at(-1)}"]`).first(),route).toBeVisible()
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth)
    expect(overflow,`Горизонтальное переполнение на ${route}`).toBeFalsy()
    if(screenshots){const path=testInfo.outputPath(`${testInfo.project.name}${route==='/'?'_home':route.replaceAll('/','_')}.png`);await mkdir(path.slice(0,path.lastIndexOf('/')),{recursive:true});await expect(page.locator('[data-project-visual], [data-style-visual]').first()).toBeAttached().catch(()=>{});for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=Math.max(300,Math.floor(page.viewportSize()!.height*.75))){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(70)}await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(250);await page.screenshot({path,fullPage:true})}
  }
  expect(errors).toEqual([])
})

test('cosmic field contains triple-density stars pulled toward the cursor', async ({page}) => {
  await page.goto('/#/',{waitUntil:'domcontentloaded'})
  await expect(page.locator('.cosmic-background')).toBeAttached()
  const canvas=page.locator('.cosmic-background')
  const density=await canvas.evaluate(el=>{const ctx=(el as HTMLCanvasElement).getContext('2d')!;let arcs=0;const original=ctx.arc.bind(ctx);ctx.arc=(...args:Parameters<CanvasRenderingContext2D['arc']>)=>{arcs++;return original(...args)};return new Promise<number>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(arcs))))})
  expect(density).toBeGreaterThan(200)
  const before=await canvas.evaluate(el=>{const c=el as HTMLCanvasElement;const g=c.getContext('2d')!;return g.getImageData(0,0,Math.min(c.width,240),Math.min(c.height,240)).data.reduce((sum,v)=>sum+(v>20?1:0),0)})
  await page.mouse.move(195,195);await page.waitForTimeout(300)
  const after=await canvas.evaluate(el=>{const c=el as HTMLCanvasElement;const g=c.getContext('2d')!;return g.getImageData(0,0,Math.min(c.width,240),Math.min(c.height,240)).data.reduce((sum,v)=>sum+(v>20?1:0),0)})
  expect(after).toBeGreaterThan(0);expect(before).toBeGreaterThan(0)
  await page.emulateMedia({reducedMotion:'reduce'});await expect(canvas).toBeHidden()
})

test('process timeline renders all eight usable rows', async ({page}) => {
  await page.goto('/#/process',{waitUntil:'domcontentloaded'})
  const rows=page.locator('.timeline-list .timeline-item')
  await expect(rows).toHaveCount(8)
  for(let i=0;i<8;i++)await expect(rows.nth(i)).toBeVisible()
  await rows.nth(6).click()
  await expect(rows.nth(6)).toHaveClass(/selected/)
  await expect(page.locator('.process-stage h2')).toContainText('Тестирование и публикация')
})

test('style previews show one title and a legible interface example', async ({page}) => {
  await page.goto('/#/styles',{waitUntil:'domcontentloaded'})
  const card=page.locator('[data-style-card="neon"]')
  await expect(card.locator('[data-style-visual]')).toHaveCount(1)
  await expect(card.locator('.style-demo-ui')).toBeVisible()
  await expect(card.locator('.style-art-index')).toBeVisible()
  await expect(card.locator('.style-demo-ui b')).toHaveText('Неонуар')
  await expect(card.locator('.style-demo-ui i')).toBeVisible()
  await expect(card.locator('.style-card-info h3')).toHaveText('Неонуар')
})

test('contact address uses the studio inbox configured for production', async ({page}) => {
  await page.goto('/#/contact',{waitUntil:'domcontentloaded'})
  await expect(page.locator('.contact-email')).toHaveAttribute('href','mailto:sviroxk@gmail.com')
  await expect(page.locator('.contact-email')).toContainText('sviroxk@gmail.com')
})

test('order form reports success only after the delivery endpoint confirms receipt', async ({page}) => {
  await page.route('https://formsubmit.co/ajax/sviroxk@gmail.com',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:'true',message:'ok'})}))
  await page.goto('/#/order',{waitUntil:'domcontentloaded'})
  await page.getByLabel('ИМЯ ИЛИ НАЗВАНИЕ КОМПАНИИ').fill('Тестовый посетитель')
  await page.getByLabel('КОНТАКТ ДЛЯ ОТВЕТА').fill('visitor@example.com')
  await page.getByLabel('ТИП ПРОЕКТА').selectOption({label:'Лендинг'})
  await page.getByLabel('ОПИСАНИЕ ЗАДАЧИ').fill('Проверка тестовой отправки заявки.')
  await page.getByLabel(/Передаю эти сведения студии/).check()
  await page.waitForTimeout(2600)
  await page.getByRole('button',{name:/Отправить запрос/}).click()
  await expect(page.getByRole('status')).toContainText('Сервис подтвердил приём заявки.')
})

test('order form reports delivery errors without marking the inquiry as sent', async ({page}) => {
  await page.route('https://formsubmit.co/ajax/sviroxk@gmail.com',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({success:'false',message:'unavailable'})}))
  await page.goto('/#/order',{waitUntil:'domcontentloaded'})
  await page.getByLabel('ИМЯ ИЛИ НАЗВАНИЕ КОМПАНИИ').fill('Тестовый посетитель')
  await page.getByLabel('КОНТАКТ ДЛЯ ОТВЕТА').fill('visitor@example.com')
  await page.getByLabel('ТИП ПРОЕКТА').selectOption({label:'Лендинг'})
  await page.getByLabel('ОПИСАНИЕ ЗАДАЧИ').fill('Проверка ошибки тестовой доставки.')
  await page.getByLabel(/Передаю эти сведения студии/).check()
  await page.waitForTimeout(2600)
  await page.getByRole('button',{name:/Отправить запрос/}).click()
  await expect(page.getByRole('status')).toContainText('не подтвердил приём')
  await expect(page.getByRole('status')).not.toContainText('Сервис подтвердил приём заявки.')
})

test('legal pages are visibly marked as drafts awaiting owner and legal review', async ({page}) => {
  await page.goto('/#/privacy',{waitUntil:'domcontentloaded'})
  await expect(page.getByRole('note',{name:'Юридические документы требуют проверки'})).toContainText('Требует заполнения и юридической проверки')
  await expect(page.locator('.legal-page')).toContainText('[Владелец: укажите полное имя или юридическое наименование]')
})

test('laptop microcopy is at least 11px and has readable contrast', async ({page}) => {
  await page.setViewportSize({width:1366,height:768})
  await page.goto('/#/',{waitUntil:'domcontentloaded'})
  for(const selector of ['.manifesto-label>span:last-child','.hero-coordinate','.hero-caption']){
    const styles=await page.locator(selector).evaluate(el=>{const s=getComputedStyle(el);return {fontSize:parseFloat(s.fontSize),color:s.color,backgroundColor:getComputedStyle(el.parentElement!).backgroundColor}})
    expect(styles.fontSize,`${selector} font size`).toBeGreaterThanOrEqual(11)
    expect(styles.color).not.toBe('rgba(0, 0, 0, 0)')
  }
})

test('site has a keyboard skip link and visible focus indicator', async ({page}) => {
  await page.goto('/#/',{waitUntil:'domcontentloaded'})
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await expect(page.locator('.skip-link')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('main')).toBeFocused()
})

test('route-specific metadata has canonical URL and current route title', async ({page}) => {
  await page.goto('/#/work/morrow',{waitUntil:'domcontentloaded'})
  await expect(page).toHaveTitle(/Морроу — жить медленнее/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sviroxk.github.io/SVIROXK/work/morrow/')
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content','https://sviroxk.github.io/SVIROXK/work/morrow/')
})

test('case screens switch tabs and device layout; project style preselects order form', async ({page}) => {
  await page.goto('/#/work/morrow',{waitUntil:'domcontentloaded'})
  await expect(page.locator('[data-project-screens]')).toBeVisible()
  const heading=page.locator('.case-screens h2')
  const first=await heading.innerText()
  await page.getByRole('tab').nth(1).click()
  await expect(heading).not.toHaveText(first)
  await expect(page.locator('[data-screen-page="1"] .variant-card')).toHaveCount(3)
  await page.getByRole('tab').nth(2).click()
  await expect(page.locator('[data-screen-page="2"] .variant-detail-copy')).toBeVisible()
  await page.getByRole('tab').nth(3).click()
  await expect(page.locator('[data-screen-page="3"] .variant-form-row')).toBeVisible()
  await page.getByRole('button',{name:'Телефон'}).click()
  await expect(page.getByRole('button',{name:'Телефон'})).toHaveAttribute('aria-pressed','true')
  await page.goto('/#/work/morrow')
  await page.getByRole('link',{name:/Обсудить похожий проект/}).click()
  await expect(page.locator('select[name="style"]')).toHaveValue('gradient')
})

test('portfolio search works together with category filters and style favorites persist', async ({page}) => {
  await page.goto('/#/work',{waitUntil:'domcontentloaded'})
  await page.getByRole('textbox',{name:'Поиск по портфолио'}).fill('форма')
  await page.getByRole('button',{name:'Архитектура',exact:true}).click()
  await expect(page.locator('.project-card')).toHaveCount(1)
  await expect(page.getByRole('textbox',{name:'Поиск по портфолио'})).toHaveValue('форма')
  await expect(page.getByRole('button',{name:'Архитектура',exact:true})).toHaveClass(/active/)
  await page.goto('/#/styles',{waitUntil:'domcontentloaded'})
  const favorite=page.getByRole('button',{name:/Добавить в избранное/}).first()
  await favorite.click()
  await expect(page.getByRole('button',{name:/Убрать из избранного/}).first()).toHaveAttribute('aria-pressed','true')
  const favoriteName=await page.locator('[data-style-card]').first().locator('h3').innerText()
  await page.goto('/#/compare',{waitUntil:'domcontentloaded'})
  await expect(page.getByRole('button',{name:new RegExp(favoriteName)})).toHaveAttribute('aria-pressed','true')
})

test('viewport smoke matrix has no horizontal overflow and nav remains usable', async ({page}) => {
  test.setTimeout(90_000)
  for(const size of [{width:320,height:720},{width:360,height:800},{width:390,height:844},{width:768,height:1024},{width:1024,height:768},{width:1280,height:800},{width:1440,height:900},{width:1920,height:1080}]){
    await page.setViewportSize(size);await page.goto('/#/work',{waitUntil:'domcontentloaded'});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),`${size.width}x${size.height}`).toBeTruthy()
    if(size.width<=700){const toggle=page.getByRole('button',{name:/меню/});if(await toggle.getAttribute('aria-expanded')==='false')await toggle.click();await expect(page.getByRole('navigation',{name:'Основная навигация'}).getByRole('link',{name:'Работы'})).toBeVisible()}
  }
})
