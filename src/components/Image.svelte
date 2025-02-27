<script lang="ts">
	export let src: string;
	export let size: [number, number];
	export let alt: string;
	export let caption: string | undefined;

	let hasError = false;
	const widthRegex = /-[\d]+w\./;
	const src736 = src.replace(widthRegex, '-736w.');
	const src390 = src.replace(widthRegex, '-390w.');
	const srcset = `${src390} 390w, ${src736} 736w, ${src} 1472w`;
	const height = ((size[1] / size[0]) * 100).toFixed(2);

	function handleError() {
		hasError = true;
	}
</script>

<figure class:hidden={hasError}>
	<div class="image-placeholder" style="padding-top: {height}%">
		<img src={src736} {srcset} {alt} onerror={handleError} />
	</div>

	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	figure {
		width: 100%;
		padding: 0.5rem 0 2rem;
	}

	.image-placeholder {
		position: relative;
		width: 100%;
		height: 0;
		background: var(--color-background-2);
	}

	img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	figcaption {
		margin-top: 0.5rem;
		line-height: 1.2;
		font-size: 0.9rem;
		color: var(--color-text-2);
	}
</style>
