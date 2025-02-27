import type { AdMapping, ArticleData } from '$lib/types';
import type { PageLoad } from './$types';

// disable ssr for playwright tests so we can intercept and mock data
export const ssr = !(typeof process !== 'undefined' && process.env.PLAYWRIGHT === 'true');

export const load: PageLoad = async ({ fetch, params }) => {
	// map the slug to its article id
	const { slug } = params;
	const articleId = 'article1';

	const articleResponse = await fetch(`/api/articles/${articleId}/article.json`);
	const articleData: ArticleData = await articleResponse.json();

	const adResponse = await fetch(`/api/articles/${articleId}/ads.json`);
	const adData: { ads: AdMapping } = await adResponse.json();

	return {
		metadata: articleData.metadata,
		content: articleData.content,
		ads: adData.ads
	};
};
