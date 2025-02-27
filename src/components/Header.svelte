<script lang="ts">
	import { headerVisibility } from '$lib/stores/headerVisibility';
	import type { Category } from '$lib/types';
	import { toggleScrollBlocking } from '$lib/utils/scrolling';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { BarsOutline, UserOutline } from 'flowbite-svelte-icons';
	import { onDestroy } from 'svelte';

	export let categories: Category[];

	let isMainNavigationOpen = false;
	let isUserNavigationOpen = false;
	$: isVisible = $headerVisibility || isMainNavigationOpen || isUserNavigationOpen;

	$: toggleScrollBlocking(isMainNavigationOpen || isUserNavigationOpen);

	onDestroy(() => {
		headerVisibility.destroy();
	});
</script>

<header class:visible={isVisible}>
	<div class="content px-2 sm:px-5">
		<Button class="button" aria-label="Hauptnavigation öffnen">
			<BarsOutline class="icon " />
			<span class="hidden sm:ml-1 sm:inline">Menü</span>
		</Button>

		<Dropdown class="navigation" placement="bottom-start" bind:open={isMainNavigationOpen}>
			<nav>
				{#each categories as category}
					<DropdownItem class="navigation-item" href={category.path} tabindex={0}>
						{category.title}
					</DropdownItem>
				{/each}
			</nav>
		</Dropdown>

		<div class="logo">Understitial Times</div>

		<Button class="button" aria-label="Nutzer:innen-Navigation öffnen">
			<UserOutline class="icon" />
		</Button>

		<Dropdown class="navigation" placement="bottom-end" bind:open={isUserNavigationOpen}>
			<nav>
				<DropdownItem class="navigation-item" href="/" tabindex={0}>Konto</DropdownItem>
				<DropdownItem class="navigation-item" href="/" tabindex={0}>Abonnement</DropdownItem>
				<DropdownItem class="navigation-item" href="/" tabindex={0}>Merkliste</DropdownItem>
				<DropdownItem class="navigation-item" href="/" tabindex={0}>Kommentare</DropdownItem>
				<DropdownItem class="navigation-item logout" href="/" tabindex={0}>Abmelden</DropdownItem>
			</nav>
		</Dropdown>
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
		transform: translateY(-100%);
		border-bottom: 1px solid var(--color-border);
		box-shadow: 0 0 0 var(--color-box-shadow);
		background-color: var(--color-background-1);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	header.visible {
		transform: translateY(0);
		box-shadow: 0 0 1rem var(--color-box-shadow);
	}

	.content {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		height: var(--header-height);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		flex: 0 1 auto;
		overflow: hidden;
		white-space: nowrap;
		font-family: 'Libre Baskerville', serif;
		font-size: clamp(1.1rem, 5vw, 1.5rem);
		font-weight: 700;
	}

	:global(.button) {
		height: 2.5rem;
		padding: 0 0.5rem;
		border: none;
		border-radius: 0.25rem;
		outline: none;
		box-shadow: none;
		color: var(--color-text-2);
		cursor: pointer;
	}

	:global(.button:hover, .button:focus-visible) {
		background-color: var(--color-background-2);
		color: var(--color-text-1);
	}

	:global(.icon) {
		width: 2rem;
		height: 2rem;
	}

	:global(.navigation) {
		min-width: 16rem;
		border-bottom-left-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		background-color: var(--color-background-1);
	}

	:global(.navigation-item) {
		color: var(--color-text-1);
		text-decoration: none;
	}

	:global(.navigation-item.logout) {
		border-top: 1px solid var(--color-border);
		color: var(--color-text-2);
	}

	:global(.navigation-item:hover, .navigation-item:focus-visible) {
		background-color: var(--color-background-2);
		text-decoration: none;
	}
</style>
