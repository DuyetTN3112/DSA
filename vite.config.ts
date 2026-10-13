import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  // Test component Svelte (mount) cần bản "browser" của Svelte; chỉ bật khi chạy vitest.
  resolve: process.env['VITEST'] ? { conditions: ['browser'] } : {},
})
