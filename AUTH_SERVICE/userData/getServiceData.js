import express from "express";
import ServiceData from "../db_model/service.js";
import { getDistanceKm } from "./getDistance.js";
import WorkerData from "../db_model/worker.js";
import CustomerData from "../db_model/customer.js";

const router = express.Router();

router.put("/getServiceData", async (req, res) => {
  try {
    const { service, lat, lng } = req.body;

    if (!service || !lat || !lng) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const result = await ServiceData.find({ service,active:true });
    const data = [];

    for (let ele of result) {
      const distance = getDistanceKm(lat, lng, ele.lat, ele.lng);
      if (distance <= 1000) {  
        const obj = ele.toObject();
        obj.distance = distance.toFixed(2);
        data.push(obj);
      }
    }

    res.json({ data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/getUserData", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    const worker = await WorkerData.findOne({ email });
    if (worker) {
      return res.json({
        name: worker.name,
        type: "worker",
        email: worker.email,
        phone: worker.phone
      });
    }
    const customer = await CustomerData.findOne({ email });
    if (customer) {
      return res.json({
        name: customer.name,
        type: "customer",
        email: customer.email,
        phone: customer.phone
      });
    }
    return res.status(404).json({ message: "User not found" });

  } catch (err) {
    console.error("getUserData error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
