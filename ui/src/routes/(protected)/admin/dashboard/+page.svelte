<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{
		data: PageData;
	}>();
</script>

{#if data && data.user}
	{data.user.email}
{/if}
