const ApiVideoClient = require("@api.video/nodejs-client");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = express.Router();

router.post("/uploadTokens", async (req, res) => {
  try {
    const client = new ApiVideoClient({
      apiKey: process.env.API_KEY, // It retrieves your API key from .env.development
    });
    const newUploadToken = await client.uploadTokens.createToken();
    res.status(200).json({ newUploadToken });
  } catch (error) {
    res.status(401).send(error);
  }
});

router.get("/createUploadTokens", async (req, res) => {
  try {
    const client = new ApiVideoClient({
      apiKey: process.env.API_KEY, // It retrieves your API key from .env.development
    });
    const uploadTokensList = await client.uploadTokens.list();
    res.status(200).json({ uploadTokensList });
  } catch (error) {
    res.status(401).send(error);
  }
});

module.exports = router;
