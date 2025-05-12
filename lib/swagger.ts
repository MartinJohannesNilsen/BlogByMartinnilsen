import { createSwaggerSpec } from "next-swagger-doc";

export const apiDocSpec = createSwaggerSpec({
	apiFolder: "app/api",
	definition: {
		openapi: "3.0.0",
		info: {
			title: "MJNTech Blog API",
			version: "3.1.0",
			// contact: {
			//   name: "Martin Johannes Nilsen",
			//   url: "https://links.martinjohannesnilsen.no/",
			//   // email: "martinjnilsen@icloud.com",
			// },
			contact: {
				name: "Martin Johannes Nilsen",
				url: process.env.NEXT_PUBLIC_WEBSITE_URL,
			},
		},
		components: {
			securitySchemes: {
				ApiKeyAuth: {
					type: "apiKey",
					in: "header", // can be "header", "query" or "cookie"
					name: "apikey", // name of the header, query parameter or cookie
				},
			},
		},
		security: [
			{
				ApiKeyAuth: [],
			},
		],
		tags: [
			{
				name: "Default",
				description: "Default endpoints",
			},
			{
				name: "Media",
				description: "Endpoints related to media management",
			},
			{
				name: "Notifications",
				description: "Endpoints related to notifications",
			},
			{
				name: "Posts",
				description: "Endpoints related to post management",
			},
			{
				name: "Tags",
				description: "Endpoints related to available tags",
			},
			{
				name: "Views",
				description: "Endpoints related to view counts",
			},
		],
	},
});
