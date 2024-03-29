import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/

{/*if the client-side code makes a request to /api/auth/signup, 
the proxy will intercept this request and forward it to http://localhost:3000/api/auth/signup,*/}

export default defineConfig({
  server:{
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        secure:false,
      },
    },
  },
  plugins: [react()],
})
