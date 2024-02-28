<script lang="ts">
	import { createToast } from '$lib/runes/toast.svelte';
	const toasts = createToast();
</script>

{#if toasts.records.length}
	<div class="toast toast-center toast-bottom z-50">
		{#each toasts.records as toast}
			{#if toast.type === 'error'}
				<div class="alert alert-error text-white">
					<span>{toast.message}</span>
				</div>
			{:else if toast.type === 'info'}
				<div class="alert alert-info text-white">
					<span>{toast.message}</span>
				</div>
			{:else if toast.type === 'success'}
				<div class="alert alert-success text-white">
					<span>{toast.message}</span>
				</div>
			{:else}
				<div class="alert alert-warning text-white">
					<span>{toast.message}</span>
				</div>
			{/if}
		{/each}
	</div>
{/if}
