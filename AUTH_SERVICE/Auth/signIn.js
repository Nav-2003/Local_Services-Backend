import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CustomerData from "../db_model/customer.js";
import WorkerData from "../db_model/worker.js";

const router = express.Router();

router.put("/signIn", async (req, res) => {
  try {
    let { email, pass, lat, lng } = req.body;
    /* ---------- VALIDATION ---------- */
    if (!email || !pass) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

  

    /* ---------- FIND USER ---------- */
    let user = await CustomerData.findOne({ email });
    let role = "customer";

    if (!user) {
      user = await WorkerData.findOne({ email });
      role = "worker";
    }



    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ---------- PASSWORD CHECK ---------- */
    const isMatch = await bcrypt.compare(pass, user.pass);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    /* ---------- ACCESS TOKEN ---------- */
    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    /* ---------- REFRESH TOKEN ---------- */
    const refreshToken = jwt.sign(
      {
        userId: user._id,
        role,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    /* ---------- SAVE USER SESSION ---------- */
    user.refreshToken = refreshToken;

    // Optional: save live location
    if (lat && lng) {
      user.lat = lat;
      user.lng = lng;
    }

    await user.save();

    /* ---------- COOKIE ---------- */
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    /* ---------- RESPONSE ---------- */
    return res.json({
      success: true,
      message: "Login successful",
      accessToken,
      role,
      user: {
        id: user._id,
        email: user.email,
        role,
      },
    });

  } catch (err) {
    console.error("SignIn Error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
