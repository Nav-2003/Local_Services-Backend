import express from "express";
import  ServiceData from "../db_model/service.js";

const router = express.Router();

router.put('/updateStatus', async (req, res) => {
    try {
        const { email, status } = req.body;
        const updatedWorker = await ServiceData.findOneAndUpdate(
            { email },
            { $set: { active: status } },
            { new: true } 
        );

        if (!updatedWorker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: updatedWorker
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

export default router;