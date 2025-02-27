import { browser } from '$app/environment';

export function toggleScrollBlocking(shouldBlock: boolean) {
	if (!browser) {
		return;
	}

	document.body.style.overflow = shouldBlock ? 'hidden' : '';

	console.debug(`[Scroll Blocking]: ${shouldBlock ? 'Blocked' : 'Unblocked'}`);
}
