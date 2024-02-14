<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let urlReset = $state('');

	onMount(async () => {
		const urlVerify = $page.url.searchParams.get('token') || '';
		urlReset = urlVerify;
	});
</script>

{urlReset}
