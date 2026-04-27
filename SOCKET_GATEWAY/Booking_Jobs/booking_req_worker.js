import express from "express";
import { getIO } from "../src/SocketInstance.js";
import { redisClient } from "../src/redis.js";

const router = express.Router();

router.put("/request_to_worker", async (req, res) => {
    try {
        const { name, dist, bookingId, workerEmail } = req.body;

        const io = getIO();

        const workerSocket = await redisClient.get(`user:${workerEmail}`);
        if (!workerSocket) {
            return res.status(404).json({
                success: false,
                message: "Worker is offline or not connected"
            });
        }
        io.to(workerSocket).emit("assignCustmorResult",{name,bookingId,dist});

        return res.status(200).json({
            success: true,
            message: "Request sent to worker"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;