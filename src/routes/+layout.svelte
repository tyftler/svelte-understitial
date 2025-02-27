<script lang="ts">
	import Header from '$components/Header.svelte';
	import '../app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Header categories={data.categories} />

<main class="px-5 sm:px-8">
	<slot />
</main>

<style>
	main {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding-top: var(--header-height);
		padding-bottom: 3rem;
	}
</style>
