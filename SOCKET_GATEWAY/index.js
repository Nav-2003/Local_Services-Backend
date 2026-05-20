import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectRedis } from "./src/redis.js";
import { initSocket } from "./src/socket.js";
import { redisClient } from "./src/redis.js";
import { getIO } from "./src/SocketInstance.js";
import bookingReq from "./Booking_Jobs/booking_req_worker.js";
import bookingRes from "./Booking_Jobs/booking_res_user.js"
const ip="54.89.167.115";
dotenv.config();

const app = express();
app.use(cors({
  origin:[`http://localhost:5173`, `http://${ip}:3001`, `http://${ip}`,`https://${ip}`,"https://localservices.publicvm.com",
  "https://www.localservices.publicvm.com",],
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app);

await connectRedis();
initSocket(server);

app.use("/api/socket/bookingReq",bookingReq);
app.use("/api/socket/bookingRes",bookingRes);


app.put("/api/socket/cancelBooking", async (req, res) => {
  try {
    const { workerEmail, customerEmail } = req.body;

    if (!workerEmail || !customerEmail) {
      return res.status(400).json({ error: "Emails required" });
    }

    const io = getIO();
    const workerSocket = await redisClient.get(`user:${workerEmail}`);
    const customerSocket = await redisClient.get(`user:${customerEmail}`);

    console.log("Worker socket:", workerSocket);
    console.log("Customer socket:", customerSocket);
  
    if (workerSocket) {
      io.to(workerSocket).emit("cancelBooking", {
        cancel:true,
      });
    }
    if (customerSocket) {
      io.to(customerSocket).emit("cancelBooking", {
        cancel:true
      });
    }

    return res.json({ success: true });

  } catch (err) {
    console.log("Cancel API error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
});



server.listen(3002, () => {
  console.log("SOCKET GATEWAY running on port 3002");
});
