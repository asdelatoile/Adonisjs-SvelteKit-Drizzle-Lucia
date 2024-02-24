<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let urlReset = $state('');

	onMount(async () => {
		// eslint-disable-next-line svelte/valid-compile
		const urlVerify = $page.url.searchParams.get('token') || '';
		urlReset = urlVerify;
	});
</script>

{urlReset}
