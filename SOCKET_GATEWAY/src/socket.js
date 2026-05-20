import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient, redisClient } from "./redis.js";
import { setIO } from "./SocketInstance.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173",`https://54.89.167.115`],
      credentials: true,
    },
  });

  setIO(io);
  io.adapter(createAdapter(pubClient, subClient));
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register-Socket", async ({ email }) => {
      try {
        console.log(email, "mapped to", socket.id);
        await redisClient.set(`user:${email}`, socket.id);
        await redisClient.set(`socket:${socket.id}`, email);
      } catch (err) {
        console.log("Register error:", err);
      }
    });

    socket.on("putLiveLocation", async ({ email, lat, lng }) => {
      if (!email) return;

      try {
        await fetch("http://localhost:3000/api/auth/location/putLocation", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, lat, lng }),
        });
      } catch (err) {
        console.error("Location update failed:", err);
      }
    });

    socket.on("getLiveLocation", async ({ email }) => {
      if (!email) return;

      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/location/getLocation/${email}`,
        );
        
        const data = await response.json();
        socket.emit("liveLocationResult", data);
      } catch (err) {
        console.error("Fetch location error:", err);
      }
    });


    socket.on("chatMessage", async ({ email, sender, text }) => {
      const socketId = await redisClient.get(`user:${email}`);
      io.to(socketId).emit("chatMessage", {
        sender: sender,
        text: text,
        time: new Date().toISOString(),
      });
    });

    socket.on("liveDistance", async ({ workerEmail, customerEmail }) => {
        const result = await fetch("http://localhost:3000/api/auth/serviceDist/getDistance", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ workerEmail, customerEmail }),
    });
    const data = await result.json();
    const distance=data.distance;
      socket.emit("liveDistance", { distance });
    });

   socket.on("paymentStatus", async ({ bookingId }) => {
  try {

    const response = await fetch("http://localhost:3001/api/booking/Booking/bookingComplete", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bookingId })
    });
    const result = await response.json();
    const email = result.customerEmail;
    const socketId = await redisClient.get(`user:${email}`);
    if (socketId) {
      io.to(socketId).emit("paymentResponse", {
        payment: "done"
      });
    }

  } catch (error) {
    console.error(error);
  }
});


    socket.on("disconnect", async () => {
      try {
        console.log("Socket disconnected:", socket.id);
        const email = await redisClient.get(`socket:${socket.id}`);
        if (email) {
          await redisClient.del(`user:${email}`);
          await redisClient.del(`socket:${socket.id}`);
          console.log(email, "removed from redis");
        }
      } catch (err) {
        console.log("Disconnect error:", err);
      }
    });
  });

  return io;
};
