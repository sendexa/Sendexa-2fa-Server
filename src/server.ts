import express from "express";
import dotenv from "dotenv";
import app from "./app";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ 2FA server running on http://localhost:${PORT}`);
});
