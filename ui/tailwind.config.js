/** @type {import('tailwindcss').Config} */
export default {
	// content: ['./src/routes/**/*.{svelte,js,ts}'],
	content: ['./src/**/*.{html,svelte,js,ts}'],
	// safelist: [
	// 	'text-white',
	// 	'toast',
	// 	'toast-center',
	// 	'toast-bottom',
	// 	'z-50',
	// 	'alert',
	// 	'alert-error',
	// 	'text-white',
	// 	'alert-info',
	// 	'alert-warning',
	// 	'alert-success',
	// 	'navbar',
	// 	'dropdown',
	// 	'dropdown-end',
	// 	'btn',
	// 	'btn-ghost',
	// 	'btn-circle',
	// 	'avatar',
	// 	'menu',
	// 	'menu-sm',
	// 	'dropdown-content'
	// ],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: ['light']
	}
};
