<script lang="ts">
	import { page } from '$app/state';

	const status = $state(page.status);
	const errorMessage = $state(page.error?.message || 'Error');
</script>

<div class="container">
	<h1>{status} – {errorMessage}</h1>

	<div class="description">Es ist ein Fehler aufgetreten.</div>
</div>

<style>
	.container {
		display: flex;
		padding-top: 3rem;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	h1 {
		text-align: center;
	}

	.description {
		margin-top: 1.5rem;
		text-align: center;
		line-height: 1.4;
		font-size: 1.1rem;
		color: var(--color-text-2);
	}
</style>
