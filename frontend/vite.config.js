import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    allowedHosts:['localhost','3eaf4d7719ed.ngrok-free.app'],
    host:true
  },
  plugins: [react()],
})
