import { Request, Response } from "express";
import User from "../models/user";
import generateToken from "../utils/generateToken";

// ---------------------- SIGNUP ----------------------
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      fullName,   // ✅ FIXED
      email,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};


// ---------------------- LOGIN ----------------------
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ---------------------- GET LOGGED-IN USER ----------------------
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select("-password");
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user",
    });
  }
};
