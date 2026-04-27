import express from "express";
import CustomerData from "../db_model/customer.js";
import WorkerData from "../db_model/worker.js";

const router = express.Router();

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.put("/getDistance", async (req, res) => {
  try {
    const { workerEmail, customerEmail } = req.body;
    const result1 = await CustomerData.findOne({ email: customerEmail });
    const result2 = await WorkerData.findOne({ email: workerEmail });
    if (!result1 || !result2) {
      return res.status(404).json({ message: "User not found" });
    }

    let dist = getDistanceKm(
      result1.lat,
      result1.lng,
      result2.lat,
      result2.lng
    );

    dist = Number(dist.toFixed(2));
    const name=result1.name;
    return res.json({ distance: dist, name});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put('/putLiveLocation',async(req,res)=>{
      const {email,lat,lng}=req.body;
       let worker = await WorkerData.findOne({ email });
      if (worker) {
        await WorkerData.updateOne({ email }, { $set: { lat, lng } });
        return;
      }
      let customer = await CustomerData.findOne({ email });
      if (customer) {
        await CustomerData.updateOne({ email }, { $set: { lat, lng } });
      }
});

export default router;
