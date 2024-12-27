import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Generate Access And Refresh Token Method When You Call This Function You Will Get Access And Refresh Token
const generateAccessAndRefreshTokens = async (
  userId: mongoose.Types.ObjectId
) => {
  try {
    // Try Thing
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error in generateAccessAndRefreshTokens:", error);
    throw new ApiError(
      500,
      "Something Went Wrong While Generating Access And Refresh Token"
    );
  }
};

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, username, password } = req.body;
    let avatarLocalPath;
    if (req.files && "avatar" in req.files) {
      avatarLocalPath = req.files.avatar[0]?.path;
    }
    let coverImageLocalPath;

    if (
      req.files &&
      req.files &&
      "coverImage" in req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

    // Validate required fields
    if ([fullName, email, username, password].some((field) => !field.trim())) {
      throw new ApiError(400, "All fields are required");
    }

    // Check if the user already exists
    const existedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existedUser) {
      throw new ApiError(409, "User With Username Or Email Exists");
    }

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar File Is Required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath
      ? await uploadOnCloudinary(coverImageLocalPath)
      : undefined;

    if (!avatar) {
      throw new ApiError(400, "Error uploading avatar");
    }

    const user = await User.create({
      fullName,
      avatar: avatar.url,
      email,
      username: username.toLowerCase(),
      password,
      coverImage: coverImage?.url || "",
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "User Not Created");
    }

    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { user: createdUser },
          "User Registered Successfully"
        )
      );
    next();
  }
);

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
      throw new ApiError(400, "Email or Username is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      throw new ApiError(404, "User Not Found, Kindly Register First");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id as mongoose.Types.ObjectId
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = { httpOnly: true, secure: true };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User Logged In Successfully"
        )
      );
    next();
  }
);

const logoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(
      req.user?._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = { httpOnly: true, secure: true };

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
    next();
  }
);

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`
    );
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !(await user.isPasswordCorrect(oldPassword))) {
      throw new ApiError(401, "Invalid Password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password Changed"));
  }
);

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"));
});

const updateAccountDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      throw new ApiError(400, "All Fields Are Required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: { fullName, email } },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account Details Updated Successfully"));
  }
);

const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error While Uploading Avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Image Updated Successfully"));
});

const updateUserCoverImage = asyncHandler(
  async (req: Request, res: Response) => {
    const coverImageLocalPath = req.file?.path;

    if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!coverImage.url) {
      throw new ApiError(400, "Error while uploading cover image");
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { coverImage: coverImage.url } },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Cover image updated successfully"));
  }
);

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
};
