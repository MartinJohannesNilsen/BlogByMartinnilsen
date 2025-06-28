"use server";
import { StoredPost } from "@/types";
import { Collection, Db, MongoClient } from "mongodb";

// Properties
const uri = `mongodb://${process.env.MONGODB_ROOT_USER}:${process.env.MONGODB_ROOT_PASSWORD}@localhost:27017/`;
let cachedDb: Db;
let client: MongoClient;
const collection = "administrative";

// Utility function to get the collection
export async function _getCollection(): Promise<Collection> {
	if (cachedDb) {
		return cachedDb.collection(collection);
	}
	try {
		client = await MongoClient.connect(uri);
		const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
		cachedDb = db;
		return db.collection(collection);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

// Convert sorting function to async
export async function _sortListOfStoredPostsOnTimestamp(data: StoredPost[], asc?: boolean): Promise<StoredPost[]> {
	if (!data) return [];
	if (asc) {
		return data.sort((prev, next) => prev.createdAt - next.createdAt); //Ascending, oldest (smallest createdAt) first
	}
	return data.sort((prev, next) => next.createdAt - prev.createdAt); //Descending, latest (largest createdAt) first
}

// Convert filter function to async
export async function _filterListOfStoredPostsOnPublished(
	data: StoredPost[],
	filter: "published" | "unpublished" | "all" | "saved"
): Promise<StoredPost[]> {
	if (filter === "published") {
		return data.filter((post) => post.published);
	} else if (filter === "unpublished") {
		return data.filter((post) => !post.published);
	} else if (filter === "saved") {
		if (typeof window !== "undefined" && window.localStorage) {
			const saved = JSON.parse(localStorage.getItem("savedPosts")!);
			return data.filter((post) => saved && saved.includes(post.id) && post.published);
		}
	}
	return data;
}

export async function getAllPostIds(filterOnVisibility: boolean): Promise<string[]> {
	try {
		// Get collection
		const collection = await _getCollection();

		// @ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			const data: StoredPost[] = postsOverviewDoc.values;
			const filteredData = filterOnVisibility ? await _filterListOfStoredPostsOnPublished(data, "published") : data;
			const res = filteredData.map((val) => val.id);
			return res;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error fetching post ids:", error);
		return [];
	}
}

export async function getPostsOverview(sorted?: "asc" | "desc", filterOnPublished?: boolean): Promise<StoredPost[]> {
	try {
		// Get collection
		const collection = await _getCollection();

		// @ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			let data: StoredPost[] = postsOverviewDoc.values;

			if (sorted) {
				data = await _sortListOfStoredPostsOnTimestamp(data, sorted === "asc");
			}

			if (filterOnPublished) {
				data = await _filterListOfStoredPostsOnPublished(data, "published");
			}

			return data;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error fetching posts overview:", error);
		return [];
	}
}

export async function addPostsOverview(newPost: StoredPost): Promise<boolean> {
	try {
		// Get collection
		const collection = await _getCollection();

		//@ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			let values: StoredPost[] = postsOverviewDoc.values;

			const postExists = values.some((post) => post.id === newPost.id);
			if (postExists) {
				return false;
			}

			values.push(newPost);
			//@ts-ignore
			await collection.updateOne({ _id: "overview" }, { $set: { values: values } }).catch((error) => {
				console.error("Error updating document:", error);
				return false;
			});
		} else {
			// Handle the case where the document does not exist, if necessary
			return false;
		}
		return true;
	} catch (error) {
		console.error("Error adding post to overview:", error);
		return false;
	}
}

export async function updatePostsOverview(updatedPost: StoredPost): Promise<boolean> {
	try {
		// Get collection
		const collection = await _getCollection();

		//@ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			let values: StoredPost[] = postsOverviewDoc.values;

			values = values.map((originalPost: StoredPost) =>
				originalPost.id === updatedPost.id ? updatedPost : originalPost
			);

			await collection
				.updateOne(
					//@ts-ignore
					{ _id: "overview" },
					{ $set: { values: values } }
				)
				.catch((error) => {
					console.error("Error updating document:", error);
					return false;
				});

			return true;
		} else {
			console.error("Document not found");
			return false;
		}
	} catch (error) {
		console.error("Error updating posts overview:", error);
		return false;
	}
}

export async function deletePostsOverview(id: string): Promise<boolean> {
	try {
		// Get collection
		const collection = await _getCollection();

		//@ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			let values: StoredPost[] = postsOverviewDoc.values;

			values = values.filter((post: StoredPost) => post.id !== id);

			await collection
				.updateOne(
					//@ts-ignore
					{ _id: "overview" },
					{ $set: { values: values } }
				)
				.catch((error) => {
					console.error("Error updating document:", error);
					return false;
				});

			return true;
		} else {
			console.error("Document not found");
			return false;
		}
	} catch (error) {
		console.error("Error deleting post from overview:", error);
		return false;
	}
}
