import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import User from "../models/user.model"; // Ensure default export
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Extend Request interface to include `user` property
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
    }
  }
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from cookies or Authorization header
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace(/^Bearer\s+/, "");

      // Check if token is missing
      if (!token) {
        throw new ApiError(401, "Unauthorized request: Token not provided");
      }

      // Verify and decode the token
      const decodedToken = jwt.verify(
        token,
        (process.env.ACCESS_TOKEN_SECRET || "").trim()
      ) as jwt.JwtPayload;

      // Fetch user from the database using decoded token's user ID
      const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      // If user not found
      if (!user) {
        throw new ApiError(401, "Invalid Access Token: User not found");
      }

      // Attach user to the request object
      req.user = user.toObject(); // Convert Mongoose document to plain object
      next();
    } catch (error) {
      // Handle invalid token or verification failure
      if (error instanceof Error) {
        next(new ApiError(401, error.message || "Invalid Access Token"));
      } else {
        next(new ApiError(401, "Invalid Access Token"));
      }
    }
  }
);
