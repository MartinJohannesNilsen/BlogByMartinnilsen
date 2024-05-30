"use server";
import { StoredPost } from "@/types";
import { MongoClient, Db } from "mongodb";

const uri = `mongodb://${process.env.MONGODB_ROOT_USER}:${process.env.MONGODB_ROOT_PASSWORD}@localhost:27017/`;
const client = new MongoClient(uri);

const _sortListOfStoredPostsOnTimestamp = (data: StoredPost[], asc?: boolean) => {
	if (!data) return [];
	if (asc) {
		return data.sort((prev, next) => prev.createdAt - next.createdAt); //Ascending, oldest (smallest createdAt) first
	}
	return data.sort((prev, next) => next.createdAt - prev.createdAt); //Descending, latest (largest createdAt) first
};

export const _filterListOfStoredPostsOnPublished = (
	data: StoredPost[],
	filter: "published" | "unpublished" | "all" | "saved"
) => {
	if (filter === "published") {
		return data.filter((post) => post.published);
	} else if (filter === "unpublished") {
		return data.filter((post) => !post.published);
	} else if (filter === "saved") {
		const saved = JSON.parse(localStorage.getItem("savedPosts")!);
		return data.filter((post) => saved && saved.includes(post.id) && post.published);
	}
	return data;
};

const getAllPostIds = async (filterOnVisibility: boolean): Promise<string[]> => {
	try {
		await client.connect();
		const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
		const collection = db.collection("administrative");

		// @ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			const data: StoredPost[] = postsOverviewDoc.values;
			const list: { id: string }[] = filterOnVisibility ? _filterListOfStoredPostsOnPublished(data, "published") : data;
			const res = list.map((val) => val.id);
			return res;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error fetching post ids:", error);
		return [];
	} finally {
		await client.close();
	}
};

const getPostsOverview = async (sorted?: "asc" | "desc", filterOnPublished?: boolean): Promise<StoredPost[]> => {
	try {
		await client.connect();
		const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
		const collection = db.collection("administrative");

		// @ts-ignore
		const postsOverviewDoc = await collection.findOne({ _id: "overview" });

		if (postsOverviewDoc) {
			let data: StoredPost[] = postsOverviewDoc.values;

			if (sorted) {
				data = _sortListOfStoredPostsOnTimestamp(data, sorted === "asc");
			}

			if (filterOnPublished) {
				data = _filterListOfStoredPostsOnPublished(data, "published");
			}

			return data;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error fetching posts overview:", error);
		return [];
	} finally {
		await client.close();
	}
};

const addPostsOverview = async (newPost: StoredPost): Promise<boolean> => {
	try {
		await client.connect();
		const db: Db = client.db("data-staging");
		const collection = db.collection("administrative");

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
	} finally {
		await client.close();
	}
};

const updatePostsOverview = async (updatedPost: StoredPost): Promise<boolean> => {
	try {
		await client.connect();
		const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
		const collection = db.collection("administrative");

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
	} finally {
		await client.close();
	}
};

const deletePostsOverview = async (id: string): Promise<boolean> => {
	try {
		await client.connect();
		const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
		const collection = db.collection("administrative");
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
	} finally {
		await client.close();
	}
};

export { addPostsOverview, deletePostsOverview, getAllPostIds, getPostsOverview, updatePostsOverview };
