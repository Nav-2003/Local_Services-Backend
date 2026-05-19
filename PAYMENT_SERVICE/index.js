import express from "express";
import cors from "cors";
import createOrder from "./payment/create-order.js";
import paymentVerify from "./payment/payment_verify.js";
import dotenv from "dotenv";

const ip="54.89.167.115";
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [`http://localhost:5173`, `http://${ip}`],
    credentials: true, 
  })
);

app.use("/api/payment/payment-init", createOrder);
app.use("/api/payment/payment-verify", paymentVerify);

app.listen(3003, () => {
  console.log("Payment service running on port 3003");
});