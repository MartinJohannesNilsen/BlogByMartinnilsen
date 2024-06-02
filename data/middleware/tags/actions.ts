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

const getTags = async (): Promise<string[]> => {
	try {
		const collection = await _getCollection();
		// @ts-ignore
		const tagsDoc = await collection.findOne({ _id: "tags" });
		if (tagsDoc) {
			return tagsDoc.values;
		} else {
			return [];
		}
	} catch (error) {
		console.error("Error fetching tags:", error);
		return [];
	}
};

const addTag = async (tag: string): Promise<boolean> => {
	try {
		const collection = await _getCollection();
		// @ts-ignore
		const tagsDoc = await collection.findOne({ _id: "tags" });

		if (tagsDoc) {
			let values: string[] = tagsDoc.values;
			if (values.includes(tag)) {
				return false;
			}
			values.push(tag);
			// @ts-ignore
			await collection.updateOne({ _id: "tags" }, { $set: { values: values } });
			return true;
		}
		return false;
	} catch (error) {
		console.error("Error adding tag:", error);
		return false;
	}
};

export { addTag, getTags };
