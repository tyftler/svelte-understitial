import { get } from 'svelte/store';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { hiddenAds } from './hiddenAds';

describe('hiddenAds store', () => {
	beforeEach(() => {
		hiddenAds.reset();
	});

	afterAll(() => {
		hiddenAds.reset();
	});

	it('should initialize with empty set', () => {
		expect(get(hiddenAds).size).toBe(0);
	});

	it('should hide an ad', () => {
		hiddenAds.hide('ad-1');
		const hidden = get(hiddenAds);
		expect(hidden.has('ad-1')).toBe(true);
	});

	it('should show a hidden ad', () => {
		hiddenAds.hide('ad-1');
		hiddenAds.show('ad-1');
		const hidden = get(hiddenAds);
		expect(hidden.has('ad-1')).toBe(false);
	});

	it('should reset hidden ads', () => {
		hiddenAds.hide('ad-1');
		hiddenAds.hide('ad-2');
		hiddenAds.reset();
		const hidden = get(hiddenAds);
		expect(hidden.size).toBe(0);
	});
});
