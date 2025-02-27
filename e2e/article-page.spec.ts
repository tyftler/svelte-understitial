import { expect, Page, test } from '@playwright/test';
import type { AdMapping, ArticleData } from '../src/lib/types';
import mockAdData from '../static/api/articles/article1/ads.json' assert { type: 'json' };
import mockArticleData from '../static/api/articles/article1/article.json' assert { type: 'json' };
import { enableBrowserLogging, scrollToElement } from './helpers';

test.describe('article page', () => {
	test.beforeEach(async ({ page }) => {
		enableBrowserLogging(page);

		await prepareArticleData(page);

		await page.setViewportSize({ width: 1280, height: 720 });

		await page.goto('/');
	});

	test('images and paragraphs load correctly', async ({ page }) => {
		await page.waitForSelector('.content img');
		expect(await page.locator('.content img').count()).toBe(5);

		await page.waitForSelector('.content p');
		expect(await page.locator('.content p').count()).toBe(15);
	});

	test('ads load correctly for 1280 x 1080', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 1080 });
		await page.reload();

		const activeAdSlotIds = await getActiveAdSlotIds(page);

		expect(activeAdSlotIds).toEqual([
			'ad-slot-3',
			'ad-slot-7',
			'ad-slot-11',
			'ad-slot-14',
			'ad-slot-18'
		]);
	});

	test('ads load correctly for 375 x 667', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });
		await page.reload();

		const activeAdSlotIds = await getActiveAdSlotIds(page);

		expect(activeAdSlotIds).toEqual([
			'ad-slot-1',
			'ad-slot-3',
			'ad-slot-4',
			'ad-slot-6',
			'ad-slot-8',
			'ad-slot-10',
			'ad-slot-12',
			'ad-slot-14',
			'ad-slot-16',
			'ad-slot-18'
		]);
	});

	test('ads are shown once per viewport height', async ({ page }) => {
		await page.waitForSelector('.content.ads-handled');

		const activeAdSlots = await page.locator('.ad-slot[data-active="true"]').all();
		const activeAdSlotBoxes = await Promise.all(
			activeAdSlots.map(async (slot) => await slot.boundingBox())
		);

		const contentBox = await page.locator('article > .content').boundingBox();
		const contentTop = contentBox?.y || 0;

		const activeAdSlotDistances = activeAdSlotBoxes.map((box, boxIndex) => {
			const currentTop = box?.y || 0;
			const prevBottom =
				boxIndex > 0
					? (activeAdSlotBoxes[boxIndex - 1]?.y || 0) +
						(activeAdSlotBoxes[boxIndex - 1]?.height || 0)
					: contentTop;
			return currentTop - prevBottom;
		});

		const viewportHeight = page.viewportSize()?.height || 0;

		activeAdSlotDistances.forEach((distance) => {
			expect(Math.abs(distance - viewportHeight)).toBeLessThan(500);
		});
	});

	test('ad slot without ad data does not get rendered', async ({ page }) => {
		await page.waitForSelector('.content.ads-handled');

		const adSlot3Selector = '.ad-slot[data-slot-id="ad-slot-3"]';
		const adSlot3 = page.locator(adSlot3Selector);
		await expect(adSlot3).toBeVisible();

		await prepareAdData(page, { ads: {} });

		await page.reload();
		await page.waitForSelector('.content.ads-handled');

		const ad3AfterReload = page.locator(adSlot3Selector);
		await expect(ad3AfterReload).toHaveCount(0);
	});

	test('ads lazy load correctly', async ({ page }) => {
		await page.waitForSelector('.content.ads-handled');

		const adSlot3 = page.locator('.ad-slot[data-slot-id="ad-slot-3"]');
		const adSlot17 = page.locator('.ad-slot[data-slot-id="ad-slot-17"]');

		scrollToElement(adSlot3);

		const firstAd = adSlot3.locator('iframe');
		await expect(firstAd).toBeVisible();

		const lastAd = adSlot17.locator('iframe');
		await expect(lastAd).toHaveCount(0);

		scrollToElement(adSlot17);

		await expect(lastAd).toBeVisible();
	});

	test('ads can be hidden by user', async ({ page }) => {
		await page.waitForSelector('.content.ads-handled');

		const adSlot3Selector = '.ad-slot[data-slot-id="ad-slot-3"]';
		const adSlot3 = page.locator(adSlot3Selector);
		await expect(adSlot3).toBeVisible();

		await scrollToElement(adSlot3);

		const closeButton = adSlot3.locator('.close-button');
		await closeButton.click();
		await expect(adSlot3).toHaveClass(/hidden/);

		await page.reload();
		await page.waitForSelector('.content.ads-handled');

		const ad3AfterReload = page.locator(adSlot3Selector);
		await expect(ad3AfterReload).toHaveClass(/hidden/);

		await page.evaluate(() => localStorage.clear());
	});
});

async function getActiveAdSlotIds(page: Page) {
	await page.waitForSelector('.content.ads-handled');

	const activeAdSlots = await page.locator('.ad-slot[data-active="true"]').all();

	return await Promise.all(
		activeAdSlots.map(async (slot) => await slot.getAttribute('data-slot-id'))
	);
}

async function prepareArticleData(page: Page, articleData?: Partial<ArticleData>) {
	await page.route('**/api/articles/article1/article.json', async (route) => {
		await route.fulfill({
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...mockArticleData,
				...articleData
			})
		});
	});
}

async function prepareAdData(page: Page, adData?: { ads: AdMapping }) {
	await page.route('**/api/articles/article1/ads.json', async (route) => {
		await route.fulfill({
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				...mockAdData,
				...adData
			})
		});
	});
}
