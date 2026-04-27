import express from "express";
import BookingData from "../db/booking.js";

const router = express.Router();

router.put("/cancelBooking", async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ error: "bookingId is required" });
    }

    const data = await BookingData.findById(bookingId);

    if (!data) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const { workerEmail, customerEmail } = data;

    await BookingData.findByIdAndUpdate(bookingId, {
      $set: {
        accept: false,
        cancel: true,
        completed: false,
        time: Date.now(),
      },
    });

    let response = await fetch("http://localhost:3002/api/cancelBooking", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workerEmail, customerEmail }),
    });

    if (!response.ok) {
      console.log("Notification service failed");
    }

    response = await fetch("http://localhost:3000/api/status/updateStatus", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: workerEmail,
        status: true,
      }),
    });

    return res.json({ cancel: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

export default router;
