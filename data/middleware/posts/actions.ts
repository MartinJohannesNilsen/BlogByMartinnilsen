"use server";
import { FirestoreFullPost, FullPost } from "@/types";
import { firestoreAutoId } from "@/utils/firestoreAutoId";
import { Collection, Db, Document, MongoClient, WithId } from "mongodb";

// Properties
const uri = `mongodb://${process.env.MONGODB_ROOT_USER}:${process.env.MONGODB_ROOT_PASSWORD}@localhost:27017/`;
let cachedDb: Db;
let client: MongoClient;
const collection = "posts";

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

// Helper functions for conversion
const postConverter = {
	toMongoDB: (post: FullPost): FirestoreFullPost => {
		return {
			...post,
			data: JSON.stringify(post.data),
		};
	},
	fromMongoDB: (doc: any): FullPost => {
		return {
			...doc,
			data: JSON.parse(doc.data),
		};
	},
};

const getPost = async (id: string): Promise<FullPost | null> => {
	const collection = await _getCollection();
	// @ts-ignore
	const postDoc = await collection.findOne({ _id: id });
	return postDoc ? postConverter.fromMongoDB(postDoc) : null;
};

const addPost = async (newDocument: FullPost): Promise<string> => {
	try {
		const collection = await _getCollection();
		const mongoDoc = postConverter.toMongoDB(newDocument);
		// Define id to firestore string, not using the default ObjectId
		const id = firestoreAutoId();
		//@ts-ignore
		await collection.insertOne({ ...mongoDoc, _id: id });
		return id;
	} catch (error) {
		console.error("Error adding post:", error);
		throw error;
	}
};

const updatePost = async (id: string, updateDocument: FullPost, stringify: boolean = true): Promise<boolean> => {
	const collection = await _getCollection();
	const updatedDoc = stringify ? postConverter.toMongoDB(updateDocument) : updateDocument;
	// @ts-ignore
	const result = await collection.updateOne({ _id: id }, { $set: updatedDoc });
	return result.matchedCount > 0;
};

const deletePost = async (id: string): Promise<boolean> => {
	const collection = await _getCollection();
	// @ts-ignore
	const result = await collection.deleteOne({ _id: id });
	return result.deletedCount > 0;
};

export { addPost, deletePost, getPost, updatePost };

// Not in use
const getPostCount = async (filterOnKeyValue?: {
	key: string;
	operator: any;
	value: boolean | string;
}): Promise<number> => {
	const collection = await _getCollection();
	const filter = filterOnKeyValue
		? { [filterOnKeyValue.key]: { [filterOnKeyValue.operator]: filterOnKeyValue.value } }
		: {};
	return await collection.countDocuments(filter);
};
const getPaginatedCollection = async (
	numberOfPosts: number = 10,
	direction: "prev" | "next" = "next",
	lastFetchedPosts?: WithId<Document>[],
	filterOnKeyValue?: { key: string; operator: any; value: boolean | string }
): Promise<WithId<Document>[]> => {
	const collection = await _getCollection();
	const filter = filterOnKeyValue
		? { [filterOnKeyValue.key]: { [filterOnKeyValue.operator]: filterOnKeyValue.value } }
		: {};
	const sort: any = { createdAt: -1 };
	let cursor;

	if (!lastFetchedPosts || lastFetchedPosts.length === 0) {
		cursor = collection.find(filter).sort(sort).limit(numberOfPosts);
	} else if (direction === "prev") {
		//@ts-ignore
		cursor = collection.find(filter).sort(sort).endBefore(lastFetchedPosts[0].createdAt).limit(numberOfPosts);
	} else {
		cursor = collection
			.find(filter)
			.sort(sort)
			//@ts-ignore
			.startAfter(lastFetchedPosts[lastFetchedPosts.length - 1].createdAt)
			.limit(numberOfPosts);
	}

	const documents = await cursor.toArray();
	return documents;
};
