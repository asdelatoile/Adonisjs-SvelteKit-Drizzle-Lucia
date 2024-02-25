// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				email: string;
			} | null;
		}
		interface PageData {
			flash?: { type: 'success' | 'error' | 'info' | 'warning'; message: string };
			user: {
				email: string;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
