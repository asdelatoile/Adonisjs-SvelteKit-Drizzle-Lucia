<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import Toaster from '$lib/components/Toaster.svelte';

	import { createToast } from '$lib/runes/toast.svelte';
	const toasts = createToast();
	const flash = getFlash(page);

	$: if ($flash) {
		toasts.addToast({
			type: $flash.type,
			message: $flash.message
		});
		$flash = undefined;
	}
</script>

<Toaster />

<slot />
