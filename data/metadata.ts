import { Metadata, Viewport } from "next";

export const DATA_DEFAULTS = {
	url: "https://blog.MJNTech.dev",
	title: "Blog by MJNTech",
	description:
		"A tech blog by Martin Johannes Nilsen, a Software Engineer with an M.Sc. in Computer Science and a passionate problem solver.",
	author: {
		name: "Martin Johannes Nilsen",
		email: "martinjnilsen@icloud.com",
		link: "https://martinjohannesnilsen.no",
	},
	images: {
		openGraph: "https://blog.mjntech.dev/assets/icons/ogimage.png",
		logo512: "https://blog.mjntech.dev/assets/icons/logo512.png",
		logo256: "https://blog.mjntech.dev/assets/icons/logo256.png",
		appleTouchIcon: "https://blog.mjntech.dev/apple-touch-icon.png",
		favicon: "https://blog.mjntech.dev/favicon.ico",
	},
	copyright: `All rights reserved ${new Date().getFullYear()}, Martin Johannes Nilsen`,
	twitterHandle: "@MartinJNilsen",
};

export function formatDate(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export const defaultMetadata: Metadata = {
	// Icons
	// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#icons
	icons: {
		icon: DATA_DEFAULTS.images.favicon,
		apple: DATA_DEFAULTS.images.appleTouchIcon,
		// icon: "/favicon.ico",
		// apple: "/apple-touch-icon.png",
		// shortcut: '/shortcut-icon.png',
		// other: {
		//   rel: 'apple-touch-icon-precomposed',
		//   url: "/something.png",
		// },
	},
	// Manifest
	manifest: "/manifest.json",
	// Title
	// title: {
	// 	template: '%s | MJNTECH', // Define a template where each page use title as '%s'
	// 	default: '...', // Default if using template
	// 	absolute: '...', // Override template at for specific page
	//   },
	title: DATA_DEFAULTS.title,
	authors: [
		{
			name: DATA_DEFAULTS.author.name,
			url: DATA_DEFAULTS.author.link,
		},
	],
	description: DATA_DEFAULTS.description,
	openGraph: {
		title: DATA_DEFAULTS.title,
		description: DATA_DEFAULTS.description,
		url: DATA_DEFAULTS.url,
		siteName: DATA_DEFAULTS.title,
		images: [
			{
				url: DATA_DEFAULTS.images.openGraph, // Must be an absolute URL
				width: 1200,
				height: 630,
			},
			// {
			// 	url: "https://nextjs.org/og.png", // Must be an absolute URL
			// 	width: 800,
			// 	height: 600,
			// },
			// {
			// 	url: "https://nextjs.org/og-alt.png", // Must be an absolute URL
			// 	width: 1800,
			// 	height: 1600,
			// 	alt: "My custom alt",
			// },
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: DATA_DEFAULTS.title,
		description: DATA_DEFAULTS.description,
		// siteId: '1467726470533754880',
		creator: DATA_DEFAULTS.twitterHandle,
		// creatorId: '1467726470533754880',
		images: [DATA_DEFAULTS.images.openGraph], // Must be an absolute URL
	},
};
