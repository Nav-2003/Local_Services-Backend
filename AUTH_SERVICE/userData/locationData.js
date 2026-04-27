import express from "express";
import WorkerData from "../db_model/worker.js";
import CustomerData from "../db_model/customer.js";

const router = express.Router();

router.put("/putLocation", async (req, res) => {
  try {
    const { email, lat, lng } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Check Worker
    const worker = await WorkerData.findOne({ email });
    if (worker) {
      await WorkerData.updateOne(
        { email },
        { $set: { lat, lng } }
      );

      return res.json({ message: "Worker location updated" });
    }

    // Check Customer
    const customer = await CustomerData.findOne({ email });

    if (customer) {
      await CustomerData.updateOne(
        { email },
        { $set: { lat, lng } }
      );

      return res.json({ message: "Customer location updated" });
    }

    return res.status(404).json({ message: "User not found" });

  } catch (err) {
    console.error("Location update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getLocation/:email", async (req, res) => {
    try {
        const { email } = req.params;

        const worker = await WorkerData.findOne({ email });
        const customer = await CustomerData.findOne({ email });

        // If worker exists
        if (worker) {
            return res.status(200).json({
                type: "worker",
                lat:worker.lat,
                lng:worker.lng
            });
        }

        // If customer exists
        if (customer) {
            return res.status(200).json({
                type: "customer",
                lat:customer.lat,
                lng:customer.lng
            });
        }

        // If neither exists
        return res.status(404).json({
            message: "User not found"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server Error"
        });
    }
});

export default router;