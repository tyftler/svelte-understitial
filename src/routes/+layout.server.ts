import type { Category } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const response = await fetch('/api/categories/categories.json');
	const data: { categories: Category[] } = await response.json();

	return data;
};
