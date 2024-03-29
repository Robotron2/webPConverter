const express = require("express")
const fs = require("fs")
const path = require("path")
const upload = require("./utils/multer")
const convertToWebP = require("./utils/convertToWebP")

const app = express()
const port = 4000

app.use("/converted_images", express.static(path.join(__dirname, "converted_images")))

app.get("/", (req, res) => {
	res.send("Image upload and conversion server")
})

const convertedImagesDir = path.join(__dirname, "converted_images")
if (!fs.existsSync(convertedImagesDir)) {
	fs.mkdirSync(convertedImagesDir, { recursive: true })
}

app.post("/upload", upload.single("image"), async (req, res) => {
	const inputFilePath = req.file.path
	const outputFilePath = path.join(__dirname, "converted_images", req.file.filename + ".webp")

	const conversionSuccess = await convertToWebP(inputFilePath, outputFilePath)

	if (conversionSuccess) {
		const protocol = req.secure ? "https" : "http"
		const baseURL = protocol + "://" + req.get("host")
		const imageURL = "/converted_images/" + req.file.filename + ".webp"
		res.json({ imageURL: baseURL + imageURL })
	} else {
		res.status(500).send("Error during file upload or conversion.")
	}
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
