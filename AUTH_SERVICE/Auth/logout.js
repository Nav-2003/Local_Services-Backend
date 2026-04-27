import express from "express";
import CustomerData from "../db_model/customer.js";
import WorkerData from "../db_model/worker.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    /* No session */
    if (!refreshToken) {
      return res.json({
        success: true,
        message: "Already logged out",
      });
    }

    /* Decode token */
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch {
      res.clearCookie("refreshToken");
      return res.json({
        success: true,
        message: "Logged out",
      });
    }

    /* Find user */
    let user;
    if (decoded.role === "customer") {
      user = await CustomerData.findById(decoded.userId);
    } else {
      user = await WorkerData.findById(decoded.userId);
    }

    /* Remove refresh token from DB */
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    /* Clear cookie */
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logout successful",
    });

  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
