<script lang="ts">
	import { page } from '$app/stores';
	import { Frown } from 'lucide-svelte';
</script>

<main class=" md:pt-4 pt-4 px-6 bg-base-200 flex items-stretch bg-grey-lighter min-h-screen">
	<div class="hero bg-base-200">
		<div class="hero-content text-base-content text-center opacity-30">
			<div class="max-w-md text-center">
				<Frown size={192} class="m-auto" />
				<!-- eslint-disable-next-line svelte/valid-compile -->
				<h1 class="font-bold text-4xl mt-4">{$page.status} - {$page.error?.message}</h1>
			</div>
		</div>
	</div>
	<div class="h-16"></div>
</main>
