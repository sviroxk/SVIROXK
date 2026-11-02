import { mkdir, writeFile } from 'node:fs/promises'

const repository = process.env.GITHUB_REPOSITORY
if (!repository) throw new Error('GITHUB_REPOSITORY is required to generate GitHub Pages SEO files.')
const [owner, repo] = repository.split('/')
if (!owner || !repo) throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`)
const root = `https://${owner}.github.io/${repo.endsWith('.github.io') ? '' : `${repo}/`}`
await mkdir('dist', { recursive: true })
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${root}sitemap.xml\n`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${root}</loc></url>\n</urlset>\n`)
console.log(`SEO-файлы подготовлены для ${root}`)
