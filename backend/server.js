const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(express.json());
app.use(cors());

// Initialize DynamoDB Client
const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION, // Ensure this is set in your ECS task's environment variables
});

const docClient = DynamoDBDocumentClient.from(ddbClient);

// API to store URL information
app.post("/api/shorten", async (req, res) => {
  const { originalUrl } = req.body;
  const nanoid = (await import("nanoid")).nanoid;
  const shortId = nanoid(10);
  const shortUrl = `http://tomoprojektukas.com/shorturl/${shortId}`;
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      originalUrl,
      shortUrl,
      clicks: 0,
    },
  };

  try {
    await docClient.send(new PutCommand(params));
    res.json({ originalUrl, shortUrl });
  } catch (error) {
    console.error("Error saving URL:", error);
    res.status(500).json({ error: "Error saving URL" });
  }
});

// API to retrieve all URLs
app.get("/api/urls", async (req, res) => {
  const params = {
    TableName: "Urls",
  };

  try {
    const { Items } = await docClient.send(new ScanCommand(params));
    res.json(Items);
  } catch (error) {
    console.error("Error retrieving URLs:", error);
    res.status(500).json({ error: "Error retrieving URLs" });
  }
});

// Middleware for error handling and existing test route
app.get("/api/test", (req, res) => {
  console.log("GET /api/test called");
  res.json({ message: "Test API is working!" });
});

app.use((req, res, next) => {
  console.log("404 Not Found:", req.originalUrl);
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error("500 Server Error:", err.stack);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
