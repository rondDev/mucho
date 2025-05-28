<script lang="ts">
	import {
		PUBLIC_UMAMI_DOMAIN,
		PUBLIC_UMAMI_WEBSITE_ID,
	} from "$env/static/public";
	import "virtual:uno.css";
</script>

<svelte:head>
	{#if PUBLIC_UMAMI_DOMAIN}
		<script
			defer
			src={PUBLIC_UMAMI_DOMAIN}
			data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
		></script>
	{/if}
</svelte:head>

<div
	class="bg-[#09090b] text-[#fafafa] absolute min-h-[100vh] min-w-[100vw] text-[#fafafa]"
>
	<slot />
</div>
