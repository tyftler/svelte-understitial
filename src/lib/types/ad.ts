export type AdFormat =
	| 'medium-rectangle'
	| 'half-page'
	| 'skyscraper'
	| 'billboard'
	| 'super-banner'
	| 'sitelink'
	| 'promotion'
	| 'interstitial'
	| 'understitial';

export type AdType = 'text' | 'static-image' | 'animated-image' | 'video' | 'interactive';

export type AdEmbedding = 'iframe' | 'html';

export interface Ad {
	id: string;
	format: AdFormat;
	adServer: string;
	adUnitId: string;
	type: AdType;
	size: [number, number];
	embedding: AdEmbedding;
	url?: string;
	html?: string;
}

export type AdMapping = Record<string, Ad>;
