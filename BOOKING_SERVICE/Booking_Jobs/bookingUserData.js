import express from "express";
import BookingData from "../db/booking.js";

const router = express.Router();

router.put("/getUserDetail", async (req, res) => {
  try {
    const { email, bookingId } = req.body;

    if (!bookingId || !email) {
      return res.status(400).json({ message: "Missing bookingId or email" });
    }

    const booking = await BookingData.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let targetEmail;

    if (booking.workerEmail === email) {
      targetEmail = booking.customerEmail;
    } else {
      targetEmail = booking.workerEmail;
    }
    const resp = await fetch(
      "http://localhost:3000/api/auth/serviceData/getUserData",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: targetEmail }),
      },
    );

    // Check status
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    // Parse JSON body
    const data = await resp.json();
    console.log(data);
    return res.json(data);
  } catch (err) {
    console.log(err);
    if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT") {
      return res.status(503).json({
        message: "Auth service unavailable. Try again later.",
      });
    }

    console.error("getUserDetail error:", err.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.put("/getWorkerEmail", async (req, res) => {
  try {
    const { bookingId } = req.body;

    const data = await BookingData.findById(bookingId);

    if (!data) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.json({
      workerEmail: data.workerEmail,
      customerEmail: data.customerEmail,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

router.post("/bookingInfrom", async (req, res) => {
  const { email, type } = req.body;
  const results = await BookingData.find({
    [type]: true,
    $or: [{ workerEmail: email }, { customerEmail: email }],
  });

  if (results.length === 0) {
    return res.status(404).json({ message: "No bookings found" });
  }
  return res.json(
    results.map((b) => ({
      bookingId: b._id,
      title: b.service,
      time: b.time,
      amount: b.amount,
      status: type === "accept" ? "live" : type,
    })),
  );
});
export default router;
