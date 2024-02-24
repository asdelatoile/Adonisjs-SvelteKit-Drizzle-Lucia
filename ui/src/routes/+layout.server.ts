import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async () => {
	const data = { someOther: 'data' };
	return data;
});
