<script lang="ts">
	import { createToast } from '$lib/runes/toast.svelte';
	const toasts = createToast();
</script>

{#if toasts.records.length}
	<div class="toast toast-center toast-bottom">
		{#each toasts.records as toast}
			{#if toast.type === 'error'}
				<div class={`alert alert-error`}>
					<span>{toast.message}</span>
				</div>
			{:else if toast.type === 'info'}
				<div class={`alert alert-info`}>
					<span>{toast.message}</span>
				</div>
			{:else if toast.type === 'success'}
				<div class={`alert alert-success`}>
					<span>{toast.message}</span>
				</div>
			{:else}
				<div class={`alert alert-warning`}>
					<span>{toast.message}</span>
				</div>
			{/if}
		{/each}
	</div>
{/if}
