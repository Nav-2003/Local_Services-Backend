import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: "Amount and bookingId required" });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100, // rupees → paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    });

    res.status(200).json({
      success: true,
      order,
    });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;