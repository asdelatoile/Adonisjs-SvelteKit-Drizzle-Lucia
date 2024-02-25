<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data && data.user}
	{data.user.email}
{/if}
