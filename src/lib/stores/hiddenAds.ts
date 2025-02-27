import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'hidden-ads';

function createStore() {
	const { subscribe, set, update } = writable<Set<string>>(load());

	function hide(id: string) {
		update((state) => {
			const newState = new Set(state);
			newState.add(id);

			save(newState);

			return newState;
		});
	}

	function show(id: string) {
		update((state) => {
			const newState = new Set(state);
			newState.delete(id);

			save(newState);

			return newState;
		});
	}

	function reset() {
		const newState = new Set<string>();

		save(newState);

		set(newState);
	}

	function load(): Set<string> {
		if (!browser) {
			return new Set();
		}

		return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
	}

	function save(state: Set<string>) {
		if (!browser) {
			return;
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state)));
	}

	return {
		subscribe,
		hide,
		show,
		reset
	};
}

export const hiddenAds = createStore();
