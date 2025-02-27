<script lang="ts">
	import AdSlot from '$components/AdSlot.svelte';
	import Image from '$components/Image.svelte';
	import Meta from '$components/Meta.svelte';
	import { useActiveAds } from '$lib/hooks/useActiveAds';
	import type { PageData } from './$types';

	export let data: PageData;

	const { activeAds, adsHandled, initActiveAds } = useActiveAds();
	const activeAdParams = {
		adSlotSelector: '.ad-slot',
		adSlotIdAttribute: 'data-slot-id',
		contentSelector: ':scope > *',
		adViewportRate: 1
	};
</script>

<Meta metadata={data.metadata} />

<article>
	<div class="category">
		<a href="/" tabindex="0">{data.metadata.category}</a>
	</div>

	<h1>{data.metadata.title}</h1>

	{#if data.metadata.description}
		<p class="description">{data.metadata.description}</p>
	{/if}

	<div>
		Von <a href="/" tabindex="0">{data.metadata.author}</a>
	</div>

	<time>{data.metadata.publishedDate}</time>

	<div class="content" class:ads-handled={$adsHandled} use:initActiveAds={activeAdParams}>
		{#each data.content as block}
			{#if block.type === 'heading'}
				<h2 class="heading">{block.content}</h2>
			{:else if block.type === 'paragraph'}
				<p class="paragraph">{block.content}</p>
			{:else if block.type === 'image'}
				<Image src={block.src} size={block.size} alt={block.alt} caption={block.caption} />
			{:else if block.type === 'ad-slot'}
				<AdSlot slotId={block.id} ad={data.ads[block.id]} active={$activeAds[block.id]} />
			{/if}
		{/each}
	</div>
</article>

<style>
	.category {
		padding: 1.5rem 0 1rem;
	}

	.category a {
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-text-2);
		text-transform: uppercase;
	}

	h1 {
		margin: 0;
		padding-bottom: 1rem;
	}

	.description {
		padding-bottom: 1rem;
		line-height: 1.4;
		font-size: 1.1rem;
	}

	time {
		display: block;
		padding: 0 0 2rem;
		color: var(--color-text-2);
	}

	.heading {
		margin: 0;
		padding: 1rem 0 1.5rem;
	}

	.paragraph {
		margin: 0;
		padding-bottom: 1.5rem;
		line-height: 1.6;
		font-family: 'Libre Baskerville', Georgia, 'Times New Roman', serif;
	}
</style>
