import express from "express";
import dotenv from "dotenv";
import app from "./app";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
