import { projects, styles } from './data'
import { STYLE_VISUAL_CLASS_NAMES } from './components/Visual'

export const styleVisualRegistry = {
  particle: 'particle', holographic: 'holo', neon: 'neon', wireframe: 'wireframe',
  glass: 'glass', editorial: 'editorial', bauhaus: 'bauhaus', brutalism: 'brutal',
  isometric: 'isometric', pixel: 'pixel', aurora: 'aurora', blueprint: 'blueprint',
  deco: 'deco', dashboard: 'dashboard', comic: 'comic', clay: 'clay', swiss: 'swiss',
  retro: 'retro', ascii: 'ascii', gradient: 'gradient', halftone: 'halftone',
  maximal: 'maximal', neofuturism: 'volt', 'futuristic-ui': 'pulse',
  'experimental-typography': 'folio', cyberpunk: 'signal', morphing: 'kinetic',
} as const

export const projectSceneRegistry = {
  morrow: 'morrow-world', objects: 'objects-world', after: 'after-world', form: 'form-world',
  tinyworlds: 'tiny-world', still: 'still-world', volt: 'volt-world', northstar: 'northstar-world',
  ledger: 'ledger-world', pulse: 'pulse-world', saffron: 'saffron-world', folio: 'folio-world',
  kinetic: 'kinetic-world', common: 'common-world', orbit: 'orbit-world', frame: 'frame-world',
  mechanica: 'mechanica-world', civic: 'civic-world', atelier: 'atelier-world', signal: 'signal-world',
  commonwealth: 'commonwealth-world', daybreak: 'daybreak-world', fieldnotes: 'fieldnotes-world',
  terracotta: 'terracotta-world', orbitlab: 'orbitlab-world',
} as const

export function validateVisualRegistry() {
  const errors: string[] = []
  const styleSlugs = new Set(styles.map(style => style.slug))
  for (const style of styles) {
    if (!(style.slug in styleVisualRegistry)) errors.push(`Нет графической реализации стиля: ${style.slug}`)
    if (!STYLE_VISUAL_CLASS_NAMES.includes(style.className as typeof STYLE_VISUAL_CLASS_NAMES[number])) errors.push(`StyleArt не знает класс ${style.className} (${style.slug})`)
  }
  for (const project of projects) {
    if (!styleSlugs.has(project.styleSlug)) errors.push(`${project.slug}: неизвестный стиль ${project.styleSlug}`)
    if (!(project.slug in projectSceneRegistry)) errors.push(`${project.slug}: нет сцены проекта`)
  }
  return errors
}
