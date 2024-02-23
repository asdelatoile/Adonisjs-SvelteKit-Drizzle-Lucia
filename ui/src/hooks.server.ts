import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const handleAuth = (async (...args) => {
	const [{ event, resolve }] = args;
	return resolve(event);
}) satisfies Handle;

const protectedHandle = (async ({ event, resolve }) => {
	// await event.locals.getSession();
	if (!event.locals.user && event.route.id?.includes('(protected)')) {
		redirect(302, '/');
	}
	return resolve(event);
}) satisfies Handle;

export const handle = sequence(handleAuth, protectedHandle);
