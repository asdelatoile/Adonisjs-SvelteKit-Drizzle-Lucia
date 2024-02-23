import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		proxy: {
			// '/api': {
			// 	target: 'http://localhost:3333',
			// 	changeOrigin: true,
			// 	rewrite: (path) => path.replace(/^\/api/, '')
			// }
			'/api': 'http://localhost:3333',
		}
	},
	plugins: [sveltekit()]
});
