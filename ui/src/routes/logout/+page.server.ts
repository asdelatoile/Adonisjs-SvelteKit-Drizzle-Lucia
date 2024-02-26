import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// we only use this endpoint for the api
	// and don't need to see the page
	redirect(302, '/');
};

export const actions: Actions = {
	default({ cookies, locals, fetch }) {
		fetch('/api/auth/logout', {
			method: 'POST'
		});
		cookies.delete('AuthorizationToken', { path: '/' });
		locals.user = null;

		redirect(302, '/');
	}
};
