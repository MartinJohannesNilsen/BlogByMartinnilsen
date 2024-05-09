import { createSwaggerSpec } from "next-swagger-doc";

export const createdApiDocSpec = createSwaggerSpec({
	apiFolder: "pages/api",
	// apiFolder: "app/api",
	definition: {
		openapi: "3.0.0",
		info: {
			title: "MJNTech Blog API",
			version: "1.0",
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
				name: "EditorJS",
				description: "Endpoints related to EditorJS components",
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
				name: "Views",
				description: "Endpoints related to view counts",
			},
		],
	},
});
