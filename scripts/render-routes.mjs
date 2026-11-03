import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve('dist')
const template = await readFile(resolve(root, 'index.html'), 'utf8')
const [dataSource, experienceSource] = await Promise.all([
  readFile(new URL('../src/data.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/experience.ts', import.meta.url), 'utf8'),
])
const projectStart = dataSource.indexOf('export const projects:Project[]=')
const serviceStartInData = dataSource.indexOf('\nexport const services=', projectStart)
const projectBlock = dataSource.slice(projectStart, serviceStartInData)
const styleStart = dataSource.indexOf('const baseStyles:Style[]=')
const styleBlock = dataSource.slice(styleStart, dataSource.indexOf('\nexport const styles:Style[]=', styleStart))
const serviceStart = experienceSource.indexOf('export const serviceDetails=[')
const serviceBlock = experienceSource.slice(serviceStart, experienceSource.indexOf('\nexport const pageOptions=', serviceStart))
const routes = [
  ['services', 'Услуги — Студия SVIROXK', 'Сайты, цифровая айдентика, интернет-магазины и интерактивная разработка.'],
  ['work', 'Концептуальные проекты — Студия SVIROXK', 'Портфолио авторских концепций Студии SVIROXK.'],
  ['styles', 'Каталог визуальных стилей — Студия SVIROXK', 'Визуальные системы, примеры и палитры цифровых проектов.'],
  ['process', 'Этапы работы — Студия SVIROXK', 'Понятный процесс от исследования и брифа до запуска проекта.'],
  ['contact', 'Контакты — Студия SVIROXK', 'Связаться со Студией SVIROXK и обсудить цифровой проект.'],
]
for (const match of projectBlock.matchAll(/\{slug:'([^']+)',title:'([^']+)',category:'[^']+',style:'[^']+',styleSlug:'[^']+',palette:\[[^\]]+\],description:'([^']+)'/g)) {
  routes.push([`work/${match[1]}`, `${match[2]} — концепт Студии SVIROXK`, match[3]])
}
for (const match of serviceBlock.matchAll(/\{slug:'([^']+)',name:'([^']+)',summary:'([^']+)'/g)) {
  routes.push([`services/${match[1]}`, `${match[2]} — услуги Студии SVIROXK`, match[3]])
}
for (const match of styleBlock.matchAll(/\{slug:'([^']+)',name:'([^']+)',localName:'([^']+)',eyebrow:'[^']+',description:'([^']+)'/g)) {
  routes.push([`styles/${match[1]}`, `${match[3]} — стиль Студии SVIROXK`, match[4]])
}
routes.push(['privacy', 'Политика конфиденциальности — Студия SVIROXK', 'Черновик политики конфиденциальности Студии SVIROXK. Требует проверки владельцем и юридического подтверждения.'])
routes.push(['terms', 'Условия использования — Студия SVIROXK', 'Черновик условий использования Студии SVIROXK. Требует проверки владельцем и юридического подтверждения.'])
for (const [route, title, description] of routes) {
  const dir = resolve(root, route)
  await mkdir(dir, { recursive: true })
  const canonical = `https://sviroxk.github.io/SVIROXK/${route}/`
  const fallbackPath = `/SVIROXK/${route}/`
  const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const html = template
    .replace('<head>', `<head>\n    <script>if(location.pathname==="${fallbackPath}"){location.replace("/SVIROXK/#/${route}")}</script>`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(description)}$2`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`)
  await writeFile(resolve(dir, 'index.html'), html)
}
console.log(`Generated ${routes.length} route-specific HTML metadata pages for GitHub Pages.`)
