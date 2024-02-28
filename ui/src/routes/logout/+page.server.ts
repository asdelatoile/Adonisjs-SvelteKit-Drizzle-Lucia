import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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
