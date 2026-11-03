import { mkdir, readFile, writeFile } from 'node:fs/promises'

const repository = process.env.GITHUB_REPOSITORY
if (!repository) throw new Error('GITHUB_REPOSITORY is required to generate GitHub Pages SEO files.')
const [owner, repo] = repository.split('/')
if (!owner || !repo) throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`)
const root = `https://${owner.toLowerCase()}.github.io/${repo.endsWith('.github.io') ? '' : `${repo}/`}`
await mkdir('dist', { recursive: true })
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${root}sitemap.xml\n`)
const routePaths = ['', 'services', 'work', 'styles', 'process', 'contact', 'privacy', 'terms']
const source = await readFile(new URL('../src/data.ts', import.meta.url), 'utf8').catch(() => '')
const projectStart = source.indexOf('export const projects:Project[]=')
const projectBlock = source.slice(projectStart, source.indexOf('\nexport const services=', projectStart))
const styleStart = source.indexOf('const baseStyles:Style[]=')
const styleBlock = source.slice(styleStart, source.indexOf('\nexport const styles:Style[]=', styleStart))
const experienceSource = await readFile(new URL('../src/experience.ts', import.meta.url), 'utf8').catch(() => '')
const serviceStart = experienceSource.indexOf('export const serviceDetails=[')
const serviceBlock = experienceSource.slice(serviceStart, experienceSource.indexOf('\nexport const pageOptions=', serviceStart))
for (const match of projectBlock.matchAll(/\{slug:'([^']+)'/g)) routePaths.push(`work/${match[1]}`)
for (const match of styleBlock.matchAll(/\{slug:'([^']+)'/g)) routePaths.push(`styles/${match[1]}`)
for (const match of serviceBlock.matchAll(/\{slug:'([^']+)'/g)) routePaths.push(`services/${match[1]}`)
const routes = [...new Set(routePaths)]
const urls = routes.map(route => `  <url><loc>${root}${route ? `${route}/` : ''}</loc></url>`).join('\n')
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
console.log(`SEO-файлы подготовлены для ${root} (${routes.length} маршрутов)`)
