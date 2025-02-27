import { Page } from '@playwright/test';

export function enableBrowserLogging(page: Page) {
	page.on('console', (msg) => {
		console.log(`${msg.type()}:`, msg.text());
	});
}
