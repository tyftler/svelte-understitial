import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { headerVisibility } from './headerVisibility';

describe('headerVisibility store', () => {
	it('should initialize with true', () => {
		expect(get(headerVisibility)).toBe(true);
	});

	it('should have a destroy method', () => {
		expect(typeof headerVisibility.destroy).toBe('function');
	});
});
