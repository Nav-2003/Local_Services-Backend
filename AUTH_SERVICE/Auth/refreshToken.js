import express from "express";
import CustomerData from "../db_model/customer.js";
import WorkerData from "../db_model/worker.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/refreshSignin", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No session",
      });
    }

    /* ---------- VERIFY TOKEN ---------- */
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );


    } catch (err) {
      console.log("JWT verify error:", err.message);
      return res.status(403).json({
        success: false,
        message: "Session expired",
      });
    }

    /* ---------- FIND USER ---------- */
    let user;

    if (decoded.role === "customer") {
      user = await CustomerData.findById(decoded.userId);
    } else {
      user = await WorkerData.findById(decoded.userId);
    }

    console.log("User:", user);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid session",
      });
    }

    /* ---------- NEW ACCESS TOKEN ---------- */
    const newAccessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: decoded.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      success: true,
      accessToken: newAccessToken,
      role: decoded.role,
      user: {
        id: user._id,
        email: user.email,
        role: decoded.role,
      },
    });

  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
