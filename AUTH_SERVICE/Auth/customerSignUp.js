import express from "express";
import bcrypt from "bcrypt";
import CustomerData from "../db_model/customer.js";

const router = express.Router();

router.put("/customerSignUp", async (req, res) => {
  try {
    const { email, name, phone, pass } = req.body;
    if (!email || !name || !phone || !pass) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await CustomerData.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPass = await bcrypt.hash(pass, 10);
    const customer = await CustomerData.create({
      email,
      name,
      phone,
      pass: hashedPass,
    });

    res.status(201).json({
      message: "Customer registered successfully",
      userId: customer._id,
    });

  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
