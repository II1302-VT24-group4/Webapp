import { defineConfig } from 'vite';
import reactJsxPlugin from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        reactJsxPlugin(),
    ],
    server: {
        port: 8080,
    },
    build: {
        target: 'esnext' //browsers can handle the latest ES features
    }
});