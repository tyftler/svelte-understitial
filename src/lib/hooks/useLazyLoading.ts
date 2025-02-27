import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export function useLazyLoading(margin?: string) {
	const store = writable(!browser);

	function action(node: HTMLElement) {
		if (!browser) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;

				if (entry.isIntersecting) {
					store.set(true);
					observer.disconnect();
				}
			},
			margin ? { rootMargin: margin } : undefined
		);

		observer.observe(node);

		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	return {
		shouldLoad: store,
		initLazyLoading: action
	};
}
