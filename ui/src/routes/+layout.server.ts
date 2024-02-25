import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async ({ locals }) => {
	const { user } = locals;
	return {
		user
	};
});
