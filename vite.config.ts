import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const environment = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
const repository = environment.GITHUB_REPOSITORY
const [owner, repositoryName] = repository?.split('/') ?? []
const isUserSite = repositoryName?.endsWith('.github.io')
const base = environment.GITHUB_ACTIONS === 'true' && repositoryName && !isUserSite
  ? `/${repositoryName}/`
  : '/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion-vendor': ['framer-motion'],
          'icon-vendor': ['lucide-react'],
        },
      },
    },
  },
})
