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

const ip="54.89.167.115";
dotenv.config();

const app = express();

await mongoose.connect("mongodb+srv://yashi:naveen%402003@cluster0.vrbuumh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("DB is connected successfully")
}).catch((err)=>{
   console.log(err);
})


const allowedOrigins = [
  `http://${ip}`,
  `https://${ip}`,
  `http://localhost:5173`,
  `http://localhost:3001`,
  `http://localhost:3002`,
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

app.use("/api/auth/userAuth/signUp", customerAuth);
app.use("/api/auth/workerAuth/signUp", workerAuth);
app.use("/api/auth/userAuth", authSign);
app.use("/api/auth/userAuth/refresh",refresh)
app.use("/api/auth/userAuth/userLogout",logout);
app.use("/api/auth/serviceData",serviceData);
app.use("/api/auth/serviceDist",serviceData);
app.use("/api/auth/location",location);
app.use("/api/auth/serviceDist",serviceDist);
app.use("/api/auth/feedback",feedback);
app.use("/api/auth/status",status);

app.get('/',(req,res)=>{
   res.send("welcome the auth server")
})

app.listen(3000,()=>{
  console.log("server is running fine")
});

