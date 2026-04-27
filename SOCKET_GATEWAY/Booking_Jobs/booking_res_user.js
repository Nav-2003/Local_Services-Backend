import express from "express";
import { getIO } from "../src/SocketInstance.js";
import { redisClient } from "../src/redis.js";

const router = express.Router();

router.put("/booking_accept", async (req, res) => {
    try {
        const { bookingId, customerEmail, workerEmail } = req.body;

        console.log("Received booking:", { bookingId, customerEmail, workerEmail });

        const io = getIO();

        const customerSocket = await redisClient.get(`user:${customerEmail}`);

        if (customerSocket) {
            io.to(customerSocket).emit("checkWorkerAssignResult", {
                result: true,
                bookingId
            });
        } else {
            console.log("Customer not online");
        }

        const response = await fetch("http://localhost:3000/api/status/updateStatus", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: workerEmail,
                status: false
            })
        });

        const data = await response.json();
        console.log("Status update response:", data);

        return res.status(200).json({
            success: true,
            message: "Booking accepted and processed"
        });

    } catch (err) {
        console.error("Error in booking_accept:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.put("/booking_reject", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const io = getIO();

        const customerSocket = await redisClient.get(`user:${email}`);

        if (customerSocket) {
            io.to(customerSocket).emit("checkWorkerAssignResult", {
                result: false
            });
        } else {
            console.log("Customer is offline");
        }

        return res.status(200).json({
            success: true,
            reject: true
        });

    } catch (err) {
        console.error("Reject error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.put("/cancel_customer",async(req,res)=>{
    const {workerEmail}=req.body;
    const io=getIO();
    const workerSocket=await redisClient.get(`user:${workerEmail}`);
    io.to(workerSocket).emit("customerCancel",{});
    return res.json({"cancel":true})
})
export default router;
