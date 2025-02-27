import { browser } from '$app/environment';
import type { LogLevel } from '$lib/types';
import { debounce } from '$lib/utils';
import { writable } from 'svelte/store';

export interface ActionParams {
	adSlotSelector: string;
	adSlotIdAttribute: string;
	contentSelector: string;
	adViewportRate: number;
}

export function useActiveAds() {
	const activeAds = writable<Record<string, boolean>>({});
	const adsHandled = writable(false);

	function action(
		node: HTMLElement,
		params: ActionParams = {
			adSlotSelector: '.ad-slot',
			adSlotIdAttribute: 'data-slot-id',
			contentSelector: ':scope > *',
			adViewportRate: 1
		}
	) {
		if (!browser) {
			return;
		}

		function update() {
			const thresholdHeight = window.innerHeight * params.adViewportRate;

			log('debug', `Updating with threshold height of ${thresholdHeight}...`);

			const elements = Array.from(
				node.querySelectorAll(`${params.adSlotSelector},${params.contentSelector}`)
			);

			const { newState } = elements.reduce(
				({ newState, contentHeightSinceAd }, element) => {
					if (element.matches(params.adSlotSelector)) {
						// ad slot element
						const adSlotId = element.getAttribute(params.adSlotIdAttribute);

						if (!adSlotId) {
							return {
								newState,
								contentHeightSinceAd
							};
						}

						const isActive = contentHeightSinceAd >= thresholdHeight;

						newState[adSlotId] = isActive;

						log('debug', `${adSlotId}: ${isActive ? 'active' : 'inactive'}`);

						return {
							newState,
							contentHeightSinceAd: isActive ? 0 : contentHeightSinceAd
						};
					}

					// content element
					const contentHeight = (element as HTMLElement).offsetHeight;

					log(
						'debug',
						`Content height: ${contentHeightSinceAd} + ${contentHeight} of ${element.tagName} = ${contentHeightSinceAd + contentHeight}`
					);

					return {
						newState,
						contentHeightSinceAd: contentHeightSinceAd + contentHeight
					};
				},
				{ newState: {} as Record<string, boolean>, contentHeightSinceAd: 0 }
			);

			log(
				'debug',
				`Active: ${Object.entries(newState)
					.filter(([, active]) => active)
					.map(([slotId]) => slotId)
					.join(', ')}`
			);

			activeAds.set(newState);
		}

		update();
		adsHandled.set(true);

		const debouncedUpdate = debounce(update, 100);

		window.addEventListener('resize', debouncedUpdate);

		return {
			destroy() {
				window.removeEventListener('resize', debouncedUpdate);
			}
		};
	}

	function log(level: LogLevel, message: string) {
		console[level](`[Active Ads] ${message}`);
	}

	return {
		activeAds,
		adsHandled,
		initActiveAds: action
	};
}
