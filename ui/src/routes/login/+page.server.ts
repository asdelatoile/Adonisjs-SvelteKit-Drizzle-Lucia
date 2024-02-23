import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
// import { loginUser } from '$lib/user.model';

export const load: PageServerLoad = (event) => {
	const user = event.locals.user;
	if (user) {
		redirect(302, '/guarded');
	}
};

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		if (!formData.email || !formData.password) {
			return fail(400, {
				error: 'Missing email or password',
				email: formData.email,
				password: formData.password
			});
		}

		const { email, password } = formData as { email: string; password: string };

		const res = await event.fetch('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const resJson = await res.json();
		console.log('resJson', resJson);
		const { token } = resJson;

		if (token) {
			// Set the cookie
			event.cookies.set('AuthorizationToken', `Bearer ${token}`, {
				httpOnly: true,
				path: '/',
				secure: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // 1 day
			});
		}

		return fail(400, { error: 'Invalid credentials!', email, password });
	}
};
