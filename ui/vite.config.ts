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
			'/api': 'http://localhost:3333'
			// '/api': {
			// 	target: 'http://localhost:3333',
			// 	changeOrigin: true,
			// 	configure: (proxy) => {
			// 		proxy.on('error', (err, _req, res) => {
			// 			console.log('proxy error', err.message);
			// 			console.log('proxy error', err);
			// 			res.writeHead(500, { 'Content-Type': 'text/plain' });
			// 			res.write('Servor Error');
			// 			res.end();
			// 		});
			// 	}
			// }
		}
	},
	plugins: [sveltekit()]
});
