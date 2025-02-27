<script lang="ts">
	import type { Metadata } from '$lib/types';

	export let metadata: Metadata;
</script>

<svelte:head>
	<!-- General -->
	<title>{metadata.title}</title>
	<link rel="canonical" href={metadata.url} />
	<meta name="description" content={metadata.description} />
	<meta name="keywords" content={metadata.keywords.join(', ')} />

	<!-- Article -->
	<meta name="news_keywords" content={metadata.keywords.join(', ')} />
	<meta name="author" content={metadata.author} />

	<!-- Language and Locale -->
	<meta name="content-language" content="de-DE" />
	<meta property="og:locale" content="de_DE" />

	<!-- Robots -->
	<meta name="robots" content="index, follow" />
	<meta name="googlebot" content="index, follow" />

	<!-- Open Graph -->
	<meta property="og:url" content={metadata.url} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="Understitial Times" />
	<meta property="og:title" content={metadata.title} />
	<meta property="og:description" content={metadata.description} />
	<meta property="og:image" content={metadata.imageUrl} />

	<!-- Open Graph Article -->
	<meta property="article:author" content={metadata.author} />
	<meta property="article:published_time" content={metadata.publishedDate} />
	{#if metadata.modifiedDate}
		<meta property="article:modified_time" content={metadata.modifiedDate} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@understitialtimes" />
	<meta name="twitter:title" content={metadata.title} />
	<meta name="twitter:description" content={metadata.description} />
	<meta name="twitter:image" content={metadata.imageUrl} />

	<!-- JSON-LD Structured Data -->
	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "NewsArticle",
			"headline": metadata.title,
			"description": metadata.description,
			"image": metadata.imageUrl,
			"author": {
				"@type": "Person",
				"name": metadata.author
			},
			"datePublished": metadata.publishedDate,
			"dateModified": metadata.modifiedDate || metadata.publishedDate,
			"publisher": {
				"@type": "Organization",
				"name": "Understitial Times",
				"logo": {
					"@type": "ImageObject",
					"url": "https://www.understitial-times.com/favicon.png"
				}
			},
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": metadata.url
			}
		})}
	</script>
</svelte:head>
