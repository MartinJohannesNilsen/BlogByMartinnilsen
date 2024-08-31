"use server";
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

// Function to get all view counts
export async function getAllViewCounts(): Promise<{ [key: string]: number } | null> {
	const collection = await _getCollection();
	const document = await collection.findOne({
		// @ts-ignore
		_id: "views",
	});

	return document ? document.values : null;
}

// Function to increment view count
export async function incrementViewCount(postId: string): Promise<void> {
	const collection = await _getCollection();

	const updateResult = await collection.updateOne(
		// @ts-ignore
		{ _id: "views" },
		{ $inc: { [`values.${postId}`]: 1 } },
		{ upsert: true }
	);

	if (updateResult.matchedCount === 0) {
		await collection.updateOne(
			// @ts-ignore
			{ _id: "views" },
			{ $set: { [`values.${postId}`]: 1 } },
			{ upsert: true }
		);
	}
}

// Function to set view count
export async function setViewCount(postId: string, count: number): Promise<void> {
	const collection = await _getCollection();

	await collection.updateOne(
		// @ts-ignore
		{ _id: "views" },
		{ $set: { [`values.${postId}`]: count } },
		{ upsert: true }
	);
}

// Function to get view count
export async function getViewCount(postId: string): Promise<number> {
	const collection = await _getCollection();
	const document = await collection.findOne({
		// @ts-ignore
		_id: "views",
	});

	if (document && document.values && document.values[postId] !== undefined) {
		return document.values[postId];
	} else {
		return 0; // Return 0 if the post ID is not found
	}
}

// Function to delete view count
export async function deleteViewCount(postId: string): Promise<boolean> {
	const collection = await _getCollection();

	const updateResult = await collection.updateOne(
		{
			// @ts-ignore
			_id: "views",
		},
		{ $unset: { [`values.${postId}`]: "" } }
	);

	return updateResult.modifiedCount > 0;
}
