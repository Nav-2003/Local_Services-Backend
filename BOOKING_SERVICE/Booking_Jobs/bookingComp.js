import express from "express";
import BookingData from "../db/booking.js";

const router = express.Router();

router.put("/bookingComplete", async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const booking = await BookingData.findByIdAndUpdate(
      bookingId,
      {
        $set: {
          accept: false,
          cancel: false,
          completed: true,
          time: Date.now(),
        },
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    fetch("http://localhost:3000/api/status/updateStatus", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: booking.workerEmail,
        status: true,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Status updated:", data))
      .catch((err) => console.log("Status update failed:", err.message));

    res.json({
      success: true,
      customerEmail: booking.customerEmail,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;