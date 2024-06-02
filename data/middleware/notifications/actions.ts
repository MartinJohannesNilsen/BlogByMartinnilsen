"use server";
import { Collection, Db, MongoClient, ObjectId } from "mongodb";

// Properties
const uri = `mongodb://${process.env.MONGODB_ROOT_USER}:${process.env.MONGODB_ROOT_PASSWORD}@localhost:27017/`;
let cachedDb: Db;
let client: MongoClient;
const collection = "notifications";

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

// Convert MongoDB document to plain JavaScript object
function convertToPlainObject(doc: any) {
	return {
		...doc,
		_id: doc._id.toString(),
	};
}

// Function to get all notifications
export async function getAllNotifications() {
	const collection = await _getCollection();
	const notifications = await collection.find({}).toArray();
	return notifications.map(convertToPlainObject);
}

// Function to get notification by ID
export async function getNotificationById(notificationId: string) {
	const collection = await _getCollection();
	const notification = await collection.findOne({
		_id: new ObjectId(notificationId),
	});
	return notification ? convertToPlainObject(notification) : null;
}

// Function to create a new notification
export async function createNotification(notification: any) {
	const collection = await _getCollection();
	const result = await collection.insertOne(notification);
	return await getNotificationById(result.insertedId.toHexString());
}

// Function to update a notification by ID
export async function updateNotification(notificationId: string, update: any) {
	const collection = await _getCollection();
	const result = await collection.updateOne(
		{
			_id: new ObjectId(notificationId),
		},
		{ $set: update }
	);
	return result.modifiedCount > 0 ? await getNotificationById(notificationId) : null;
}

// Function to delete a notification by ID
export async function deleteNotification(notificationId: string): Promise<boolean> {
	const collection = await _getCollection();
	const result = await collection.deleteOne({
		_id: new ObjectId(notificationId),
	});
	return result.deletedCount > 0;
}
