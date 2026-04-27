import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import WorkerData from "../db_model/worker.js";
import ServiceData from "../db_model/service.js";

const router = express.Router();

router.put("/workerSignUp", async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, pass, adhar, service, money, lat, lng } = req.body;

    if (!name || !email || !phone || !pass || !adhar || !service || !lat || !lng) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await WorkerData.findOne({ email }).session(session);
    if (exists) {
      await session.abortTransaction();
      return res.status(409).json({ message: "Worker already exists" });
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    await WorkerData.create([{
      name,
      email,
      phone,
      pass: hashedPass,
      adhar,
      lat,
      lng
    }], { session });

    await ServiceData.create([{
      name,
      email,
      service,
      money: Number(money) || 400,
      lat,
      lng
    }], { session });

    await session.commitTransaction();

    res.status(201).json({ message: "Worker registered successfully" });

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
});

router.post("/checkEmail", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    const exists = await WorkerData.findOne({ email });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
