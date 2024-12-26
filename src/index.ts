import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/database";
import app from "./app";

dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in Server Setup", error);
      throw error;
    });

    // Start the server
    app.listen(process.env.PORT || 4000, () => {
      console.log(`⚙️ Server is running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
