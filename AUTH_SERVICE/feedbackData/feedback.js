import express from "express";
import ServiceData from "../db_model/service.js";
import CustomerData from "../db_model/customer.js";
import { feedBackDataModel } from "../db_model/feedback.js";

const router=express.Router();

router.put('/putFeedback', async (req, res) => {
  try {
    const { workerEmail, customerEmail, text, rating } = req.body;

    const data = await ServiceData.findOne({ email: workerEmail });

    if (!data) {
      return res.status(404).json({ message: "Worker not found" });
    }
    data.totalWork += 1;
    data.rating += rating;
    data.avgRating = data.rating / data.totalWork;
    await data.save();
    const customer = await CustomerData.findOne({ email: customerEmail });

    const customerName = customer ? customer.name : "Unknown";

    const feedback = await feedBackDataModel.create({
      email: workerEmail,
      name: customerName,
      comment: text,
    });

    res.json({
      success: true,
      feedback
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put('/getFeedback', async (req, res) => {
    try {
        const { email } = req.body;

        // get feedbacks
        const feedbackDocs = await feedBackDataModel
            .find({ email: email })
            .sort({ createdAt: -1 });

        // get avg rating
        const service = await ServiceData.findOne({ email: email })
            .select("avgRating");

        // map to frontend format
        const feedbacks = feedbackDocs.map(f => ({
            _id: f._id,
            name: f.name,
            text: f.comment,        // 🔥 rename
            time: f.createdAt,      // 🔥 rename
            rating: service ? Math.round(service.avgRating) : 0 // same rating for all
        }));

        return res.json({
            success: true,
            rating: service ? service.avgRating : 0,
            feedbacks: feedbacks
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;