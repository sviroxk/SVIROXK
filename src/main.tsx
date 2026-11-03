import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')
if (typeof window !== 'undefined' && location.pathname !== `${baseUrl}/` && !location.hash) {
  const routePath = location.pathname.startsWith(`${baseUrl}/`) ? location.pathname.slice(baseUrl.length + 1).replace(/\/$/, '') : ''
  if (routePath) location.replace(`${baseUrl}/#/${routePath}${location.search}`)
}
if (typeof window !== 'undefined' && sessionStorage.redirect) {
  const redirected = sessionStorage.redirect as string
  delete sessionStorage.redirect
  const pathname = new URL(redirected).pathname
  const basePath = (baseUrl && pathname.startsWith(baseUrl) ? pathname.slice(baseUrl.length) : pathname.replace(/^\//, '')).replace(/^\/+/, '')
  window.history.replaceState(null, '', `${baseUrl}/#/${basePath}${window.location.search}`)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
