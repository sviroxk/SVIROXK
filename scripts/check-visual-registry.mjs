import { readFile } from 'node:fs/promises'

const data = await readFile(new URL('../src/data.ts', import.meta.url), 'utf8')
const visual = await readFile(new URL('../src/components/Visual.tsx', import.meta.url), 'utf8')
const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8')
const experience = await readFile(new URL('../src/experience.ts', import.meta.url), 'utf8')
const extras = await readFile(new URL('../src/caseExtras.ts', import.meta.url), 'utf8')
const styleBlock = data.slice(data.indexOf('const baseStyles:Style[]='), data.indexOf('export const styles:Style[]='))
const projectBlock = data.slice(data.indexOf('export const projects:Project[]='), data.indexOf('export const services='))
const styles = [...styleBlock.matchAll(/\{slug:'([^']+)'[\s\S]*?className:'([^']+)'/g)].map(m => ({slug:m[1], className:m[2]}))
const projects = [...projectBlock.matchAll(/\{slug:'([^']+)'[\s\S]*?styleSlug:'([^']+)'[\s\S]*?palette:\[([^\]]+)\]/g)].map(m => ({slug:m[1], styleSlug:m[2], palette:m[3].split(',').map(x=>x.replaceAll("'",'').trim())}))
const serviceBlock = experience.slice(experience.indexOf('export const serviceDetails=['), experience.indexOf('export const pageOptions='))
const services = [...serviceBlock.matchAll(/slug:'([^']+)'/g)].map(m => m[1])
const errors = []
const visualRegistry = visual.match(/STYLE_VISUAL_CLASS_NAMES = \[([^\]]+)\]/)?.[1] ?? ''
const availableVisualClasses = new Set([...visualRegistry.matchAll(/'([^']+)'/g)].map(m => m[1]))
const styleArtBlock=visual.slice(visual.indexOf('export function StyleArt'),visual.indexOf('export function StyleCard'))
const visualMap=visual.match(/export const STYLE_ART_COMPOSITIONS=\{([\s\S]*?)\n\} satisfies Record<string,React\.ReactNode>/)?.[1]??''
const renderedStyleSlugs=new Set([...visualMap.matchAll(/^\s*([a-zA-Z-]+):</gm)].map(m=>m[1]))
const sceneRegistry = visual.match(/const projectSceneNames:Record<string,string>=\{([^}]+)\}/)?.[1] ?? ''
const baseRegistry = visual.match(/PROJECT_SCENE_BASE_CLASSES:Record<string,string>=\{([^}]+)\}/)?.[1] ?? ''
const scenes = new Map([...sceneRegistry.matchAll(/([a-zA-Z]+):'([^']+)'/g)].map(m => [m[1],m[2]]))
const baseScenes = new Map([...baseRegistry.matchAll(/([a-zA-Z]+):'([^']+)'/g)].map(m => [m[1],m[2]]))
for (const style of styles) {
  if (!availableVisualClasses.has(style.className)) errors.push(`StyleArt не обрабатывает className ${style.className} (${style.slug})`)
  if (!renderedStyleSlugs.has(style.slug)) errors.push(`Нет отдельной графической сцены для ${style.slug}`)
  if (!new RegExp(`\\.art-${style.className}(?:\\b|[.:{])`).test(css)) errors.push(`CSS не содержит .art-${style.className}`)
  if (!css.includes(`.art-${style.className}`)) errors.push(`Стиль ${style.slug}: отсутствует собственный визуальный CSS`)
}
const projectKeys = new Set(projects.map(p => p.slug))
const styleKeys = new Set(styles.map(s => s.slug))
for (const project of projects) {
  if (!styleKeys.has(project.styleSlug)) errors.push(`${project.slug}: неизвестный styleSlug ${project.styleSlug}`)
  if (!new RegExp(`\\b${project.slug}\\s*:`).test(experience + extras)) errors.push(`${project.slug}: нет страницы кейса`)
  if (!scenes.has(project.slug)) errors.push(`${project.slug}: нет сцены проекта`)
  const sceneClass = scenes.get(project.slug)
  const baseClass=baseScenes.get(project.slug)
  const jsx=visual.slice(visual.indexOf('export function ProjectArtwork'),visual.indexOf('export function ProjectCard'))
  if (!baseClass) errors.push(`${project.slug}: нет базовой сцены проекта`)
  if (!jsx.includes(`'${project.slug}'`) && !jsx.includes(`\"${project.slug}\"`)) errors.push(`${project.slug}: JSX не включает сцену проекта`)
  if (baseClass&&!css.includes(`.${baseClass}`)) errors.push(`${project.slug}: CSS не содержит .${baseClass}`)
  if (project.slug==='civic'&&!css.includes('.project-art .civic-world')) errors.push('civic: нет индивидуального CSS-модификатора')
  if (project.slug==='daybreak'&&!css.includes('.project-art .daybreak-world')) errors.push('daybreak: нет индивидуального CSS-модификатора')
  if (!new RegExp(`\\b${project.slug}\\s*:`).test(visual)) errors.push(`${project.slug}: нет project artwork entry`)
}
if (projects.length !== projectKeys.size) errors.push('Повторяющиеся slug проектов')
if (styles.length !== styleKeys.size) errors.push('Повторяющиеся slug стилей')
if (services.length !== new Set(services).size) errors.push('Повторяющиеся маршруты услуг')
for (const service of services) if (!new RegExp(`\\b${service}\\s*:`).test(await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'))) errors.push(`Нет сценария страницы услуги ${service}`)
if (errors.length) { console.error(errors.map(e=>`- ${e}`).join('\n')); process.exit(1) }
console.log(JSON.stringify({projects:projects.length, styles:styles.length, services:services.length, projectStyleLinks:'ok', styleVisualClasses:'ok', caseStudies:'ok', artworkRegistry:'ok'}, null, 2))
