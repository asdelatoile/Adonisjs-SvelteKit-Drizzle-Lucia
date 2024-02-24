<script lang="ts">
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import toast, { Toaster } from 'svelte-french-toast';

	const flash = getFlash(page);

	$: if ($flash) {
		console.log('debug', JSON.stringify($flash));
		$flash.type == 'success' ? toast.success($flash.message) : toast.error($flash.message);
		$flash = undefined;
	}
</script>

<Toaster />
<slot />
