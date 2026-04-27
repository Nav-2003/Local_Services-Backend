import express from "express";
import BookingData from "../db/booking.js";


const router=express.Router();

router.put('/accept', async (req, res) => {
    try {
        const { email, bookingId } = req.body;
        if (!email || !bookingId) {
            return res.json({ msg: "email or bookingId missing" });
        }
        const data = await BookingData.findByIdAndUpdate(
            bookingId,
            { $set: { accept: true, cancel: false, completed: false, time: Date.now() } },
            { new: true }
        );
        const customerEmail = data.customerEmail;
        const workerEmail=data.workerEmail;
        await fetch("http://localhost:3002/api/bookingRes/booking_accept",{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({bookingId,customerEmail,workerEmail})
        })
        return res.json({ Accept: true });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
    }
});

export default router;