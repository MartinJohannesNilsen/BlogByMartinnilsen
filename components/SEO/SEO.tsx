import Head from "next/head";
import { useTheme } from "../../styles/themes/ThemeProvider";

type MetaProps = {
	title?: string;
	description?: string;
	author?: string;
	openGraph?: {
		url: string;
		image: string;
		type: "website" | "article";
		article?: {
			published: Date;
			keywords?: string[];
		};
	};
	twitter?: { handle: string; cardType: string };
	themeColor?: string;
	canonical?: string;
};

type SEOProps = {
	children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
	pageMeta: MetaProps;
};

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
	ogImage: "https://blog.mjntech.dev/assets/icons/ogimage.png",
	icon: "https://blog.mjntech.dev/assets/icons/logo512.png",
	copyright: `All rights reserved ${new Date().getFullYear()}, Martin Johannes Nilsen`,
	twitterHandle: "@MartinJNilsen",
};

export const SEO = ({ children, pageMeta }: SEOProps) => {
	const { theme } = useTheme();

	const meta: MetaProps = {
		themeColor: theme.palette.primary.main,
		// title: "Tech blog | Martin Johannes Nilsen",
		title: DATA_DEFAULTS.title,
		description: DATA_DEFAULTS.description,
		author: DATA_DEFAULTS.author.name,
		openGraph: {
			type: "website",
			url: DATA_DEFAULTS.url,
			image: DATA_DEFAULTS.ogImage,
		},
		twitter: { handle: DATA_DEFAULTS.twitterHandle, cardType: "summary" },
		...pageMeta,
	};

	return (
		<>
			<Head>
				{/* Standard */}
				<meta charSet="UTF-8" />
				<title>{meta.title}</title>
				<meta name="author" content={meta.author} />
				<meta name="description" content={meta.description} />
				<meta name="theme-color" content={meta.themeColor} />
				{meta.canonical && <link rel="canonical" href={meta.canonical} />}
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				{/* Open Graph */}
				<meta property="og:title" content={meta.title} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:url" content={meta.openGraph.url} />
				<meta property="og:image" content={meta.openGraph.image} />
				{meta.openGraph.type === "website" ? (
					<meta property="og:type" content={meta.openGraph.type} />
				) : meta.openGraph.type === "article" && meta.openGraph.article ? (
					<>
						<meta property="og:type" content={meta.openGraph.type} />
						<meta
							property="article:published_time"
							content={
								meta.openGraph.article.published.getFullYear() +
								"-" +
								("0" + (meta.openGraph.article.published.getMonth() + 1)).slice(-2) +
								"-" +
								("0" + meta.openGraph.article.published.getDate()).slice(-2)
							}
						/>
						<meta name="keywords" content={meta.openGraph.article.keywords.join(", ")} />
					</>
				) : null}

				{/* Twitter */}
				<meta name="twitter:title" content={meta.title} />
				<meta name="twitter:description" content={meta.description} />
				<meta name="twitter:image" content={meta.openGraph.image} />
				<meta name="twitter:card" content={meta.twitter.cardType} />
				<meta name="twitter:creator" content={meta.twitter.handle} />
			</Head>
			{children}
		</>
	);
};
export default SEO;
