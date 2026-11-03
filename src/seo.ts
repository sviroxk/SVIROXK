import { projects } from './data'
import { serviceDetails } from './experience'

const SITE_ORIGIN = 'https://sviroxk.github.io/SVIROXK'

export function setRouteMetadata(title: string, description: string, pathname: string) {
  document.title = title
  document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') ?? document.createElement('link')
  canonical.rel = 'canonical'
  canonical.href = `${SITE_ORIGIN}${pathname === '/' ? '/' : `${pathname}/`}`
  if (!canonical.parentNode) document.head.appendChild(canonical)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical.href)
}

export function getProjectPageData(slug: string) {
  const project = projects.find(item => item.slug === slug)
  return project
    ? { title: `${project.title} — концепт Студии SVIROXK`, description: project.description }
    : { title: 'Проект — Студия SVIROXK', description: 'Концептуальные проекты Студии SVIROXK.' }
}

export function getServicePageData(slug: string) {
  const service = serviceDetails.find(item => item.slug === slug)
  return service
    ? { title: `${service.name} — услуги Студии SVIROXK`, description: service.summary }
    : { title: 'Услуги — Студия SVIROXK', description: 'Услуги веб-дизайна и разработки Студии SVIROXK.' }
}
