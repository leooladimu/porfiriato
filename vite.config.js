/* eslint-env node */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const root = dirname(fileURLToPath(import.meta.url))
  const env = loadEnv(mode, root, '')

  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || '/',
  }
})
