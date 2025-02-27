import type { Metadata } from './metadata';

export type HeadingBlock = {
	type: 'heading';
	content: string;
};

export type ParagraphBlock = {
	type: 'paragraph';
	content: string;
};

export type ImageBlock = {
	type: 'image';
	src: string;
	size: [number, number];
	alt: string;
	caption?: string;
};

export type AdSlotBlock = {
	type: 'ad-slot';
	id: string;
};

export type ContentBlock = HeadingBlock | ParagraphBlock | ImageBlock | AdSlotBlock;

export interface ArticleData {
	metadata: Metadata;
	content: ContentBlock[];
}
