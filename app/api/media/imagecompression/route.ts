import { compressImage } from "@/data/middleware/media/imageCompression/actions";
import { validateAuthAPIToken } from "@/data/middleware/tokenValidationAPI";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Set maximum execution time to 60 seconds

/**
 * @swagger
 * /api/media/imagecompression:
 *   post:
 *     summary: Compress image
 *     description: Compresses images (JPEG, PNG, etc.) with configurable quality settings and content-aware optimizations
 *     tags:
 *       - Media
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to compress
 *               quality:
 *                 type: integer
 *                 description: Quality level (1-100, where 100 is highest quality)
 *                 example: 80
 *               format:
 *                 type: string
 *                 description: Output format (auto, jpeg, png, webp, avif)
 *                 example: auto
 *               filename:
 *                 type: string
 *                 description: Optional custom filename for the output file (without extension)
 *                 example: ""
 *               preserveMetadata:
 *                 type: boolean
 *                 description: Whether to preserve image metadata (EXIF, etc.)
 *                 example: false
 *     responses:
 *       '200':
 *         description: Compressed image
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           X-Original-Size:
 *             description: Original image size in bytes
 *             schema:
 *               type: integer
 *           X-Compressed-Size:
 *             description: Compressed image size in bytes
 *             schema:
 *               type: integer
 *           X-Compression-Ratio:
 *             description: Compression ratio as percentage of original size
 *             schema:
 *               type: string
 *           X-Size-Reduction:
 *             description: Size reduction as percentage
 *             schema:
 *               type: string
 *           X-Image-Type:
 *             description: Detected image type (photographic or graphic)
 *             schema:
 *               type: string
 *           X-Adaptive-Quality:
 *             description: Adaptive quality level used
 *             schema:
 *               type: integer
 *       '400':
 *         description: Bad request - missing image or invalid parameters
 *       '415':
 *         description: Unsupported media type
 *       '500':
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
	// Validate authorized access based on header field 'apikey'
	const authValidation = await validateAuthAPIToken(request);
	if (!authValidation.isValid) {
		return Response.json({ code: authValidation.code, reason: authValidation.reason }, { status: authValidation.code });
	}

	// Perform image compression
	try {
		// Check if the request is multipart form data
		const contentType = request.headers.get("content-type") || "";
		if (!contentType.includes("multipart/form-data")) {
			return Response.json({ error: "Request must be multipart/form-data" }, { status: 415 });
		}

		// Parse the form data
		const formData = await request.formData();
		const imageFile = formData.get("image") as File | null;

		if (!imageFile) {
			return Response.json({ error: "No image file provided" }, { status: 400 });
		}

		// Get compression quality parameter (default: 80)
		const qualityParam = formData.get("quality");
		const quality = qualityParam ? Math.max(1, Math.min(100, Number(qualityParam))) : 80;

		// Get output format (default: auto - detect from input)
		const formatParam = ((formData.get("format") as string) || "auto").toLowerCase();

		// Get custom filename if provided
		const customFilename = formData.get("filename") as string | null;

		// Get metadata preservation preference
		const preserveMetadata = formData.get("preserveMetadata") === "true";

		// Read the file as ArrayBuffer
		const arrayBuffer = await imageFile.arrayBuffer();
		const imageBuffer = Buffer.from(arrayBuffer);

		// Call the middleware function to compress the image
		const result = await compressImage(imageBuffer, imageFile.name, quality, formatParam, customFilename);

		if (result.code !== 200) {
			return Response.json({ error: result.reason }, { status: result.code });
		}

		// Return the compressed image with enhanced metadata
		if (result.data) {
			// Create response headers with detailed compression information
			const headers = {
				"Content-Type": result.data.contentType,
				"Content-Disposition": `inline; filename="${result.data.filename}"`,
				"X-Original-Size": result.data.originalSize.toString(),
				"X-Compressed-Size": result.data.compressedSize.toString(),
				"X-Compression-Ratio": result.data.compressionRatio.toFixed(2) + "%",
				"X-Size-Reduction": result.data.reduction ? result.data.reduction.toFixed(2) + "%" : "0%",
			};

			return new Response(result.data.buffer, {
				status: 200,
				headers,
			});
		}

		// Should never reach here if result.data exists
		return Response.json({ error: "Failed to process image - no data returned" }, { status: 500 });
	} catch (error) {
		console.error("Image compression error:", error);
		return Response.json({ error: "Failed to process image" }, { status: 500 });
	}
}
