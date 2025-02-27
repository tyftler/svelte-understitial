import { Locator } from '@playwright/test';

export async function scrollToElement(element: Locator) {
	await element.evaluate((el) => {
		const top = window.scrollY + el.getBoundingClientRect().top;
		window.scrollTo({ top, behavior: 'smooth' });
	});
}
