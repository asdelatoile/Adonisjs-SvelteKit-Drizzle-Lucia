import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { vine } from 'sveltekit-superforms/adapters';
import { schema } from './schema';

const defaults = { email: '', password: '', password_confirmation: '' };

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (user) {
		redirect(302, '/admin/dashboard');
	}
	const form = await superValidate(vine(schema, { defaults }));

	return { form };
};

export const actions: Actions = {
	default: async ({ fetch, request }) => {
		const form = await superValidate(request, vine(schema, { defaults }));

		// Check validation
		if (!form.valid) {
			return message(form, {
				type: 'error',
				message: 'Problem fields....'
			});
		}

		try {
			const { email, password, password_confirmation } = form.data;
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
					password_confirmation
				})
			});
			const resJson = await res.json();
			const { success, error } = resJson;

			if (error) {
				return message(form, {
					type: 'error',
					message: error
				});
			}

			form.data = defaults;

			return message(form, {
				type: 'success',
				message: success
			});
		} catch (err) {
			if (err && err instanceof Error) {
				return message(form, {
					type: 'error',
					message: 'Internal Server Error'
				});
			} else {
				throw err;
			}
		}
	}
};
