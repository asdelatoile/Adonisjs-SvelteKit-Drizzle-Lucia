<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{
		data: PageData;
	}>();
</script>

<div class="min-h-screen bg-base-200 p-6">
	<h1>Welcome to SvelteKit</h1>
	<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
	{#if !data.user}
		<a href="/login" title="Login" class="btn btn-primary mt-4">Login</a>
	{:else}
		<form action="/logout" method="POST">
			<button type="submit" class="btn btn-primary mt-4">Log out</button>
		</form>
	{/if}
</div>
