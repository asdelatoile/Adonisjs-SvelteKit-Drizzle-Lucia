<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let send = $state(false);

	onMount(async () => {
		const urlVerify = $page.url.searchParams.get('token') || '';
		await fetch(urlVerify);
		send = true;
	});
</script>

{#if send}
	ENVOYE
{:else}
	...
{/if}
