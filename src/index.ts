import express from "express";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config(); // This should load your .env variables
import connectDB from "./db/database";
// import app from "./app"; // Import the app instance

// Connect to the database and start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("MongoDB Connected Successfully");
    // Start the server
    // const PORT = process.env.PORT || 4000;
    // app.listen(PORT, () => {
    //   console.log(`Server is running on port ${PORT}`);
    // });
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
  }
};

startServer();
