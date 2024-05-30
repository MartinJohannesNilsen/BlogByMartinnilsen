"use server";
import { MongoClient, Db, Collection } from "mongodb";

const uri = `mongodb://${process.env.MONGODB_ROOT_USER}:${process.env.MONGODB_ROOT_PASSWORD}@localhost:27017/`;
const client = new MongoClient(uri);

const getCollection = async (collectionName: string): Promise<Collection> => {
	await client.connect();
	const db: Db = client.db(process.env.NEXT_PUBLIC_DB);
	return db.collection(collectionName);
};

const getTags = async (): Promise<string[]> => {
	try {
		const collection = await getCollection("administrative");
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
	} finally {
		await client.close();
	}
};

const addTag = async (tag: string): Promise<boolean> => {
	try {
		const collection = await getCollection("administrative");
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
	} finally {
		await client.close();
	}
};

export { addTag, getTags };
