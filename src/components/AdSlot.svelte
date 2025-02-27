<script lang="ts">
	import { useLazyLoading } from '$lib/hooks/useLazyLoading';
	import { hiddenAds } from '$lib/stores/hiddenAds';
	import type { Ad, LogLevel } from '$lib/types';
	import { CloseOutline } from 'flowbite-svelte-icons';

	export let slotId: string;
	export let ad: Ad | undefined;
	export let active = false;

	let hasError = false;
	$: isHidden = ad ? $hiddenAds.has(ad.id) : false;
	const { initLazyLoading, shouldLoad } = useLazyLoading('100px');
	$: isRendered = active && !isHidden && $shouldLoad;

	// immediately handle load for html ads
	$: isRendered && ad?.embedding === 'html' && handleLoad();

	const slotHeight = ad ? `calc(${ad.size[1]}px + 3rem)` : '';
	const slotStyle = ad ? `height: ${slotHeight}` : '';

	function handleLoad() {
		log('debug', `Ad ${ad?.id} loaded to slot ${slotId}`);
	}

	function handleError() {
		hasError = true;

		log('warn', `Ad ${ad?.id} could not be loaded to slot ${slotId}`);
	}

	function handleHide() {
		if (!ad) {
			return;
		}

		hiddenAds.hide(ad.id);

		log('debug', `Hiding ad ${ad.id} in slot ${slotId}`);
	}

	function log(level: LogLevel, message: string) {
		console[level](`[Ad Slot] ${message}`);
	}
</script>

{#if ad}
	<div
		class="ad-slot"
		class:hidden={!active || isHidden || hasError}
		data-slot-id={slotId}
		data-format={ad.format}
		data-ad-server={ad.adServer}
		data-ad-unit-id={ad.adUnitId}
		data-type={ad.type}
		data-active={active}
		aria-label="Werbung"
		role="complementary"
		style={slotStyle}
		use:initLazyLoading
	>
		{#if isRendered}
			<div class="understitial-placeholder">
				<div class="understitial-container">
					{#if ad.embedding === 'iframe'}
						<iframe
							src={ad.url}
							width={ad.size[0]}
							height={ad.size[1]}
							frameborder="0"
							scrolling="no"
							title="Werbung"
							on:load={handleLoad}
							on:error={handleError}
						></iframe>
					{:else}
						{@html ad.html}
					{/if}
				</div>

				<div class="label">Werbung</div>

				<button class="close-button" aria-label="Werbung ausblenden" on:click={handleHide}>
					<CloseOutline />
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	.ad-slot {
		position: relative;
		margin: 0.5rem 0 2rem;
	}

	.understitial-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		clip: rect(auto, auto, auto, auto);
		clip-path: inset(0 0 0 0);
		overflow: hidden;
		background-color: var(--color-background-3);
	}

	.understitial-container {
		display: flex;
		position: fixed;
		top: 1rem;
		left: 0;
		right: 0;
		bottom: 1rem;
		/* fix flaky behavior in Safari */
		transform: translateZ(0);
		justify-content: center;
		align-items: center;
	}

	iframe {
		display: block;
		border: none;
	}

	.label {
		position: absolute;
		top: 0;
		left: 0.5rem;
		padding: 0 0.25rem;
		border-bottom-left-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		background-color: var(--color-background-4);
		font-size: 0.7rem;
		color: var(--color-text-2);
		text-transform: uppercase;
	}

	.close-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		padding: 0.25rem;
		border: none;
		border-radius: 0.25rem;
		background-color: var(--color-background-4);
		cursor: pointer;
		color: var(--color-text-2);
	}

	.close-button:hover,
	.close-button:focus-visible {
		background-color: var(--color-background-1);
	}
</style>
