import express from "express";
import customerAuth from "./Auth/customerSignUp.js";
import workerAuth from "./Auth/workerSignUp.js";
import authSign from "./Auth/signIn.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import logout from "./Auth/logout.js";
import refresh from "./Auth/refreshToken.js";
import serviceData from "./userData/getServiceData.js"
import serviceDist from "./userData/getDistance.js";
import location from "./userData/locationData.js"
import feedback from "./feedbackData/feedback.js"
import status from "./userData/updateStatus.js";

dotenv.config();

const app = express();
//startDistanceWorker();

async function startServer() {
  try {
    await mongoose.connect(
      "mongodb+srv://yashi:naveen%402003@cluster0.vrbuumh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("DB connected successfully...");

    app.listen(3000, () => {
      console.log("Auth Service is Listening on port 3000");
    });

  } catch (error) {
    console.error("DB connection failed:", error);
  }
}
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:3002"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/userAuth/signUp", customerAuth);
app.use("/api/workerAuth/signUp", workerAuth);
app.use("/api/userAuth", authSign);
app.use("/api/userAuth/refresh",refresh)
app.use("/api/userAuth/userLogout",logout);
app.use("/api/serviceData",serviceData);
app.use("/api/serviceDist",serviceData);
app.use("/api/location",location);
app.use("/api/serviceDist",serviceDist);
app.use("/api/feedback",feedback);
app.use("/api/status",status);



startServer();
