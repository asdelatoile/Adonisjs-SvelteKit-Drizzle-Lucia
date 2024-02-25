import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	const currentToken = event.cookies.get('AuthorizationToken');
	if (currentToken) {
		request.headers.set('Authorization', `Bearer ${currentToken}`);
	}
	request.headers.set('Content-Type', 'application/json');

	return fetch(request);
};

const handleAuth = (async (...args) => {
	const [{ event, resolve }] = args;
	const currentToken = event.cookies.get('AuthorizationToken');
	if (currentToken) {
		try {
			const url = new URL(event.request.url);
			const host = url.origin;
			const response = await fetch(`${host}/api/auth/user`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${currentToken}`
				}
			});
			const resJson = await response.json();
			const { user } = resJson;
			if (user) {
				event.locals.user = user;
			} else {
				event.locals.user = null;
			}
		} catch (error) {
			console.log(error);
		}
	}

	return await resolve(event);
}) satisfies Handle;

const protectedHandle = (async ({ event, resolve }) => {
	// await event.locals.getSession();
	if (!event.locals.user && event.route.id?.includes('(protected)')) {
		redirect(302, '/login');
	}
	return resolve(event);
}) satisfies Handle;

export const handle = sequence(handleAuth, protectedHandle);
