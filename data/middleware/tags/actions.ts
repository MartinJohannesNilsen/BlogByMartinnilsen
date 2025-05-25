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
			if (!Array.isArray(tagsDoc.values)) {
				console.error("Tags values are not an array:", tagsDoc.values);
				return [];
			}
			if (tagsDoc.values.length === 0) {
				console.warn("No tags found in the database.");
				return [];
			}
			// Return alphabetically sorted tags
			return tagsDoc.values.sort((a: string, b: string) => a.localeCompare(b));
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

const renameTag = async (oldTag: string, newTag: string): Promise<boolean> => {
	try {
		const collection = await _getCollection();
		// @ts-ignore
		const tagsDoc = await collection.findOne({ _id: "tags" });

		if (tagsDoc) {
			let values: string[] = tagsDoc.values;
			if (!values.includes(oldTag) || values.includes(newTag)) {
				return false;
			}
			values = values.map((tag) => (tag === oldTag ? newTag : tag));
			// @ts-ignore
			await collection.updateOne({ _id: "tags" }, { $set: { values: values } });
			return true;
		}
		return false;
	} catch (error) {
		console.error("Error renaming tag:", error);
		return false;
	}
};

const deleteTag = async (tag: string): Promise<boolean> => {
	try {
		const collection = await _getCollection();
		// @ts-ignore
		const tagsDoc = await collection.findOne({ _id: "tags" });

		if (tagsDoc) {
			let values: string[] = tagsDoc.values;
			if (!values.includes(tag)) {
				return false;
			}
			values = values.filter((t) => t !== tag);
			// @ts-ignore
			await collection.updateOne({ _id: "tags" }, { $set: { values: values } });
			return true;
		}
		return false;
	} catch (error) {
		console.error("Error deleting tag:", error);
		return false;
	}
};

export { addTag, deleteTag, getTags, renameTag };
