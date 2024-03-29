const sharp = require("sharp")

async function convertToWebP(inputFilePath, outputFilePath) {
	try {
		await sharp(inputFilePath).webp({ quality: 80 }).toFile(outputFilePath)

		console.log("Image converted to WebP successfully!")

		fs.unlinkSync(inputFilePath)

		return true
	} catch (error) {
		console.error("Error converting image to WebP:", error)
		return false
	}
}
module.exports = convertToWebP
