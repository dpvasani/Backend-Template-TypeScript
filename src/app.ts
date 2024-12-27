// Load environment variables
import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

// Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*", // Add a fallback origin
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
// Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Serve static assets
app.use(express.static("public"));
app.use(cookieParser());

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error in Server Setup", err);
  res.status(500).send("Internal Server Error");
});

console.log("App Is Running");

// Import Routes
import userRouter from "./routes/user.routes";

// Routes Declaration
app.use("/api/v1/users", userRouter);

export default app;
