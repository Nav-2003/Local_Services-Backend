import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectRedis } from "./src/redis.js";
import { initSocket } from "./src/socket.js";
// import BookingReq from "./rabbitmq/rabbitMqBookingReq.js";
// import { connectRabbitMQ } from "./rabbitmq/rabbitmqConfig.js";
// import BookingRes from "./rabbitmq/rabbitmqRes.js";
import { redisClient } from "./src/redis.js";
import { getIO } from "./src/SocketInstance.js";
import bookingReq from "./Booking_Jobs/booking_req_worker.js";
import bookingRes from "./Booking_Jobs/booking_res_user.js"

dotenv.config();

const app = express();
app.use(cors({
  origin:["http://localhost:5173", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());
const server = http.createServer(app);
//await connectRabbitMQ();
await connectRedis();
initSocket(server);
//await BookingReq();
//await BookingRes();

app.use("/api/bookingReq",bookingReq);
app.use("/api/bookingRes",bookingRes);


app.put("/api/cancelBooking", async (req, res) => {
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
