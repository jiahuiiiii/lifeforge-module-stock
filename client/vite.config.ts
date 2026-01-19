import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'node:path'
import { defineConfig } from 'vite'

import pkg from '../package.json'

dotenv.config({ path: '../../../env/.env.local' })

const isDocker = process.env.DOCKER_BUILD === 'true'

const apiHost = isDocker ? '/api' : process.env.VITE_API_HOST

if (!apiHost) {
  throw new Error('VITE_API_HOST is not defined')
}

const moduleName = pkg.name.replace('@lifeforge/', '')

const outDir = isDocker ? 'dist-docker' : 'dist'

export default defineConfig({
  base: `${apiHost}/modules/${moduleName}/`,
  define: {
    'import.meta.env.VITE_API_HOST': JSON.stringify(apiHost)
  },
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: moduleName,
      filename: 'remoteEntry.js',
      exposes: {
        './Manifest': './manifest.ts'
      },
      shared: {
        react: {
          generate: false
        },
        'react-dom': {
          generate: false
        },
        shared: {
          generate: false
        },
        'lifeforge-ui': {
          generate: false
        },
        'react-i18next': {
          generate: false
        },
        i18next: {
          generate: false
        },
        '@tanstack/react-query': {
          generate: false
        }
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: '@server',
        replacement: path.resolve(__dirname, '../server')
      },
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, './src/$1') },
      { find: /^@$/, replacement: path.resolve(__dirname, './src/index') }
    ]
  },
  build: {
    outDir,
    target: 'esnext',
    minify: true,
    modulePreload: false
  }
})
