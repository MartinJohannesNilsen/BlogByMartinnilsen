import { cloudStorage } from "@/lib/firebaseConfig";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";

// Helper functions
const generateName = (extension: string) => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");
	return `${year}-${month}-${day}.${hour}${minute}${second}.${extension}`;
};

// Convert a file to buffer
const srcToBuffer = async (file: File) => {
	return Buffer.from(await file.arrayBuffer());
};

export async function uploadFile(file: File, postId?: string, name?: string | null) {
	// Get extension from file name
	const extensionMatch = file.name.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
	const extension = extensionMatch && extensionMatch[1].toLowerCase();
	if (!extension) return { code: 400, reason: "File missing extension!" };

	// Rename file, timestamp as default if not given new name
	const fileRef = `files/${postId}${postId && "/"}` + (name ? `${name}.${extension}` : generateName(extension));

	try {
		// Upload to Firestore
		const cloudStorageFileRef = ref(cloudStorage, fileRef);
		const metadata = {
			contentType: file.type,
		};
		const fileBuffer = await srcToBuffer(file);
		//@ts-ignore
		const uploadTask = await uploadBytes(cloudStorageFileRef, fileBuffer, metadata);
		const downloadURL = await getDownloadURL(uploadTask.ref);

		return {
			code: 200,
			data: { url: downloadURL, fileRef: fileRef },
			file: { size: file.size, name: file.name, type: file.type },
		};
	} catch (error) {
		return { code: 500, reason: error.message };
	}
}

export async function deleteFile(fileRef: string) {
	try {
		const db_fileRef = ref(cloudStorage, fileRef);
		await deleteObject(db_fileRef);
		return { code: 200, response: "File successfully deleted!" };
	} catch (error) {
		return { code: 500, reason: error.message };
	}
}
