import { browser } from '$app/environment';
import { debounce } from '$lib/utils';
import { writable } from 'svelte/store';

const THRESHOLD = 50;

function createStore() {
	const { subscribe, set } = writable(true);

	if (!browser) {
		return {
			subscribe,
			destroy: () => {}
		};
	}

	let prevScrollY = 0;

	function handleScroll() {
		const currentScrollY = window.scrollY;

		if (Math.abs(currentScrollY - prevScrollY) >= THRESHOLD) {
			set(currentScrollY < prevScrollY);

			prevScrollY = currentScrollY;
		}
	}

	const debouncedHandleScroll = debounce(handleScroll, 10);

	window.addEventListener('scroll', debouncedHandleScroll, {
		// tell the browser that preventDefault() will not be called and
		// that it can continue scrolling without waiting for the scroll handler
		passive: true
	});

	return {
		subscribe,
		destroy: () => {
			window.removeEventListener('scroll', debouncedHandleScroll);
		}
	};
}

export const headerVisibility = createStore();
