const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors package
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors()); // Use cors middleware

// Connect to MongoDB using environment variable or default URI
const mongoURI = process.env.DOCUMENTDB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Handle MongoDB connection events
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  clicks: { type: Number, default: 0 },
});

const Url = mongoose.model("Url", urlSchema);

app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find();
    res.json(urls);
  } catch (error) {
    console.error("Failed to retrieve data:", error);
    res.status(500).send("Server error");
  }
});

app.post("/api/shorten", async (req, res) => {
  console.log("Received POST request to /shorten");
  const { originalUrl } = req.body;
  const nanoid = (await import("nanoid")).nanoid;
  const shortId = nanoid(10);
  const shortUrl = `http://tomoprojektas.com/shorturl/${shortId}`;
  const url = new Url({ originalUrl, shortUrl });
  await url.save();
  res.json({ originalUrl, shortUrl });
});

app.get("/api/:shortUrl", async (req, res) => {
  console.log(`Received GET request to /${req.params.shortUrl}`);
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    if (url) {
      url.clicks++;
      await url.save(); // Ensure the document is updated before redirecting
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error("Error redirecting to the original URL:", error);
    res.status(500).send("Server error");
  }
});

app.get("/jobs/:shortId", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortUrl: `https://pemploy.com/jobs/${req.params.shortId}`,
    });
    if (url) {
      url.clicks++;
      await url.save();
      res.redirect(url.originalUrl);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    console.error("Error redirecting to the original URL:", error);
    res.status(500).send("Server error");
  }
});
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
