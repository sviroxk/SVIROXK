import { readFile } from 'node:fs/promises'

const [html, readme, packageConfig] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../README.md', import.meta.url), 'utf8'),
  readFile(new URL('../package.json', import.meta.url), 'utf8'),
])
const packageJson = JSON.parse(packageConfig)
const expectedSite = 'https://sviroxk.github.io/SVIROXK/'
const failures = []
for (const [name, content] of [['index.html', html], ['README.md', readme]]) {
  if (content.includes('winchestersdc79-hub.github.io/SVIROXK')) failures.push(`${name}: stale canonical site domain`)
  if (content.includes('github.com/winchestersdc79-hub/SVIROXK')) failures.push(`${name}: stale repository URL`)
}
for (const [label, pattern] of [
  ['canonical link', new RegExp(`<link rel="canonical" href="${expectedSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`)],
  ['Open Graph URL', new RegExp(`<meta property="og:url" content="${expectedSite.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`)],
  ['Open Graph image', /<meta property="og:image" content="https:\/\/sviroxk\.github\.io\/SVIROXK\/social-card\.svg"/],
]) if (!pattern.test(html)) failures.push(`index.html: missing current ${label}`)
for (const script of ['check:visuals', 'test:e2e']) if (!packageJson.scripts[script]) failures.push(`package.json: missing ${script}`)
if (failures.length) {
  console.error(failures.map(message => `- ${message}`).join('\n'))
  process.exitCode = 1
} else console.log('Pages metadata, repository URLs, Open Graph tags, and CI test scripts are current.')
