import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Get the API key from either VITE_API_KEY or API_KEY env variable
  const apiKey = env.VITE_API_KEY || process.env.API_KEY || '';
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    server: {
      port: 3000
    },
    define: {
      // Make process.env.API_KEY available in the source code
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});