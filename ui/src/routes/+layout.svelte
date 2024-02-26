<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import Toaster from '$lib/components/Toaster.svelte';
	import { createToast } from '$lib/runes/toast.svelte';
	// import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	const toasts = createToast();
	const flash = getFlash(page);

	let { children } = $props<{
		// data: LayoutData;
		children: Snippet;
	}>();

	$effect(() => {
		if ($flash) {
			toasts.addToast({
				type: $flash.type,
				message: $flash.message
			});
			$flash = undefined;
		}
	});
</script>

<Toaster />

{@render children()}
