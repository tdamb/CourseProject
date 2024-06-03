const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const app = express();
app.use(express.json());
app.use(cors());

// Create DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

// Function to test DynamoDB Scan
const testScanDynamoDB = async () => {
  const params = { TableName: "Urls" };
  const command = new ScanCommand(params);

  try {
    const { Items } = await docClient.send(command);
    console.log("Scan successfully executed, data retrieved:", Items);
  } catch (err) {
    console.error("Error during DynamoDB scan:", err);
  }
};

// Define your routes
app.get("/api/:shortUrl", async (req, res) => {
  console.log("GET /api/:shortUrl called with:", req.params.shortUrl);
  const params = {
    TableName: "Urls",
    Key: {
      shortUrl: req.params.shortUrl,
    },
  };
  const command = new GetCommand(params);

  try {
    const { Item } = await docClient.send(command);
    if (!Item) {
      res.status(404).json({ error: "Not found" });
    } else {
      res.json(Item);
    }
  } catch (error) {
    console.error("Error retrieving the URL:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/shorten", async (req, res) => {
  console.log("POST /api/shorten called with:", req.body);
  const { originalUrl } = req.body;
  const nanoid = (await import("nanoid")).nanoid;
  const shortId = nanoid(10);
  const shortUrl = `http://tomoprojektukas.com/shorturl/${shortId}`;

  const params = {
    TableName: "Urls",
    Item: {
      shortUrl: shortUrl,
      originalUrl: originalUrl,
      clicks: 0,
    },
  };
  const command = new PutCommand(params);

  try {
    await docClient.send(command);
    res.json({ originalUrl, shortUrl });
  } catch (error) {
    console.error("DynamoDB error:", error);
    res.status(500).send("Server error");
  }
});

app.delete("/api/urls/:shortUrl", async (req, res) => {
  console.log("DELETE /api/urls/:shortUrl called with:", req.params.shortUrl);
  const params = {
    TableName: "Urls",
    Key: {
      shortUrl: req.params.shortUrl,
    },
  };
  const command = new DeleteCommand(params);

  try {
    await docClient.send(command);
    res.send("Deleted successfully");
  } catch (error) {
    console.error("Failed to delete URL:", error);
    res.status(500).send("Server error");
  }
});

app.get("/api/urls", async (req, res) => {
  console.log("Received request for URLs");
  const params = { TableName: "Urls" };
  const command = new ScanCommand(params);

  try {
    const { Items } = await docClient.send(command);
    console.log("Data retrieved:", Items);
    if (Items.length > 0) {
      res.json(Items);
    } else {
      res.status(200).json({ message: "No URLs found" });
    }
  } catch (err) {
    console.error("Error scanning DynamoDB:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Test API Route

app.get("/api/test", (req, res) => {
  console.log("GET /api/test called");
  res.json({ message: "Test API is working!" });
});

// Middleware for error handling
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
  testScanDynamoDB(); // Optionally test the scan function
});
